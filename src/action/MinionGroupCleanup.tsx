import z from "zod";
import Button from "../components/ui/Button";
import { MONSTER_GROUPS_METADATA_KEY } from "../helpers/monsterGroupHelpers";
import { useSceneMetadata } from "../helpers/useSceneMetadata";
import { MinionGroupZod } from "../types/minionGroup";
import { useItems } from "../helpers/useItems";
import { getMinionTokenCounts } from "../helpers/getMinionTokenCounts";

const parseMinionGroups = z.array(MinionGroupZod).parse;

export function MinionGroupCleanup() {
  const items = useItems();
  const minionGroupsMetadata = useSceneMetadata(
    MONSTER_GROUPS_METADATA_KEY,
    parseMinionGroups,
  );

  if (!minionGroupsMetadata.ready || minionGroupsMetadata.value === undefined)
    return;

  const minionGroups = minionGroupsMetadata.value;
  const { counts } = getMinionTokenCounts(items, minionGroups);

  const emptyGroupIds = minionGroups
    .filter((group) => !(group.id in counts) || counts[group.id] < 1)
    .map((group) => group.id);

  if (emptyGroupIds.length < 15) return;

  return (
    <div className="space-y-3 border-t-4 border-black/20 px-4 py-2">
      <div className="text-base font-medium">Empty Minion Groups</div>
      <div className="text-foreground-secondary text-sm">
        {`There are ${emptyGroupIds.length} minion groups with no tokens saved to this scene. `}
      </div>
      <div className="text-foreground-secondary text-sm">
        {"Delete them to free up storage space."}
      </div>
      <Button
        className="w-full"
        size={"sm"}
        variant={emptyGroupIds.length > 30 ? "primary" : "outline"}
        onClick={() =>
          minionGroupsMetadata.update(
            minionGroups.filter((group) => !emptyGroupIds.includes(group.id)),
          )
        }
      >
        Delete
      </Button>
    </div>
  );
}
