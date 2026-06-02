import React, { useEffect } from "react";
import { parseTokenData } from "../helpers/tokenHelpers";
import Button from "../components/ui/Button";
import type { DrawSteelResourceBundle } from "../types/monsterDataBundlesZod";
import { dataFromBestiaryIndexId } from "../helpers/monsterDataFromStatblockName";
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
  monsterData: DrawSteelResourceBundle | null;
  setMonsterData: React.Dispatch<DrawSteelResourceBundle>;
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
        if (typeof data !== "object") return;
        if (!("resourceId" in data)) return;
        let id: unknown = data.resourceId;
        if (typeof id !== "string") return;

        dataFromBestiaryIndexId(id).then((monsterData) => {
          document.title = monsterData.resource.name;
          setMonsterData(monsterData);
        });
      }),
    [setCollapsed, setMonsterData],
  );

  let monsterStatblocks: { name: string; id: string }[] = [];
  let terrainStatblocks: { name: string; id: string }[] = [];
  items.forEach((item) => {
    const token = parseTokenData(item.metadata);
    if (
      token.type === "MONSTER" &&
      token.statblockName !== "" &&
      (playerRole === "GM" || !token.gmOnly)
    ) {
      monsterStatblocks.push({
        name: token.statblockName,
        id: token.resourceId ? token.resourceId : token.statblockName,
      });
    } else if (
      token.type === "TERRAIN" &&
      token.statblockName !== "" &&
      (playerRole === "GM" || !token.gmOnly)
    ) {
      terrainStatblocks.push({
        name: token.statblockName,
        id: token.resourceId ? token.resourceId : token.statblockName,
      });
    }
  });
  monsterStatblocks = [
    ...new Map(monsterStatblocks.map((item) => [item.id, item.name])),
  ]
    .map((val) => ({ id: val[0], name: val[1] }))
    .sort((a, b) => a.name.localeCompare(b.name));
  terrainStatblocks = [
    ...new Map(terrainStatblocks.map((item) => [item.id, item.name])),
  ]
    .map((val) => ({ id: val[0], name: val[1] }))
    .sort((a, b) => a.name.localeCompare(b.name));

  let minionStatblocks: { name: string; id: string }[] = [];
  if (minionGroupsMetadata.ready && minionGroupsMetadata.value !== undefined) {
    const minionGroups = minionGroupsMetadata.value;
    const { counts } = getMinionTokenCounts(items, minionGroups);
    minionStatblocks = minionGroups
      .filter((group) => !group.gmOnly || playerRole === "GM")
      .filter((group) => group.id in counts && counts[group.id] >= 1)
      .map((group) => ({ name: group.statblock, id: group.resourceId }))
      .filter((resource) => resource.name !== undefined)
      .filter((resource) => resource.name !== "")
      .map(
        (resource) =>
          (resource.id === undefined || resource.id === ""
            ? { ...resource, id: resource.name }
            : resource) as { name: string; id: string },
      );
    minionStatblocks = [
      ...new Map(minionStatblocks.map((item) => [item.id, item.name])),
    ]
      .map((val) => ({ id: val[0], name: val[1] }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <Popover>
      <PopoverTrigger className="group" asChild>
        <Button
          variant={"outline"}
          className="h-10 w-full justify-between px-2 sm:px-4"
        >
          <div className="truncate text-start font-bold">
            {monsterData ? monsterData.resource.name : "Select Stat Block"}
          </div>
          <ChevronUpIcon className="transition-transform duration-200 ease-out group-data-[state=open]:-rotate-180" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="overflow-y-auto">
        <div className="space-y-2">
          {[...monsterStatblocks, ...minionStatblocks, ...terrainStatblocks]
            .length === 0 && (
            <>
              <div className="text-sm font-bold">No Stat Blocks Found</div>
              <div className="text-sm">
                Stat Blocks attached to monster tokens and minion groups or
                terrain in this scene will be listed here
              </div>
            </>
          )}
          {monsterStatblocks.length > 0 && (
            <div className="text-sm font-bold">Monsters</div>
          )}
          {monsterStatblocks.map((value) => (
            <PopoverClose key={value.id} asChild>
              <Button
                variant={"ghost"}
                className="hover:bg-mirage-100/70 w-full justify-between rounded-[8px] px-2"
                onClick={async () =>
                  setMonsterData(await dataFromBestiaryIndexId(value.id))
                }
              >
                <div className="truncate">{value.name}</div>

                {(monsterData?.key === value.id ||
                  monsterData?.resource.name === value.name) && <CheckIcon />}
              </Button>
            </PopoverClose>
          ))}
          {minionStatblocks.length > 0 && (
            <div className="text-sm font-bold">Minions</div>
          )}
          {minionStatblocks.map((value) => (
            <PopoverClose key={value.id} asChild>
              <Button
                variant={"ghost"}
                className="hover:bg-mirage-100/70 w-full justify-between rounded-[8px] px-2"
                onClick={async () =>
                  setMonsterData(await dataFromBestiaryIndexId(value.id))
                }
              >
                <div className="truncate">{value.name}</div>
                {(monsterData?.key === value.id ||
                  monsterData?.resource.name === value.name) && <CheckIcon />}
              </Button>
            </PopoverClose>
          ))}
          {terrainStatblocks.length > 0 && (
            <div className="text-sm font-bold">Terrain</div>
          )}
          {terrainStatblocks.map((value) => (
            <PopoverClose key={value.id} asChild>
              <Button
                variant={"ghost"}
                className="hover:bg-mirage-100/70 w-full justify-between rounded-[8px] px-2"
                onClick={async () =>
                  setMonsterData(await dataFromBestiaryIndexId(value.id))
                }
              >
                <div className="truncate">{value.name}</div>
                {(monsterData?.key === value.id ||
                  monsterData?.resource.name === value.name) && <CheckIcon />}
              </Button>
            </PopoverClose>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
