import { useState } from "react";
import type { MonsterIndexBundle } from "../../types/monsterDataBundlesZod";
import { generateIndex } from "../devScripts/generateMonsterIndex";
import { validateMalice } from "../devScripts/validateMalice";
import { validateStatblocks } from "../devScripts/validateStatblocks";
import Button from "../../components/ui/Button";
import { validateDynamicTerrain } from "../devScripts/validateDynamicTerrain";
import { generateDynamicTerrainIndex } from "../devScripts/generateDynamicTerrainIndex";

export function DevActionButtons({
  monsterIndex,
}: {
  monsterIndex: MonsterIndexBundle[];
}) {
  const [indexDownload, setIndexDownload] = useState<{
    href: string;
    download: string;
  }>();

  return (
    <div className="space-y-3 p-4">
      <div className="font-bold">Actions (See Console for Output)</div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={async () => setIndexDownload(await generateIndex())}>
            Generate Monster Index
          </Button>

          <Button
            onClick={async () =>
              setIndexDownload(await generateDynamicTerrainIndex())
            }
          >
            Generate Terrain Index
          </Button>

          {indexDownload && (
            <Button asChild>
              <a {...indexDownload}>Download Index</a>
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => validateStatblocks(monsterIndex)}>
            Validate Statblocks
          </Button>

          <Button onClick={() => validateMalice(monsterIndex)}>
            Validate Malice
          </Button>

          <Button disabled onClick={() => validateDynamicTerrain(monsterIndex)}>
            Validate Terrain
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              const set = new Set(monsterIndex.flatMap((val) => val.ancestry));
              console.log([...set].sort((a, b) => a.localeCompare(b)));
            }}
          >
            Generate Keywords List
          </Button>

          <Button
            onClick={() => {
              console.log(
                Math.max(
                  ...monsterIndex
                    .map((val) => {
                      if (Number.isNaN(parseFloat(val.ev)))
                        console.log(val.name);
                      return parseFloat(val.ev);
                    })
                    .filter((val) => !Number.isNaN(val)),
                ),
              );
            }}
          >
            Find Highest EV
          </Button>
        </div>
      </div>
    </div>
  );
}
