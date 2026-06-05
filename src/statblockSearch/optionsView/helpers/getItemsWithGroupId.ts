import { type Item } from "@owlbear-rodeo/sdk";
import { checkHasPluginData } from "../../../helpers/checkHasPluginData";
import { MinionTokenDataZod } from "../../../types/tokenDataZod";
import { TOKEN_METADATA_KEY } from "../../../helpers/tokenHelpers";

export function getItemsWithGroupId(groupId: string | null, items: Item[]) {
  if (!groupId) return undefined;
  if (groupId === "") return undefined;

  const itemsWithGroupId: Item[] = [];
  items.forEach((item) => {
    if (!checkHasPluginData(item)) return;

    const metadata = item.metadata[TOKEN_METADATA_KEY];
    const parseResult = MinionTokenDataZod.safeParse(metadata);
    if (!parseResult.success) return;
    if (groupId !== parseResult.data.groupId) return;

    itemsWithGroupId.push(item);
  });

  return itemsWithGroupId;
}
