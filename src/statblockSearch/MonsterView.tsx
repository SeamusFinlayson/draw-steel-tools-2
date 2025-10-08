import type { MonsterDataBundle } from "../types/monsterDataBundlesZod";
import { FeatureBlock } from "./creatureBlockUI/FeatureBlock";
import { StatBlock } from "./creatureBlockUI/StatBlock";

export default function MonsterView({
  monsterData: monsterData,
}: {
  monsterData: MonsterDataBundle;
}) {
  const url = new URL(window.location.href);
  url.searchParams.delete("statblock");

  return (
    <div className="bg-mirage-50 grid justify-items-center gap-y-8 p-4 text-sm text-black sm:p-6">
      <div>
        <StatBlock statblock={monsterData.statblock} />
      </div>
      {/* <LeafIcon className="shrink-0" /> */}
      <div className="grid h-fit gap-8">
        {monsterData.featuresBlocks.length > 0 &&
          monsterData.featuresBlocks.map((item) => (
            <FeatureBlock key={item.name + item.level} featureBlock={item} />
          ))}
      </div>
    </div>
  );
}
