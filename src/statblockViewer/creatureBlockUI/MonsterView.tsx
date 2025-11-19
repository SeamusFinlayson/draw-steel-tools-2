import type { MonsterDataBundle } from "../../types/monsterDataBundlesZod";
import { FeatureBlock } from "./FeatureBlock";
import { StatBlock } from "./StatBlock";
import { ScrollArea } from "../../components/ui/scrollArea";
import defaultMalice from "../defaultMalice.json";
import { DrawSteelFeatureBlockZod } from "../../types/DrawSteelZod";

const parsedDefaultMaliceFeatures =
  DrawSteelFeatureBlockZod.parse(defaultMalice);

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

          <div className="grid h-fit w-full justify-items-center gap-8">
            {monsterData.featuresBlocks.length > 0 &&
              monsterData.featuresBlocks.map((item) => (
                <FeatureBlock
                  key={item.name + item.level}
                  featureBlock={item}
                />
              ))}
            <FeatureBlock featureBlock={parsedDefaultMaliceFeatures} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
