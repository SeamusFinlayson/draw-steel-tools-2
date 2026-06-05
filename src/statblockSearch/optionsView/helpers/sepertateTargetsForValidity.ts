import type { Item } from "@owlbear-rodeo/sdk";
import {
  checkItemIsValidPluginType,
  type PluginItemType,
} from "../../../helpers/pluginTargetChecking";

export function sepertateTargetsForValidity(
  type: Exclude<PluginItemType, "HERO"> | undefined,
  items: Item[],
) {
  if (type === undefined) return { valid: [], invalid: items };

  const valid: Item[] = [];
  const invalid: Item[] = [];
  items.forEach((item) => {
    if (checkItemIsValidPluginType(item, type)) valid.push(item);
    else invalid.push(item);
  });

  return { valid, invalid };
}
