import type { Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";
import type { MinionGroup } from "../types/minionGroup";

export type TokenCounts = {
  [groupId: string]: number;
};

export function getMinionTokenCounts(
  items: Item[],
  minionGroups: MinionGroup[],
  currentCounts?: TokenCounts,
): { changed: boolean; counts: TokenCounts } {
  const counts: { [groupId: string]: number } = {};
  minionGroups.forEach((group) => {
    counts[group.id] = items
      .filter((item) => ["CHARACTER", "MOUNT"].includes(item.layer))
      .map(
        (item) =>
          (item.metadata?.[getPluginId("metadata")] as { groupId?: string })
            ?.groupId,
      )
      .filter((val) => val === group.id).length;
  });

  if (currentCounts === undefined) return { changed: true, counts };

  if (Object.keys(currentCounts).length !== Object.keys(counts).length) {
    return { changed: true, counts };
  }
  for (const minionGroup of minionGroups) {
    if (counts[minionGroup.id] !== currentCounts[minionGroup.id]) {
      return { changed: true, counts };
    }
  }

  return { changed: false, counts };
}
