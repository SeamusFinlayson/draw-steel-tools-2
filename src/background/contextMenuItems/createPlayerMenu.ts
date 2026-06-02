import OBR, { type KeyFilter, type ContextMenuIcon } from "@owlbear-rodeo/sdk";
import { getContextMenuUrl } from "../../helpers/getContextMenuUrl";
import { getPluginId } from "../../helpers/getPluginId";
import { TOKEN_METADATA_KEY } from "../../helpers/tokenHelpers";
import type { MinionGroup } from "../../types/minionGroup";
import type { ThemeMode } from "../../types/themeMode";
import {
  NAME_HEIGHT,
  HERO_STATS_HEIGHT,
  VERTICAL_PADDING,
  MONSTER_STATS_HEIGHT,
  MINION_STATS_HEIGHT,
} from "./constants";
import { getGmOnlyRestrictions } from "./getGmOnlyRestrictions";
import dragonHeadIcon from "./icons/dragonHeadIcon";
import knightHelmetIcon from "./icons/knightHelmetIcon";

export function createPlayerMenu(
  themeMode: ThemeMode,
  nameTagsEnabled: boolean,
  minionGroups: MinionGroup[],
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
              key: ["metadata", TOKEN_METADATA_KEY, "type"],
              value: "MINION",
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
      url: getContextMenuUrl(themeMode),
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
      url: getContextMenuUrl(themeMode),
      height:
        (nameTagsEnabled ? NAME_HEIGHT : 0) +
        MONSTER_STATS_HEIGHT +
        VERTICAL_PADDING,
    },
  });

  const gmOnlyRestrictions = getGmOnlyRestrictions(minionGroups);

  OBR.contextMenu.create({
    id: getPluginId("player-menu-minion"),
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
          every: [...mutualExclusionRestrictions, ...gmOnlyRestrictions],
          some: [
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
              value: "MINION",
              operator: "==",
            },
          ],
          roles: ["PLAYER"],
        },
      } satisfies ContextMenuIcon;
    }),
    embed: {
      url: `${getContextMenuUrl(themeMode)}&minionEditor=true`,
      height: NAME_HEIGHT + MINION_STATS_HEIGHT + VERTICAL_PADDING,
    },
  });
}
