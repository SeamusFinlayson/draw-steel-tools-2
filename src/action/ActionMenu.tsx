import DiceRoller from "./diceRoller/DiceRoller";
import ResourceTracker from "./resourceTracker/ResourceTracker";
import { useCallback, useMemo, useState } from "react";
import * as DiceProtocol from "../diceProtocol";
import OBR from "@owlbear-rodeo/sdk";
import usePlayerName from "../helpers/usePlayerName";
import { useDiceRoller } from "../helpers/useDiceRoller";
import type { Roll, RollAttributes } from "../types/diceRollerTypes";
import getResetRollAttributes, {
  defaultRollAttributes,
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
import { MinionGroupCleanup } from "./MinionGroupCleanup";

function ActionMenu() {
  const playerName = usePlayerName();
  const [rollAttributes, setRollAttributes] = useState<RollAttributes>(
    defaultRollAttributes,
  );
  const [diceResultViewerOpen, setDiceResultViewerOpen] = useState(false);
  const [result, setResult] = useState<Roll>();
  const trackerMetadata = useRoomMetadata(
    getPluginId("trackers"),
    RoomTrackersZod.parse,
  );
  const playerRole = usePlayerRole();

  const settingsMetadata = useRoomMetadata(
    SETTINGS_METADATA_KEY,
    SettingsZod.parse,
  );
  const definedSettings = useMemo(
    () => ({ ...defaultSettings, ...settingsMetadata.value }),
    [settingsMetadata],
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
          rollMethod: "givenValues",
          dieValues: rolls,
          selectionStrategy:
            data.rollProperties.dice === "3d10kl2" ? "lowest" : "highest",
        }),
      );
      setRollAttributes({
        ...getResetRollAttributes(rollAttributes, definedSettings),
        style: rollAttributes.style,
      });
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
                      <Badge
                        text={`Malice: ${trackerMetadata.value ? trackerMetadata.value.malice : 0}`}
                      />
                      <Badge
                        text={`Hero Tokens: ${trackerMetadata.value ? trackerMetadata.value.heroTokens : 0}`}
                      />
                    </>
                  }
                >
                  Room Resources
                </AccordionTrigger>
                <AccordionContent>
                  <ResourceTracker
                    trackers={trackerMetadata.value}
                    setTrackers={trackerMetadata.update}
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
                  <div className="mx-4">
                    <DiceRoller
                      diceResultViewerOpen={diceResultViewerOpen}
                      setDiceResultViewerOpen={setDiceResultViewerOpen}
                      rollAttributes={rollAttributes}
                      setRollAttributes={setRollAttributes}
                      result={result}
                      setResult={setResult}
                      diceRoller={diceRoller}
                      settings={definedSettings}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <MinionGroupCleanup />
          </div>
        </HeightMatch>
      </ScrollArea>
    </div>
  );
}

export default ActionMenu;
