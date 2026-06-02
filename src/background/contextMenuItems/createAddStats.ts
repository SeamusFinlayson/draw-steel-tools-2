import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../helpers/getPluginId";
import { getSelectedItems } from "../../helpers/getSelectedItem";
import { TOKEN_METADATA_KEY } from "../../helpers/tokenHelpers";
import dragonHeadIcon from "./icons/dragonHeadIcon";
import knightHelmetIcon from "./icons/knightHelmetIcon";
import landPlotIcon from "./icons/landPlotIcon";

export function createAddStats() {
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
          max: 1,
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
          max: 1,
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
        },
      },
    ],
    onClick: async () => {
      const selectedItems = await getSelectedItems();
      const playerRole = await OBR.player.getRole();
      OBR.scene.items.updateItems(
        selectedItems.map((item) => item.id),
        (items) => {
          items.forEach((item) => {
            item.metadata[TOKEN_METADATA_KEY] = {
              type: "MONSTER",
              gmOnly: playerRole === "GM" ? true : false,
            };
          });
        },
      );
    },
  });

  OBR.contextMenu.create({
    id: getPluginId("add-monsters"),
    icons: [
      {
        icon: dragonHeadIcon,
        label: "Add Monsters",
        filter: {
          min: 2,
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
        },
      },
    ],
    onClick: async () => {
      const themeMode = (await OBR.theme.getTheme()).mode;
      OBR.popover.open({
        id: getPluginId("statblockSearch"),
        url: `/statblockSearch?themeMode=${themeMode}`,
        height: 1000,
        width: 800,
        anchorOrigin: { horizontal: "CENTER", vertical: "CENTER" },
        transformOrigin: {
          horizontal: "CENTER",
          vertical: "CENTER",
        },
      });
    },
  });

  OBR.contextMenu.create({
    id: getPluginId("add-terrain"),
    icons: [
      {
        icon: landPlotIcon,
        label: "Add Terrain",
        filter: {
          every: [
            { key: "type", value: "SHAPE", coordinator: "||" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", TOKEN_METADATA_KEY],
              value: undefined,
              operator: "==",
            },
          ],
          max: 1,
          roles: ["GM"],
        },
      },
    ],
    onClick: async () => {
      const selectedItems = await getSelectedItems();
      const playerRole = await OBR.player.getRole();
      OBR.scene.items.updateItems(
        selectedItems.map((item) => item.id),
        (items) => {
          items.forEach((item) => {
            item.metadata[TOKEN_METADATA_KEY] = {
              type: "TERRAIN",
              gmOnly: playerRole === "GM" ? true : false,
            };
          });
        },
      );
    },
  });
}
