import { LeafIcon } from "lucide-react";
import type { MonsterDataBundle } from "../../types/monsterDataBundlesZod";
import { FeatureBlock } from "../creatureBlockUI/FeatureBlock";
import { StatBlock } from "../creatureBlockUI/StatBlock";

export default function MonsterView({
  monsterData: monsterData,
}: {
  monsterData: MonsterDataBundle;
}) {
  const url = new URL(window.location.href);
  url.searchParams.delete("statblock");

  return (
    <div className="bg-mirage-50 grid justify-items-center gap-y-8 p-4 text-sm text-black sm:p-6">
      <StatBlock statblock={monsterData.statblock} />

      <div className="flex w-full justify-center gap-2.5">
        <LeafIcon className="size-4 shrink-0" />
        <LeafIcon className="size-4 shrink-0" />
        <LeafIcon className="size-4 shrink-0" />
      </div>

      <div className="grid h-fit w-full gap-8">
        {monsterData.featuresBlocks.length > 0 &&
          monsterData.featuresBlocks.map((item) => (
            <FeatureBlock key={item.name + item.level} featureBlock={item} />
          ))}
      </div>
    </div>
  );
}
