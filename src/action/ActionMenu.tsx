import DiceRoller from "./diceRoller/DiceRoller";
import ResourceTracker from "./resourceTracker/ResourceTracker";
import { useCallback, useMemo, useState } from "react";
import * as DiceProtocol from "../diceProtocol";
import OBR from "@owlbear-rodeo/sdk";
import usePlayerName from "../helpers/usePlayerName";
import { useDiceRoller } from "../helpers/diceCommunicationHelpers";
import type { Roll, RollAttributes } from "../types/diceRollerTypes";
import getResetRollAttributes, {
  defaultRollerAttributes,
  powerRoll,
} from "./diceRoller/helpers";
import { Header } from "./header/Header";
import { ScrollArea } from "../components/ui/scrollArea";
import HeightMatch from "../components/logic/HeightMatch";
import { useRoomMetadata } from "../helpers/useRoomMetadata";
import { getPluginId } from "../helpers/getPluginId";
import { RoomTrackersZod } from "../types/roomTrackersZod";
import usePlayerRole from "../helpers/usePlayerRole";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import {
  defaultSettings,
  SETTINGS_METADATA_KEY,
} from "../helpers/settingsHelpers";
import { SettingsZod } from "../types/settingsZod";

function ActionMenu() {
  const playerName = usePlayerName();
  const [rollAttributes, setRollAttributes] = useState<RollAttributes>(
    defaultRollerAttributes,
  );
  const [diceResultViewerOpen, setDiceResultViewerOpen] = useState(false);
  const [result, setResult] = useState<Roll>();
  const [trackers, setTrackers] = useRoomMetadata(
    getPluginId("trackers"),
    RoomTrackersZod.parse,
  );
  const playerRole = usePlayerRole();

  const [settings] = useRoomMetadata(SETTINGS_METADATA_KEY, SettingsZod.parse);
  const definedSettings = useMemo(
    () => ({ ...defaultSettings, ...settings }),
    [settings],
  );

  // External dice roller
  const handleRollResult = useCallback(
    (data: DiceProtocol.PowerRollResult) => {
      OBR.action.open();
      const rolls = data.result.map((val) => val.result);
      for (let i = 0; i < rolls.length; i++) {
        if (rolls[i] === 0) rolls[i] = 10;
      }

      setResult(
        powerRoll({
          bonus: data.rollProperties.bonus,
          hasSkill: data.rollProperties.hasSkill,
          netEdges: data.rollProperties.netEdges,
          playerName,
          rollMethod: "givenValues",
          dieValues: rolls,
          selectionStrategy:
            data.rollProperties.dice === "3d10kl2" ? "lowest" : "highest",
        }),
      );
      setRollAttributes(
        getResetRollAttributes(rollAttributes, definedSettings),
      );
    },
    [playerName, definedSettings, rollAttributes],
  );
  const diceRoller = useDiceRoller({ onRollResult: handleRollResult });

  const setActionHeight = useCallback(
    (height: number) => OBR.action.setHeight(height),
    [],
  );

  return (
    <div className="bg-mirage-50/75 dark:bg-mirage-950/50 h-screen">
      <ScrollArea className="h-full" type="always">
        <HeightMatch setHeight={setActionHeight}>
          <div className="text-foreground flex flex-col pb-2">
            <Header
              diceRoller={diceRoller}
              setRollAttributes={setRollAttributes}
            />
            <Accordion
              {...(definedSettings.keepActivitiesOpen
                ? { type: "multiple" }
                : {
                    type: "single",
                    defaultValue: "item-2",
                    collapsible: true,
                  })}
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger
                  preview={
                    <>
                      <Badge text={`Malice: ${trackers?.malice}`} />
                      <Badge text={`Hero Tokens: ${trackers?.heroTokens}`} />
                    </>
                  }
                >
                  Room Resources
                </AccordionTrigger>
                <AccordionContent>
                  <ResourceTracker
                    trackers={trackers}
                    setTrackers={setTrackers}
                    playerRole={playerRole}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger
                  alwaysShowPreview
                  preview={
                    result === undefined ? (
                      <Badge text={"Make a Roll"} />
                    ) : (
                      <>
                        <Badge text={`Total: ${result.total}`} />
                        <Badge
                          text={
                            result.critical ? "Critical" : `Tier ${result.tier}`
                          }
                        />
                      </>
                    )
                  }
                >
                  Power Roll
                </AccordionTrigger>
                <AccordionContent>
                  <DiceRoller
                    playerName={playerName}
                    diceResultViewerOpen={diceResultViewerOpen}
                    setDiceResultViewerOpen={setDiceResultViewerOpen}
                    rollAttributes={rollAttributes}
                    setRollAttributes={setRollAttributes}
                    result={result}
                    setResult={setResult}
                    diceRoller={diceRoller}
                    settings={definedSettings}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </HeightMatch>
      </ScrollArea>
    </div>
  );
}

export default ActionMenu;
