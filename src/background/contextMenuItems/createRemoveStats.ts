import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../helpers/getPluginId";
import { getSelectedItems } from "../../helpers/getSelectedItem";
import { removeCreatureData } from "../../helpers/removeCreatureData";
import { TOKEN_METADATA_KEY } from "../../helpers/tokenHelpers";
import type { MinionGroup } from "../../types/minionGroup";
import { getGmOnlyRestrictions } from "./getGmOnlyRestrictions";
import dragonHeadIcon from "./icons/dragonHeadIcon";

export function createRemoveStats(minionGroups: MinionGroup[]) {
  const gmOnlyRestrictions = getGmOnlyRestrictions(minionGroups);

  OBR.contextMenu.create({
    id: getPluginId("remove-stats"),
    icons: [
      {
        icon: dragonHeadIcon,
        label: "Remove Character",
        filter: {
          some: [
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
            ...gmOnlyRestrictions,
          ],
          max: 1,
          roles: ["PLAYER"],
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
          every: [
            {
              key: ["metadata", TOKEN_METADATA_KEY, "gmOnly"],
              value: true,
              operator: "!=",
            },
            ...gmOnlyRestrictions,
          ],
          min: 2,
          roles: ["PLAYER"],
        },
      },
    ],
    onClick: async () => {
      const selectedItems = await getSelectedItems();
      removeCreatureData(selectedItems);
    },
  });
}
