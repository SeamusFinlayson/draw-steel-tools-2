import { isImage, isShape, type Item, type Layer } from "@owlbear-rodeo/sdk";
import { parseTokenData, TOKEN_METADATA_KEY } from "../../helpers/tokenHelpers";
import type {
  Catagory,
  ObrState,
  UpdateBundle,
  ChangedData,
  PreviousItemData,
} from "../types";
import type { DefinedCharacterTokenData } from "../../types/tokenDataZod";
import {
  checkNeedsRefresh,
  checkItemChanges,
  checkMetadataChanges,
} from "./checkChanges";

function checkIsOnTrackedLayer(layer: Layer) {
  if (layer === "MOUNT") return true;
  if (layer === "CHARACTER") return true;
  if (layer === "DRAWING") return true;
  return false;
}

function checkIsTrackedItemType(item: Item) {
  if (isImage(item)) return true;
  if (isShape(item)) return true;
  return false;
}

function getItemStatus(item: Item, prev: Item | undefined) {
  const hasMetadata = TOKEN_METADATA_KEY in item.metadata;
  const isOnTrackedLayer = checkIsOnTrackedLayer(item.layer);
  const isTrackedItemType = checkIsTrackedItemType(item);

  if (!prev) {
    if (!hasMetadata) return "UNTRACKED";
    if (!isOnTrackedLayer) return "UNTRACKED";
    if (!isTrackedItemType) return "UNTRACKED";
    return "ADD";
  }

  if (hasMetadata) return "REMOVE";
  return "NEEDS_CHECKS";
}

function bundleCatagory(
  cat: Catagory,
  item: Item,
  data?: DefinedCharacterTokenData,
  prev?: PreviousItemData,
): UpdateBundle {
  if (cat === "UNTRACKED" || cat === "REMOVE") return { item, type: cat };
  if (!data) throw new Error(`Data was not provided for bundle type ${cat}`);
  if (cat === "ADD") return { item, type: cat, data };
  if (!prev)
    throw new Error(`Previous data was not provided for bundle type ${cat}`);
  if (cat === "UNCHANGED") return { item, type: cat, prev };
  return { item, type: cat, data, prev };
}

export function getUpdateBundles(
  obrState: ObrState,
  changed: ChangedData,
): UpdateBundle[] {
  const items = changed.items ? changed.items : obrState.items;

  return items.map((item: Item) => {
    const log = obrState.attachmentLogs[item.id];
    const prev: PreviousItemData | undefined = log
      ? { item: log.item, data: log.data }
      : undefined;
    const status = getItemStatus(item, prev?.item);

    if (status === "REMOVE") return bundleCatagory(status, item);
    if (status === "UNTRACKED") return bundleCatagory(status, item);

    const data = parseTokenData(item.metadata);

    if (!prev) return bundleCatagory(status as "ADD", item, data);

    if (changed.settings) return bundleCatagory("UPDATE", item, data, prev);
    if (changed.role) return bundleCatagory("UPDATE", item, data, prev);
    if (changed.minions && data.type === "MINION")
      return bundleCatagory("UPDATE", item, data, prev);

    if (checkNeedsRefresh(item, prev.item, obrState.settings.nameTagsEnabled))
      return bundleCatagory("REFRESH", item, data, prev);
    if (checkItemChanges(item, prev.item))
      return bundleCatagory("UPDATE", item, data, prev);

    if (checkMetadataChanges(data, prev.data))
      return bundleCatagory("UPDATE", item, data, prev);

    return bundleCatagory("UNCHANGED", item, undefined, prev);
  });
}
