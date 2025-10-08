import "./../index.css";
import MonsterView from "../statblockSearch/MonsterView.tsx";
import { ScrollArea } from "../components/ui/scrollArea.tsx";
import Button from "../components/ui/Button.tsx";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../helpers/getPluginId.ts";
import { PluginGate } from "../components/logic/PluginGate.tsx";
import type { MonsterDataBundle } from "../types/monsterDataBundlesZod.ts";

export function App({ monsterData }: { monsterData: MonsterDataBundle }) {
  const url = new URL(window.location.href);
  url.searchParams.delete("obrref");

  return (
    <div className="bg-mirage-50 flex h-screen flex-col">
      <ScrollArea className="grow">
        <MonsterView monsterData={monsterData} />
      </ScrollArea>
      <PluginGate>
        <div className="border-mirage-300 grid gap-4 border-t p-4 sm:grid-cols-2">
          <Button variant={"accentOutline"} className="grow" asChild>
            <a href={url.toString()} target="_blank" rel="noopener noreferrer">
              Open in New Tab
            </a>
          </Button>
          <Button
            className="grow"
            onClick={() => OBR.popover.close(getPluginId("statblockViewer"))}
          >
            Done
          </Button>
        </div>
      </PluginGate>
    </div>
  );
}
