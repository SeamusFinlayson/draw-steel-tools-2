import OBR, { type Item } from "@owlbear-rodeo/sdk";

export async function getSelectedItems(args?: {
  selection?: string[];
  items?: Item[];
}): Promise<Item[]> {
  let selection = args?.selection;
  const items = args?.items;
  if (selection === undefined) selection = await OBR.player.getSelection();
  if (selection === undefined) return [];
  if (items === undefined) return await OBR.scene.items.getItems(selection);
  const selectedItems = items.filter((value) => selection.includes(value.id));
  return selectedItems;
}
