import type { DrawSteelFeatureBlock } from "../../types/DrawSteelZod";
import { Feature } from "./Feature";

export function FeatureBlock({
  featureBlock: featureBlock,
}: {
  featureBlock: DrawSteelFeatureBlock;
}) {
  return (
    <div className="w-full max-w-lg">
      <div className="bg-mirage-200 rounded-sm p-2">
        <div className="flex items-end justify-between">
          <div className="text-base font-black">{featureBlock.name}</div>
          <div className="font-black">
            {featureBlock.level && (
              <span>{`Level ${featureBlock.level}+ `}</span>
            )}
            <span>{featureBlock.featureblock_type}</span>
          </div>
        </div>
        <div>{featureBlock.flavor}</div>
      </div>

      <div>
        {featureBlock.features?.map((feature) => (
          <div
            key={feature.name}
            className="border-mirage-950 border-b p-2 pl-0"
          >
            <Feature feature={feature} />
          </div>
        ))}
      </div>
    </div>
  );
}
