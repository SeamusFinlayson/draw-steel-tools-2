import monsterIndex from "./monsterIndex.json";
import SearchView from "./SearchView";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../components/ui/dialog";
import MonsterView from "./MonsterView";
import { useState } from "react";
import type {
  IndexBundle,
  MonsterDataBundle,
} from "../types/monsterDataBundlesZod";
import { ScrollArea } from "../components/ui/scrollArea";
import Button from "../components/ui/Button";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../helpers/getPluginId";
import { MonsterPreviewCard } from "./MonsterPreviewCard";
import { getMonsterDataBundle } from "./helpers/getMonsterDataBundle";
import { XIcon } from "lucide-react";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import FreeWheelInput from "../components/logic/FreeWheelInput";
import { Checkbox } from "../components/ui/checkbox";

export default function StatblockSearch() {
  const [monsterViewerData, setMonsterViewerData] =
    useState<MonsterDataBundle>();
  const [selectedMonster, setSelectedMonster] = useState<IndexBundle>();

  return (
    <div>
      <Dialog open={monsterViewerData !== undefined}>
        <DialogContent
          className="bg-mirage-50 h-11/12 p-0"
          onPointerDownOutside={() => setMonsterViewerData(undefined)}
        >
          <ScrollArea className="bg-mirage-50 h-full max-h-full" noDarkMode>
            <DialogTitle className="max-h-0 overflow-clip">
              Statblock Viewer
            </DialogTitle>
            <DialogDescription className="max-h-0 overflow-clip">
              View of the selected statblock
            </DialogDescription>
            {monsterViewerData && (
              <MonsterView monsterData={monsterViewerData} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <div className="text-foreground bg-mirage-50 dark:bg-mirage-950 border-mirage-300 dark:border-mirage-700 flex h-screen min-h-screen flex-col rounded-2xl border">
        {selectedMonster === undefined ? (
          <SearchView
            monsterIndex={monsterIndex}
            setMonsterViewerData={setMonsterViewerData}
            setSelectedMonster={setSelectedMonster}
          />
        ) : (
          <div className="grow space-y-6 p-4 sm:p-6">
            <MonsterPreviewCard
              indexBundle={selectedMonster}
              onCardClick={async () =>
                setMonsterViewerData(
                  await getMonsterDataBundle(selectedMonster),
                )
              }
              onActionClick={() => setSelectedMonster(undefined)}
              icon={<XIcon />}
            />
            <div className="flex flex-col">
              <h1>Token Options</h1>
              <div className="flex items-center">
                <Checkbox id="setStaminaCheckbox" />
                <Label className="h-fit" htmlFor="setStaminaCheckbox">
                  Set Stamina
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="setNameCheckbox" />
                <Label className="h-fit" htmlFor="setNameCheckbox">
                  Set Name{" "}
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="AddNameTagCheckbox" />
                <Label className="h-fit" htmlFor="AddNameTagCheckbox">
                  Add Name Tag
                </Label>
              </div>
            </div>
            <div>
              <Label htmlFor="nameInput" className="mb-2">
                Name
              </Label>
              <Input id="nameInput" className="w-60">
                <FreeWheelInput
                  value={selectedMonster.name}
                  onUpdate={() => {}}
                />
              </Input>
            </div>
          </div>
        )}

        <footer className="w-full">
          <div className="border-mirage-300 dark:border-mirage-700 border-t px-6 py-3">
            <Button
              variant={"accentOutline"}
              className="w-full"
              onClick={() => OBR.popover.close(getPluginId("statblockSearch"))}
            >
              Close
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
