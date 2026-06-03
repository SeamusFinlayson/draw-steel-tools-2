import OBR, { type KeyFilter, type ContextMenuIcon } from "@owlbear-rodeo/sdk";
import { getContextMenuUrl } from "../../helpers/getContextMenuUrl";
import { getPluginId } from "../../helpers/getPluginId";
import { TOKEN_METADATA_KEY } from "../../helpers/tokenHelpers";
import type { MinionGroup } from "../../types/minionGroup";
import type { ThemeMode } from "../../types/themeMode";
import dragonHeadIcon from "./icons/dragonHeadIcon";
import knightHelmetIcon from "./icons/knightHelmetIcon";
import {
  NAME_HEIGHT,
  HERO_STATS_HEIGHT,
  VERTICAL_PADDING,
  ACCESS_TOGGLE_HEIGHT,
  MONSTER_STATS_HEIGHT,
  MINION_STATS_HEIGHT,
} from "./constants";
import landPlotIcon from "./icons/landPlotIcon";

export function createGmMenu(
  themeMode: ThemeMode,
  nameTagsEnabled: boolean,
  minionGroups: MinionGroup[],
) {
  OBR.contextMenu.create({
    id: getPluginId("gm-menu-hero"),
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
            {
              key: ["metadata", TOKEN_METADATA_KEY, "type"],
              value: "MINION",
              operator: "!=",
            },
            {
              key: ["metadata", TOKEN_METADATA_KEY, "type"],
              value: "TERRAIN",
              operator: "!=",
            },
          ],
          roles: ["GM"],
          max: 1,
        },
      },
    ],
    embed: {
      url: getContextMenuUrl(themeMode),
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
      url: getContextMenuUrl(themeMode),
      height:
        (nameTagsEnabled ? NAME_HEIGHT : 0) +
        MONSTER_STATS_HEIGHT +
        VERTICAL_PADDING +
        ACCESS_TOGGLE_HEIGHT,
    },
  });

  OBR.contextMenu.create({
    id: getPluginId(`gm-menu-minion`),
    icons: minionGroups.map((group) => {
      const mutualExclusionRestrictions = minionGroups
        .filter((item) => item.id !== group.id)
        .map(
          (item) =>
            ({
              key: ["metadata", TOKEN_METADATA_KEY, "groupId"],
              value: item.id,
              operator: "!=",
            }) satisfies KeyFilter,
        );

      return {
        icon: dragonHeadIcon,
        label: "Edit Minions",
        filter: {
          every: mutualExclusionRestrictions,
          some: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },

            {
              key: ["metadata", TOKEN_METADATA_KEY, "type"],
              value: "MINION",
              operator: "==",
            },
            {
              key: ["metadata", TOKEN_METADATA_KEY, "groupId"],
              value: group.id,
              operator: "==",
            },
          ],
          roles: ["GM"],
        },
      } satisfies ContextMenuIcon;
    }),
    embed: {
      url: `${getContextMenuUrl(themeMode)}&minionEditor=true`,
      height:
        NAME_HEIGHT +
        MINION_STATS_HEIGHT +
        VERTICAL_PADDING +
        ACCESS_TOGGLE_HEIGHT,
    },
  });

  OBR.contextMenu.create({
    id: getPluginId("gm-menu-terrain"),
    icons: [
      {
        icon: landPlotIcon,
        label: "Edit Terrain",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },

            {
              key: ["metadata", TOKEN_METADATA_KEY, "type"],
              value: "TERRAIN",
              operator: "==",
            },
          ],
          roles: ["GM"],
          max: 1,
        },
      },
      {
        icon: landPlotIcon,
        label: "Edit Terrain",
        filter: {
          every: [
            { key: "layer", value: "DRAWING" },
            { key: "type", value: "SHAPE" },

            {
              key: ["metadata", TOKEN_METADATA_KEY, "type"],
              value: "TERRAIN",
              operator: "==",
            },
          ],
          roles: ["GM"],
          max: 1,
        },
      },
    ],
    embed: {
      url: getContextMenuUrl(themeMode),
      height:
        (nameTagsEnabled ? NAME_HEIGHT : 0) +
        MONSTER_STATS_HEIGHT +
        VERTICAL_PADDING +
        ACCESS_TOGGLE_HEIGHT,
    },
  });
}
