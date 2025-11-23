import React, { useEffect } from "react";
import { parseTokenData } from "../helpers/tokenHelpers";
import Button from "../components/ui/Button";
import type { MonsterDataBundle } from "../types/monsterDataBundlesZod";
import { monsterDataFromStatblockName } from "../helpers/monsterDataFromStatblockName";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { CheckIcon, ChevronUpIcon } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import { useItems } from "../helpers/useItems";
import { useSceneMetadata } from "../helpers/useSceneMetadata";
import { MONSTER_GROUPS_METADATA_KEY } from "../helpers/monsterGroupHelpers";
import z from "zod";
import { MinionGroupZod } from "../types/minionGroup";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../helpers/getPluginId";
import usePlayerRole from "../helpers/usePlayerRole";
import { getMinionTokenCounts } from "../helpers/getMinionTokenCounts";

const parseMinionGroups = z.array(MinionGroupZod).parse;

export function StatBlockSwitcher({
  monsterData,
  setMonsterData,
  setCollapsed,
}: {
  monsterData: MonsterDataBundle | null;
  setMonsterData: React.Dispatch<MonsterDataBundle>;
  setCollapsed: (collapsed: boolean) => void;
}) {
  const playerRole = usePlayerRole();
  const items = useItems();
  const minionGroupsMetadata = useSceneMetadata(
    MONSTER_GROUPS_METADATA_KEY,
    parseMinionGroups,
  );

  useEffect(
    () =>
      OBR.broadcast.onMessage(getPluginId("set-viewer-statblock"), (event) => {
        setCollapsed(false);
        const data = event.data;
        if (!data) return;
        if (!(typeof data === "object")) return;
        if (!("statblockName" in data)) return;
        const statblockName = data.statblockName;
        if (!(typeof statblockName === "string")) return;
        monsterDataFromStatblockName(statblockName).then((monsterData) => {
          document.title = monsterData.statblock.name;
          setMonsterData(monsterData);
        });
      }),
    [setCollapsed, setMonsterData],
  );

  let monsterStatblocks: string[] = [];
  items.forEach((item) => {
    const token = parseTokenData(item.metadata);
    if (
      token.type === "MONSTER" &&
      token.statblockName !== "" &&
      (playerRole === "GM" || !token.gmOnly)
    ) {
      monsterStatblocks.push(token.statblockName);
    }
  });
  monsterStatblocks = [...new Set(monsterStatblocks)].sort((a, b) =>
    a.localeCompare(b),
  );

  let minionStatblocks: string[] = [];
  if (
    minionGroupsMetadata.ready &&
    minionGroupsMetadata.value !== undefined &&
    playerRole === "GM"
  ) {
    const minionGroups = minionGroupsMetadata.value;
    const { counts } = getMinionTokenCounts(items, minionGroups);
    minionStatblocks = minionGroups
      .filter((group) => group.id in counts && counts[group.id] >= 1)
      .map((group) => group.statblock)
      .filter((statblock) => statblock !== undefined)
      .filter((statblock) => statblock !== "");
    minionStatblocks = [...new Set(minionStatblocks)].sort((a, b) =>
      a.localeCompare(b),
    );
  }

  return (
    <Popover>
      <PopoverTrigger className="group" asChild>
        <Button
          variant={"outline"}
          className="h-10 w-full justify-between px-2 sm:px-4"
        >
          <div className="truncate text-start font-bold">
            {monsterData ? monsterData.statblock.name : "Select Stat Block"}
          </div>
          <ChevronUpIcon className="transition-transform duration-200 ease-out group-data-[state=open]:-rotate-180" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="overflow-y-auto">
        <div className="space-y-2">
          {monsterStatblocks.length == 0 && minionStatblocks.length === 0 && (
            <>
              <div className="text-sm font-bold">No Stat Blocks Found</div>
              <div className="text-sm">
                Stat Blocks attached to monster tokens and minion groups in this
                scene will be listed here
              </div>
            </>
          )}
          {monsterStatblocks.length > 0 && (
            <div className="text-sm font-bold">Monsters</div>
          )}
          {monsterStatblocks.map((value) => (
            <PopoverClose key={value} asChild>
              <Button
                variant={"ghost"}
                className="hover:bg-mirage-100/70 w-full justify-between rounded-[8px] px-2"
                onClick={async () =>
                  setMonsterData(await monsterDataFromStatblockName(value))
                }
              >
                <div className="truncate">{value}</div>
                {monsterData && monsterData.statblock.name === value && (
                  <CheckIcon />
                )}
              </Button>
            </PopoverClose>
          ))}
          {minionStatblocks.length > 0 && (
            <div className="text-sm font-bold">Minions</div>
          )}
          {minionStatblocks.map((value) => (
            <PopoverClose key={value} asChild>
              <Button
                variant={"ghost"}
                className="hover:bg-mirage-100/70 w-full justify-between rounded-[8px] px-2"
                onClick={async () =>
                  setMonsterData(await monsterDataFromStatblockName(value))
                }
              >
                <div className="truncate">{value}</div>
                {monsterData && monsterData.statblock.name === value && (
                  <CheckIcon />
                )}
              </Button>
            </PopoverClose>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
