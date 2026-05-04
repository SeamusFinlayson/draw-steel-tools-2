import type { DrawSteelResourceBundle } from "../../types/monsterDataBundlesZod";
import { FeatureBlock } from "./FeatureBlock";
import { ScrollArea } from "../../components/ui/scrollArea";
import defaultMalice from "../defaultMalice.json";
import { DrawSteelFeatureBlockZod } from "../../types/DrawSteelZod";
import { ResourceTypeAdaptor } from "./ResourceTypeAdapter";

const parsedDefaultMaliceFeatures =
  DrawSteelFeatureBlockZod.parse(defaultMalice);

export default function MonsterView({
  bundle,
}: {
  bundle: DrawSteelResourceBundle;
}) {
  const url = new URL(window.location.href);
  url.searchParams.delete("statblock");

  return (
    <div className="flex grow flex-col">
      <ScrollArea className="grow basis-0">
        <div className="bg-mirage-50 grid justify-items-center gap-y-8 p-4 text-sm text-black">
          <ResourceTypeAdaptor resource={bundle.resource} />

          <div className="grid h-fit w-full justify-items-center gap-8">
            {bundle.append &&
              bundle.append.length > 0 &&
              bundle.append.map((item) => (
                <ResourceTypeAdaptor
                  key={item.name + item.level}
                  resource={item}
                />
              ))}
            {bundle.resource.type === "statblock" && (
              <FeatureBlock featureBlock={parsedDefaultMaliceFeatures} />
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
