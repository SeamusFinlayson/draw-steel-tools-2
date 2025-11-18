import OBR, { type Image, type Item, isImage } from "@owlbear-rodeo/sdk";
import { hpTextId } from "./overlays/compoundItemHelpers";
import createContextMenuItems from "./contextMenuItems";
import { defaultSettings, getSettings } from "../helpers/settingsHelpers";
import { TOKEN_METADATA_KEY, parseTokenData } from "../helpers/tokenHelpers";
import type { MinionTokenData } from "../types/tokenDataZod";
import { MinionGroupZod, type MinionGroup } from "../types/minionGroup";
import z from "zod";
import { MONSTER_GROUPS_METADATA_KEY } from "../helpers/monsterGroupHelpers";
import { setDifference } from "../helpers/setDifference";
import { sendItemsToScene } from "./sendItemsToScene";
import { createHeroOverlay } from "./overlays/createHeroOverlay";
import { createMonsterOverlay } from "./overlays/createMonsterOverlay";
import { createMinionOverlay } from "./overlays/createMinionOverlay";
import {
  getMinionTokenCounts,
  type TokenCounts,
} from "../helpers/getMinionTokenCounts";

type AttachmentLog = { image: Image; attachmentIds: string[] } | undefined;
type AttachmentLogs = {
  [id: string]: AttachmentLog;
};
let attachmentLog: AttachmentLogs = {}; // for item change checks
const addItemsArray: Item[] = []; // for bulk addition or changing of items
const deleteItemsArray: string[] = []; // for bulk deletion of scene items
let settings = defaultSettings;
let callbacksStarted = false;
let themeMode: "DARK" | "LIGHT";
let minionGroups: MinionGroup[] = [];
let minionTokenCounts: TokenCounts;
let upToDateSceneItems: Item[] = [];

export default async function startBackground() {
  const start = async () => {
    settings = (await getSettings(settings)).settings;
    themeMode = (await OBR.theme.getTheme()).mode;
    upToDateSceneItems = await OBR.scene.items.getItems();
    createContextMenuItems(settings, themeMode);
    const minionGroupParse = z
      .array(MinionGroupZod)
      .safeParse((await OBR.scene.getMetadata())[MONSTER_GROUPS_METADATA_KEY]);
    minionGroups = minionGroupParse.success ? minionGroupParse.data : [];
    await refreshAllAttachments();
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

async function refreshAllAttachments() {
  const [role, sceneDpi] = await Promise.all([
    OBR.player.getRole(),
    OBR.scene.grid.getDpi(),
  ]);

  const images = upToDateSceneItems.filter((item) => isImage(item));

  const { counts } = getMinionTokenCounts(
    images,
    minionGroups,
    minionTokenCounts,
  );
  minionTokenCounts = counts;

  // Update attachments
  const newAttachmentLog: AttachmentLogs = {};
  for (const image of images) {
    const attachmentIds = updateTokenOverlay(image, role, sceneDpi);
    newAttachmentLog[image.id] = { image, attachmentIds };
  }
  attachmentLog = newAttachmentLog;
  await sendItemsToScene(addItemsArray, deleteItemsArray);
}

async function startCallbacks() {
  if (!callbacksStarted) {
    // Don't run this again unless the listeners have been unsubscribed
    callbacksStarted = true;

    // Handle theme changes
    OBR.theme.onChange((theme) => {
      themeMode = theme.mode;
      createContextMenuItems(settings, themeMode);
    });

    // Handle role changes
    let userRoleLast = await OBR.player.getRole();
    OBR.player.onChange(async () => {
      // Do a refresh if player role change is detected
      const userRole = await OBR.player.getRole();
      if (userRole !== userRoleLast) {
        refreshAllAttachments();
        userRoleLast = userRole;
      }
    });

    // Handle room metadata changes
    OBR.room.onMetadataChange(async (metadata) => {
      const { settings: newSettings, isChanged: doRefresh } = await getSettings(
        settings,
        metadata,
      );
      settings = newSettings;
      if (doRefresh) {
        createContextMenuItems(settings, themeMode);
        refreshAllAttachments();
      }
    });

    // Handle scene metadata changes
    const unsubscribeFromSceneMetadata = OBR.scene.onMetadataChange(
      (metadata) => {
        const minionGroupParse = z
          .array(MinionGroupZod)
          .safeParse(metadata[MONSTER_GROUPS_METADATA_KEY]);
        if (minionGroupParse.success) {
          if (
            JSON.stringify(minionGroups) !==
            JSON.stringify(minionGroupParse.data)
          ) {
            minionGroups = minionGroupParse.success
              ? minionGroupParse.data
              : [];
            refreshAllAttachments();
          }
        } else console.error("Invalid minion group data");
      },
    );

    // Handle item changes (Update health bars)
    const unsubscribeFromItems = OBR.scene.items.onChange(async (items) => {
      upToDateSceneItems = items;
      const [role, sceneDpi] = await Promise.all([
        OBR.player.getRole(),
        OBR.scene.grid.getDpi(),
      ]);

      // Filter items for only images from character and mount layers
      const imagesFromCallback: Image[] = [];
      for (const item of items) {
        if (isImage(item)) imagesFromCallback.push(item);
      }

      //create list of modified and new items, skipping deleted items
      const minionTokens = getMinionTokenCounts(
        imagesFromCallback,
        minionGroups,
        minionTokenCounts,
      );
      minionTokenCounts = minionTokens.counts;
      const separatedImages = separateChangedItems(
        imagesFromCallback,
        minionTokens.changed,
      );

      // Add and delete attachments
      const newAttachmentLog: AttachmentLogs = {};
      for (const image of separatedImages.changed) {
        const attachmentIds = updateTokenOverlay(image, role, sceneDpi);
        newAttachmentLog[image.id] = { image, attachmentIds };
      }
      for (const image of separatedImages.unchanged) {
        newAttachmentLog[image.id] = attachmentLog[image.id];
      }
      attachmentLog = newAttachmentLog;
      await sendItemsToScene(addItemsArray, deleteItemsArray);
    });

    // Unsubscribe listeners that rely on the scene if it stops being ready
    const unsubscribeFromScene = OBR.scene.onReadyChange((isReady) => {
      if (!isReady) {
        unsubscribeFromSceneMetadata();
        unsubscribeFromItems();
        unsubscribeFromScene();
        callbacksStarted = false;
      }
    });
  }
}

function separateChangedItems(images: Image[], includeAllMinions: boolean) {
  const changed: Image[] = [];
  const unchanged: Image[] = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const lastUpdate = attachmentLog[image.id]?.image;

    if (lastUpdate === undefined) {
      changed.push(image);
    } else if (
      //check for scaling changes
      !(
        lastUpdate.scale.x === image.scale.x &&
        lastUpdate.scale.y === image.scale.y &&
        (lastUpdate.name === image.name || !settings.nameTagsEnabled)
      )
    ) {
      // Attachments must be deleted to prevent ghost selection highlight bug
      deleteItemsArray.push(hpTextId(image.id));
      changed.push(image);
    } else if (
      //check position, visibility, and metadata changes
      !(
        lastUpdate.layer === image.layer &&
        lastUpdate.position.x === image.position.x &&
        lastUpdate.position.y === image.position.y &&
        lastUpdate.grid.offset.x === image.grid.offset.x &&
        lastUpdate.grid.offset.y === image.grid.offset.y &&
        lastUpdate.grid.dpi === image.grid.dpi &&
        lastUpdate.visible === image.visible &&
        JSON.stringify(lastUpdate.metadata[TOKEN_METADATA_KEY]) ===
          JSON.stringify(image.metadata[TOKEN_METADATA_KEY])
      ) ||
      (includeAllMinions &&
        (image.metadata[TOKEN_METADATA_KEY] as MinionTokenData)?.type ===
          "MINION")
    ) {
      //update items
      changed.push(image);
    } else {
      unchanged.push(image);
    }
  }
  return { changed, unchanged };
}

function updateTokenOverlay(image: Image, role: "PLAYER" | "GM", dpi: number) {
  const token = parseTokenData(image.metadata);

  let attachments: Item[];
  if (!["MOUNT", "CHARACTER"].includes(image.layer)) {
    attachments = [];
  } else if (token.type === "MONSTER") {
    attachments = createMonsterOverlay(image, token, role, dpi, settings);
  } else if (token.type === "MINION") {
    attachments = createMinionOverlay(
      image,
      token,
      minionGroups,
      role,
      dpi,
      settings,
      minionTokenCounts,
    );
  } else {
    attachments = createHeroOverlay(image, token, role, dpi, settings);
  }
  addItemsArray.push(...attachments);

  const attachmentIds = attachments.map((value) => value.id);
  const lastUpdate = attachmentLog[image.id];
  if (lastUpdate) {
    const unusedIds = setDifference(lastUpdate.attachmentIds, attachmentIds);
    deleteItemsArray.push(...unusedIds);
  }

  return attachmentIds;
}
