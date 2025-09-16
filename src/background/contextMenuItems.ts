import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../helpers/getPluginId";
import knightHelmetIcon from "./icons/knightHelmetIcon";
import dragonHeadIcon from "./icons/dragonHeadIcon";
import type { DefinedSettings } from "../types/settingsZod";
import { getSelectedItems } from "../helpers/getSelectedItem";
import { TOKEN_METADATA_KEY } from "../helpers/tokenHelpers";

const VERTICAL_PADDING = 16;
const NAME_HEIGHT = 36 + 18 + 8;
const HERO_STATS_HEIGHT = 178;
const MONSTER_STATS_HEIGHT = 54;
const ACCESS_TOGGLE_HEIGHT = 20 + 16 + 8;

const getUrl = (themeMode: string) => `/contextMenu?themeMode=${themeMode}`;

export default async function createContextMenuItems(
  settings: DefinedSettings,
  themeMode: "DARK" | "LIGHT",
) {
  createPlayerMenu(themeMode, settings.nameTagsEnabled);
  createGmMenu(themeMode, settings.nameTagsEnabled);
  createAddStats();
  createRemoveStats();
}

function createPlayerMenu(
  themeMode: "DARK" | "LIGHT",
  nameTagsEnabled: boolean,
) {
  OBR.contextMenu.create({
    id: getPluginId("player-menu"),
    icons: [
      {
        icon: knightHelmetIcon,
        label: "Edit Hero",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", TOKEN_METADATA_KEY, "gmOnly"],
              value: true,
              operator: "!=",
            },
            {
              key: ["metadata", TOKEN_METADATA_KEY, "type"],
              value: "MONSTER",
              operator: "!=",
            },
            {
              key: ["metadata", TOKEN_METADATA_KEY],
              value: undefined,
              operator: "!=",
            },
          ],
          permissions: ["UPDATE"],
          roles: ["PLAYER"],
          max: 1,
        },
      },
    ],
    embed: {
      url: getUrl(themeMode),
      height:
        (nameTagsEnabled ? NAME_HEIGHT : 0) +
        HERO_STATS_HEIGHT +
        VERTICAL_PADDING,
    },
  });

  OBR.contextMenu.create({
    id: getPluginId("player-menu-monster"),
    icons: [
      {
        icon: dragonHeadIcon,
        label: "Edit Monster",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", TOKEN_METADATA_KEY, "gmOnly"],
              value: true,
              operator: "!=",
            },
            {
              key: ["metadata", TOKEN_METADATA_KEY, "type"],
              value: "MONSTER",
              operator: "==",
            },
            {
              key: ["metadata", TOKEN_METADATA_KEY],
              value: undefined,
              operator: "!=",
            },
          ],
          permissions: ["UPDATE"],
          roles: ["PLAYER"],
          max: 1,
        },
      },
    ],
    embed: {
      url: getUrl(themeMode),
      height:
        (nameTagsEnabled ? NAME_HEIGHT : 0) +
        MONSTER_STATS_HEIGHT +
        VERTICAL_PADDING,
    },
  });
}

function createGmMenu(themeMode: "DARK" | "LIGHT", nameTagsEnabled: boolean) {
  OBR.contextMenu.create({
    id: getPluginId("gm-menu"),
    icons: [
      {
        icon: knightHelmetIcon,
        label: "Edit Hero",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", TOKEN_METADATA_KEY],
              value: undefined,
              operator: "!=",
            },
            {
              key: ["metadata", TOKEN_METADATA_KEY, "type"],
              value: "MONSTER",
              operator: "!=",
            },
          ],
          roles: ["GM"],
          max: 1,
        },
      },
    ],
    embed: {
      url: getUrl(themeMode),
      height:
        (nameTagsEnabled ? NAME_HEIGHT : 0) +
        HERO_STATS_HEIGHT +
        VERTICAL_PADDING +
        ACCESS_TOGGLE_HEIGHT,
    },
  });

  OBR.contextMenu.create({
    id: getPluginId("gm-menu-monster"),
    icons: [
      {
        icon: dragonHeadIcon,
        label: "Edit Monster",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", TOKEN_METADATA_KEY],
              value: undefined,
              operator: "!=",
            },
            {
              key: ["metadata", TOKEN_METADATA_KEY, "type"],
              value: "MONSTER",
              operator: "==",
            },
          ],
          roles: ["GM"],
          max: 1,
        },
      },
    ],
    embed: {
      url: getUrl(themeMode),
      height:
        (nameTagsEnabled ? NAME_HEIGHT : 0) +
        MONSTER_STATS_HEIGHT +
        VERTICAL_PADDING +
        ACCESS_TOGGLE_HEIGHT,
    },
  });
}

function createAddStats() {
  OBR.contextMenu.create({
    id: getPluginId("add-hero"),
    icons: [
      {
        icon: knightHelmetIcon,
        label: "Add Hero",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", TOKEN_METADATA_KEY],
              value: undefined,
              operator: "==",
            },
          ],
          // roles: ["GM"],
        },
      },
    ],
    onClick: async () => {
      const selectedItems = await getSelectedItems();
      OBR.scene.items.updateItems(
        selectedItems.map((item) => item.id),
        (items) => {
          items.forEach((item) => {
            item.metadata[TOKEN_METADATA_KEY] = { type: "HERO" };
          });
        },
      );
    },
  });

  OBR.contextMenu.create({
    id: getPluginId("add-monster"),
    icons: [
      {
        icon: dragonHeadIcon,
        label: "Add Monster",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", TOKEN_METADATA_KEY],
              value: undefined,
              operator: "==",
            },
          ],
          roles: ["GM"],
        },
      },
    ],
    onClick: async () => {
      const selectedItems = await getSelectedItems();
      OBR.scene.items.updateItems(
        selectedItems.map((item) => item.id),
        (items) => {
          items.forEach((item) => {
            item.metadata[TOKEN_METADATA_KEY] = {
              type: "MONSTER",
              gmOnly: true,
            };
          });
        },
      );
    },
  });
}

function createRemoveStats() {
  OBR.contextMenu.create({
    id: getPluginId("remove-stats"),
    icons: [
      {
        icon: dragonHeadIcon,
        label: "Remove Character",
        filter: {
          some: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", TOKEN_METADATA_KEY],
              value: undefined,
              operator: "!=",
            },
          ],
          max: 1,
          roles: ["GM"],
        },
      },
      {
        icon: dragonHeadIcon,
        label: "Remove Characters",
        filter: {
          some: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", TOKEN_METADATA_KEY],
              value: undefined,
              operator: "!=",
            },
          ],
          min: 2,
          roles: ["GM"],
        },
      },
      {
        icon: dragonHeadIcon,
        label: "Remove Character",
        filter: {
          some: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", TOKEN_METADATA_KEY],
              value: undefined,
              operator: "!=",
            },
          ],
          every: [
            {
              key: ["metadata", TOKEN_METADATA_KEY, "gmOnly"],
              value: true,
              operator: "!=",
            },
          ],
          max: 1,
          roles: ["PLAYER"],
        },
      },
    ],
    onClick: async () => {
      const selectedItems = await getSelectedItems();
      OBR.scene.items.updateItems(
        selectedItems.map((item) => item.id),
        (items) => {
          items.forEach((item) => {
            item.metadata[TOKEN_METADATA_KEY] = undefined;
            item.metadata[getPluginId("name")] = undefined;
          });
        },
      );
    },
  });
}
