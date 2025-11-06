import OBR, { type Image, type Item, isImage } from "@owlbear-rodeo/sdk";

import {
  DIAMETER,
  FULL_BAR_HEIGHT,
  SHORT_BAR_HEIGHT,
  addHealthAttachmentsToArray,
  addNameTagAttachmentsToArray,
  bubbleBackgroundId,
  bubbleTextId,
  createHealthBar,
  createNameTag,
  createStatBubble,
  hpTextId,
} from "./compoundItemHelpers";
import { getOriginAndBounds } from "./mathHelpers";
import createContextMenuItems from "./contextMenuItems";
import { defaultSettings, getSettings } from "../helpers/settingsHelpers";
import { TOKEN_METADATA_KEY, parseTokenData } from "../helpers/tokenHelpers";
import type {
  DefinedHeroTokenData,
  DefinedMonsterTokenData,
  MinionTokenData,
} from "../types/tokenDataZod";
import { MinionGroupZod, type MinionGroup } from "../types/minionGroup";
import z from "zod";
import { MONSTER_GROUPS_METADATA_KEY } from "../helpers/monsterGroupHelpers";
import { getPluginId } from "../helpers/getPluginId";

let itemsLast: Image[] = []; // for item change checks
const addItemsArray: Item[] = []; // for bulk addition or changing of items
const deleteItemsArray: string[] = []; // for bulk deletion of scene items
let settings = defaultSettings;
let callbacksStarted = false;
let userRoleLast: "GM" | "PLAYER";
let themeMode: "DARK" | "LIGHT";
let minionGroups: MinionGroup[] = [];
let minionGroupCounts: { [groupId: string]: number } = {};

export default async function startBackground() {
  const start = async () => {
    settings = (await getSettings(settings)).settings;
    themeMode = (await OBR.theme.getTheme()).mode;
    createContextMenuItems(settings, themeMode);
    const minionGroupParse = z
      .array(MinionGroupZod)
      .safeParse((await OBR.scene.getMetadata())[MONSTER_GROUPS_METADATA_KEY]);
    minionGroups = minionGroupParse.success ? minionGroupParse.data : [];
    await refreshAllHealthBars();
    await startCallbacks();
  };

  // Handle when the scene is either changed or made ready after extension load
  OBR.scene.onReadyChange(async (isReady) => {
    if (isReady) start();
  });

  // Check if the scene is already ready once the extension loads
  const isReady = await OBR.scene.isReady();
  if (isReady) start();
}

async function refreshAllHealthBars() {
  // console.log("refresh");
  //get shapes from scene
  const items: Image[] = await OBR.scene.items.getItems(
    (item) =>
      (item.layer === "CHARACTER" || item.layer === "MOUNT") && isImage(item),
  );

  //store array of all items currently on the board for change monitoring
  itemsLast = items;

  updateMinionGroupCounts(items);

  //draw health bars
  const roll = await OBR.player.getRole();
  const sceneDpi = await OBR.scene.grid.getDpi();
  for (const item of items) {
    updateTokenOverlay(item, roll, sceneDpi);
  }

  await sendItemsToScene(addItemsArray, deleteItemsArray);

  //update global item id list for orphaned health bar monitoring
  const itemIds: string[] = [];
  for (const item of items) {
    itemIds.push(item.id);
  }
}

async function startCallbacks() {
  if (!callbacksStarted) {
    // Don't run this again unless the listeners have been unsubscribed
    callbacksStarted = true;

    // Handle theme changes
    const unSubscribeFromTheme = OBR.theme.onChange((theme) => {
      themeMode = theme.mode;
      createContextMenuItems(settings, themeMode);
    });

    // Handle role changes
    userRoleLast = await OBR.player.getRole();
    const unSubscribeFromPlayer = OBR.player.onChange(async () => {
      // Do a refresh if player role change is detected
      const userRole = await OBR.player.getRole();
      if (userRole !== userRoleLast) {
        refreshAllHealthBars();
        userRoleLast = userRole;
      }
    });

    // Handle room metadata changes
    const unsubscribeFromRoomMetadata = OBR.room.onMetadataChange(
      async (metadata) => {
        const { settings: newSettings, isChanged: doRefresh } =
          await getSettings(settings, metadata);
        settings = newSettings;
        if (doRefresh) {
          createContextMenuItems(settings, themeMode);
          refreshAllHealthBars();
        }
      },
    );

    // Handle scene metadata changes
    const unsubscribeFromSceneMetadata = OBR.scene.onMetadataChange(
      (metadata) => {
        const minionGroupParse = z
          .array(MinionGroupZod)
          .safeParse(metadata[MONSTER_GROUPS_METADATA_KEY]);
        minionGroups = minionGroupParse.success ? minionGroupParse.data : [];
        refreshAllHealthBars();
      },
    );

    // Handle item changes (Update health bars)
    const unsubscribeFromItems = OBR.scene.items.onChange(
      async (itemsFromCallback) => {
        // Filter items for only images from character and mount layers
        const imagesFromCallback: Image[] = [];
        for (const item of itemsFromCallback) {
          if (
            (item.layer === "CHARACTER" || item.layer === "MOUNT") &&
            isImage(item)
          ) {
            imagesFromCallback.push(item);
          }
        }

        //create list of modified and new items, skipping deleted items
        const minionsChanged = updateMinionGroupCounts(imagesFromCallback);
        const changedItems: Image[] = getChangedItems(
          imagesFromCallback,
          minionsChanged,
        );

        //update array of all items currently on the board
        itemsLast = imagesFromCallback;

        //draw health bars
        const role = await OBR.player.getRole();
        const sceneDpi = await OBR.scene.grid.getDpi();
        for (const item of changedItems) {
          updateTokenOverlay(item, role, sceneDpi);
        }

        await sendItemsToScene(addItemsArray, deleteItemsArray);
      },
    );

    // Unsubscribe listeners that rely on the scene if it stops being ready
    const unsubscribeFromScene = OBR.scene.onReadyChange((isReady) => {
      if (!isReady) {
        unSubscribeFromTheme();
        unSubscribeFromPlayer();
        unsubscribeFromRoomMetadata();
        unsubscribeFromSceneMetadata();
        unsubscribeFromItems();
        unsubscribeFromScene();
        callbacksStarted = false;
      }
    });
  }
}

function getChangedItems(
  imagesFromCallback: Image[],
  includeAllMinions: boolean,
) {
  const changedItems: Image[] = [];

  let s = 0; // # items skipped in itemsLast array, caused by deleted items
  for (let i = 0; i < imagesFromCallback.length; i++) {
    if (i > itemsLast.length - s - 1) {
      //check for new items at the end of the list
      changedItems.push(imagesFromCallback[i]);
    } else if (itemsLast[i + s].id !== imagesFromCallback[i].id) {
      s++; // Skip an index in itemsLast
      i--; // Reuse the index item in imagesFromCallback
    } else if (
      //check for scaling changes
      !(
        itemsLast[i + s].scale.x === imagesFromCallback[i].scale.x &&
        itemsLast[i + s].scale.y === imagesFromCallback[i].scale.y &&
        (itemsLast[i + s].name === imagesFromCallback[i].name ||
          !settings.nameTagsEnabled)
      )
    ) {
      // Attachments must be deleted to prevent ghost selection highlight bug
      deleteItemsArray.push(hpTextId(imagesFromCallback[i].id));
      changedItems.push(imagesFromCallback[i]);
    } else if (
      //check position, visibility, and metadata changes
      !(
        itemsLast[i + s].position.x === imagesFromCallback[i].position.x &&
        itemsLast[i + s].position.y === imagesFromCallback[i].position.y &&
        itemsLast[i + s].grid.offset.x ===
          imagesFromCallback[i].grid.offset.x &&
        itemsLast[i + s].grid.offset.y ===
          imagesFromCallback[i].grid.offset.y &&
        itemsLast[i + s].grid.dpi === imagesFromCallback[i].grid.dpi &&
        itemsLast[i + s].visible === imagesFromCallback[i].visible &&
        JSON.stringify(itemsLast[i + s].metadata[TOKEN_METADATA_KEY]) ===
          JSON.stringify(imagesFromCallback[i].metadata[TOKEN_METADATA_KEY])
      ) ||
      (includeAllMinions &&
        (imagesFromCallback[i].metadata[TOKEN_METADATA_KEY] as MinionTokenData)
          ?.type === "MINION")
    ) {
      //update items
      changedItems.push(imagesFromCallback[i]);
    }
  }
  return changedItems;
}

function updateTokenOverlay(item: Image, role: "PLAYER" | "GM", dpi: number) {
  const token = parseTokenData(item.metadata);
  if (
    token.type === undefined ||
    token.type === "HERO" ||
    token.type === "MONSTER"
  ) {
    updateHeroMonsterOverlay(item, token, role, dpi);
  }
  if (token.type === "MINION") {
    const minionGroup = minionGroups.find((item) => item.id === token.groupId);
    if (minionGroup) updateMinionOverlay(item, role, dpi, minionGroup);
  }
}

function updateHeroMonsterOverlay(
  item: Image,
  token: DefinedHeroTokenData | DefinedMonsterTokenData,
  role: "PLAYER" | "GM",
  dpi: number,
) {
  const { origin, bounds } = getOriginAndBounds(settings, item, dpi);

  if (role === "PLAYER" && token.gmOnly && !settings.showHealthBars) {
    // Display nothing, explicitly remove all attachments
    addHealthAttachmentsToArray(deleteItemsArray, item.id);
    for (let i = 0; i < 3; i++) {
      deleteItemsArray.push(
        bubbleBackgroundId(item.id, i),
        bubbleTextId(item.id, i),
      );
    }
  } else if (role === "PLAYER" && token.gmOnly && settings.showHealthBars) {
    // Display limited stats depending on GM configuration
    createLimitedHealthBar();
  } else {
    // Display full stats
    const hasHealthBar = createFullHealthBar();

    const MARGIN = 2;
    const bubblePosition = {
      x: origin.x + bounds.width / 2 - DIAMETER / 2 - MARGIN,
      y: origin.y - DIAMETER / 2 - 2 * MARGIN,
    };
    if (hasHealthBar) bubblePosition.y -= FULL_BAR_HEIGHT;
    if (settings.justifyHealthBarsTop)
      bubblePosition.y = origin.y + DIAMETER / 2;

    const stats: { color: string; value: number; showBubble: boolean }[] = [];

    if (token.type === "HERO") {
      stats.push(
        {
          color: "darkgoldenrod",
          value: token.surges,
          showBubble: token.surges > 0,
        },
        {
          color: "cornflowerblue",
          value: token.heroicResource,
          showBubble: token.heroicResource !== 0,
        },
      );
    }
    stats.push({
      color: "olivedrab",
      value: token.temporaryStamina,
      showBubble: token.temporaryStamina > 0,
    });

    for (let i = 0; i < stats.length; i++) {
      if (stats[i].showBubble) {
        addItemsArray.push(
          ...createStatBubble(
            item,
            stats[i].value,
            stats[i].color,
            bubblePosition,
            bubbleBackgroundId(item.id, i),
            bubbleTextId(item.id, i),
          ),
        );

        bubblePosition.x -= DIAMETER + MARGIN;
      } else {
        deleteItemsArray.push(
          bubbleBackgroundId(item.id, i),
          bubbleTextId(item.id, i),
        );
      }
    }
  }

  // Create name tag
  const plainText = token.name;
  if (settings.nameTagsEnabled && plainText !== "") {
    const nameTagPosition = {
      x: origin.x,
      y: origin.y,
    };
    if (settings.justifyHealthBarsTop) {
      if (
        token.staminaMaximum <= 0 ||
        (role === "PLAYER" && token.gmOnly && !settings.showHealthBars)
      ) {
        nameTagPosition.y = origin.y - 4;
      } else if (role === "PLAYER" && token.gmOnly && settings.showHealthBars) {
        nameTagPosition.y = origin.y - SHORT_BAR_HEIGHT - 4;
      } else {
        nameTagPosition.y = origin.y - FULL_BAR_HEIGHT - 4;
      }
    }
    addItemsArray.push(
      ...createNameTag(
        item,
        dpi,
        plainText,
        nameTagPosition,
        settings.justifyHealthBarsTop ? "DOWN" : "UP",
      ),
    );
    // globalItemsWithNameTags.push(item);
  } else {
    addNameTagAttachmentsToArray(deleteItemsArray, item.id);
  }

  function createLimitedHealthBar() {
    // Clear other attachments
    deleteItemsArray.push(hpTextId(item.id));
    for (let i = 0; i < 3; i++) {
      deleteItemsArray.push(
        bubbleBackgroundId(item.id, i),
        bubbleTextId(item.id, i),
      );
    }

    // return early if health bar shouldn't be created
    if (token.staminaMaximum <= 0) {
      addHealthAttachmentsToArray(deleteItemsArray, item.id);
      return;
    }

    deleteItemsArray.push(hpTextId(item.id));
    addItemsArray.push(
      ...createHealthBar(
        item,
        bounds,
        token.stamina,
        token.staminaMaximum,
        !token.gmOnly,
        origin,
        "short",
        settings.segmentsCount,
      ),
    );
  }

  /**
   * Create a health bar.
   * @returns True if a health bar was created.
   */
  function createFullHealthBar() {
    // return early if health bar shouldn't be created
    if (token.staminaMaximum <= 0) {
      addHealthAttachmentsToArray(deleteItemsArray, item.id);
      return false;
    }

    addItemsArray.push(
      ...createHealthBar(
        item,
        bounds,
        token.stamina,
        token.staminaMaximum,
        !token.gmOnly,
        origin,
      ),
    );
    return true;
  }
}

function updateMinionOverlay(
  item: Image,
  role: "PLAYER" | "GM",
  dpi: number,
  minionGroup: MinionGroup,
) {
  const { origin, bounds } = getOriginAndBounds(settings, item, dpi);

  if (role === "PLAYER") {
    // Display nothing, explicitly remove all attachments
    for (let i = 0; i < 2; i++) {
      deleteItemsArray.push(
        bubbleBackgroundId(item.id, i),
        bubbleTextId(item.id, i),
      );
    }
  } else {
    // Display full stats

    const MARGIN = 2;
    const bubblePosition = {
      x: origin.x + bounds.width / 2 - DIAMETER / 2 - MARGIN,
      y: origin.y - DIAMETER / 2 - 2 * MARGIN,
    };
    if (settings.justifyHealthBarsTop)
      bubblePosition.y = origin.y + DIAMETER / 2;

    const stats: {
      color: string;
      value: number | string;
      showBubble: boolean;
    }[] = [];

    const groupRequiredChange = Math.trunc(
      Math.ceil(minionGroup.currentStamina / minionGroup.individualStamina) -
        minionGroupCounts[minionGroup.id],
    );

    stats.push(
      {
        color: "#a0201f",
        value: minionGroup.individualStamina,
        showBubble: true,
      },
      {
        color: "black",
        value:
          groupRequiredChange > 0
            ? `+${groupRequiredChange}`
            : groupRequiredChange,
        showBubble: groupRequiredChange !== 0,
      },
    );

    for (let i = 0; i < stats.length; i++) {
      if (stats[i].showBubble) {
        addItemsArray.push(
          ...createStatBubble(
            item,
            stats[i].value,
            stats[i].color,
            bubblePosition,
            bubbleBackgroundId(item.id, i),
            bubbleTextId(item.id, i),
          ),
        );

        bubblePosition.x -= DIAMETER + MARGIN;
      } else {
        deleteItemsArray.push(
          bubbleBackgroundId(item.id, i),
          bubbleTextId(item.id, i),
        );
      }
    }
  }

  // Create name tag
  const plainText = minionGroup.name;
  if (settings.nameTagsEnabled && plainText !== "") {
    const nameTagPosition = {
      x: origin.x,
      y: origin.y,
    };
    if (settings.justifyHealthBarsTop) {
      nameTagPosition.y = origin.y - 4;
    }
    addItemsArray.push(
      ...createNameTag(
        item,
        dpi,
        plainText,
        nameTagPosition,
        settings.justifyHealthBarsTop ? "DOWN" : "UP",
      ),
    );
    // globalItemsWithNameTags.push(item);
  } else {
    addNameTagAttachmentsToArray(deleteItemsArray, item.id);
  }
}

async function sendItemsToScene(
  addItemsArray: Item[],
  deleteItemsArray: string[],
) {
  // console.log("added items length", addItemsArray.length);
  // console.log("deleted items length", deleteItemsArray.length);
  await OBR.scene.local.deleteItems(deleteItemsArray);
  await OBR.scene.local.addItems(addItemsArray);
  deleteItemsArray.length = 0;
  addItemsArray.length = 0;
}

function updateMinionGroupCounts(items: Item[]) {
  const newMinionGroupCounts: { [groupId: string]: number } = {};
  minionGroups.forEach((group) => {
    newMinionGroupCounts[group.id] = items
      .map(
        (item) =>
          (item.metadata?.[getPluginId("metadata")] as { groupId?: string })
            ?.groupId,
      )
      .filter((val) => val === group.id).length;
  });
  if (
    Object.keys(minionGroupCounts).length !==
    Object.keys(newMinionGroupCounts).length
  ) {
    minionGroupCounts = newMinionGroupCounts;
    return true;
  }
  for (const minionGroup of minionGroups) {
    if (
      newMinionGroupCounts[minionGroup.id] !== minionGroupCounts[minionGroup.id]
    ) {
      minionGroupCounts = newMinionGroupCounts;
      return true;
    }
  }
  minionGroupCounts = newMinionGroupCounts;
  return false;
}
