import { LeafIcon } from "lucide-react";
import type { MonsterDataBundle } from "../types/monsterDataBundlesZod";
import { FeatureBlock } from "../statblockSearch/creatureBlockUI/FeatureBlock";
import { StatBlock } from "../statblockSearch/creatureBlockUI/StatBlock";
import { ScrollArea } from "../components/ui/scrollArea";

export default function MonsterView({
  monsterData: monsterData,
}: {
  monsterData: MonsterDataBundle;
}) {
  const url = new URL(window.location.href);
  url.searchParams.delete("statblock");

  return (
    <div className="flex grow flex-col">
      <ScrollArea className="grow basis-0">
        <div className="bg-mirage-50 grid justify-items-center gap-y-8 p-4 text-sm text-black">
          <StatBlock statblock={monsterData.statblock} />

          <div className="flex w-full justify-center gap-2.5">
            <LeafIcon className="size-4 shrink-0" />
            <LeafIcon className="size-4 shrink-0" />
            <LeafIcon className="size-4 shrink-0" />
          </div>

          <div className="grid h-fit w-full justify-items-center gap-8">
            {monsterData.featuresBlocks.length > 0 &&
              monsterData.featuresBlocks.map((item) => (
                <FeatureBlock
                  key={item.name + item.level}
                  featureBlock={item}
                />
              ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
