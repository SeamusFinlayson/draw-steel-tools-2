import type { Item } from "@owlbear-rodeo/sdk";
import { TOKEN_METADATA_KEY } from "./tokenHelpers";

export function extensionItemFilter(item: Item) {
  return !!item.metadata[TOKEN_METADATA_KEY];
}
