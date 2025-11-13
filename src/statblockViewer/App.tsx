import "./../index.css";
import MonsterView from "./MonsterView.tsx";
import Button from "../components/ui/Button.tsx";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../helpers/getPluginId.ts";
import { PluginGate } from "../components/logic/PluginGate.tsx";
import type { MonsterDataBundle } from "../types/monsterDataBundlesZod.ts";
import { ExternalLinkIcon, Maximize2Icon, Minimize2Icon } from "lucide-react";
import { StatBlockSwitcher } from "./StatblockSwitcher.tsx";
import { useEffect, useState } from "react";
import { monsterDataFromStatblockName } from "../helpers/monsterDataFromStatblockName.ts";
import { cn } from "../helpers/utils.ts";
import Toggle from "../components/ui/Toggle.tsx";

const monsterId = new URLSearchParams(document.location.search).get(
  "statblockName",
);

export function StatblockViewer() {
  const url = new URL(window.location.href);
  url.searchParams.delete("obrref");

  const [collapsed, setCollapsed] = useState(false);
  const [monsterData, setMonsterData] = useState<MonsterDataBundle>();

  useEffect(() => {
    if (!monsterId) throw new Error("Monster ID is Null");
    monsterDataFromStatblockName(monsterId).then((monsterData) => {
      document.title = monsterData.statblock.name;
      setMonsterData(monsterData);
    });
  }, []);

  return (
    <div className="bg-mirage-50 flex h-screen flex-col overflow-hidden pb-[56px]">
      {collapsed ? (
        <></>
      ) : !monsterData ? (
        <div className="text-foreground-secondary grow p-4">Loading...</div>
      ) : (
        <MonsterView monsterData={monsterData} />
      )}

      <PluginGate>
        <div
          className={cn(
            "border-mirage-300 bg-mirage-50 absolute right-0 bottom-0 left-0 flex flex-wrap items-end justify-between gap-x-2 gap-y-2 overflow-hidden px-4 py-2",
            { "border-t": !collapsed },
          )}
        >
          {!collapsed && monsterData && (
            <StatBlockSwitcher
              monsterData={monsterData}
              setMonsterData={setMonsterData}
            />
          )}

          <div className="flex grow basis-0 items-center justify-end gap-2">
            {!collapsed && (
              <Button
                variant={"secondary"}
                size={"icon"}
                className="grow basis-0"
                asChild
              >
                <a
                  href={url.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon />
                </a>
              </Button>
            )}
            <Toggle
              variant={"default"}
              size={"icon"}
              pressed={collapsed}
              className={cn(
                "data-[state=on]:bg-mirage-100 data-[state=on]:text-foreground hover:data-[state=on]:bg-mirage-200",
                {
                  grow: collapsed,
                },
              )}
              onClick={async () => {
                if (collapsed) {
                  await OBR.popover.setHeight(
                    getPluginId("statblockViewer"),
                    5000,
                  );
                  await OBR.popover.setWidth(
                    getPluginId("statblockViewer"),
                    500,
                  );
                } else {
                  await OBR.popover.setHeight(
                    getPluginId("statblockViewer"),
                    56,
                  );
                  await OBR.popover.setWidth(
                    getPluginId("statblockViewer"),
                    180,
                  );
                }
                setCollapsed(!collapsed);
              }}
            >
              {collapsed ? <Maximize2Icon /> : <Minimize2Icon />}
            </Toggle>
            <Button
              variant={"primary"}
              className="h-10"
              onClick={() => OBR.popover.close(getPluginId("statblockViewer"))}
            >
              Close
            </Button>
          </div>
        </div>
      </PluginGate>
    </div>
  );
}
