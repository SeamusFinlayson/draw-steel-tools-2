import OBR, { type Item } from "@owlbear-rodeo/sdk";

export async function sendItemsToScene(
  addItemsArray: Item[],
  deleteItemsArray: string[],
) {
  // console.log("added items length", addItemsArray.length);
  // console.log("deleted items length", deleteItemsArray.length);
  await Promise.all([
    OBR.scene.local.deleteItems(deleteItemsArray),
    OBR.scene.local.addItems(addItemsArray),
  ]);
  deleteItemsArray.length = 0;
  addItemsArray.length = 0;
}
