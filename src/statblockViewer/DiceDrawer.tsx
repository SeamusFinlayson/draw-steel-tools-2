import getResetRollAttributes, {
  powerRoll,
} from "../action/diceRoller/helpers.ts";
import { useDiceRoller } from "../helpers/useDiceRoller.ts";
import * as DiceProtocol from "../diceProtocol.ts";
import {
  SETTINGS_METADATA_KEY,
  defaultSettings,
} from "../helpers/settingsHelpers.ts";
import { useRoomMetadata } from "../helpers/useRoomMetadata.ts";
import type { Roll } from "../types/diceRollerTypes.ts";
import { RoomTrackersZod } from "../types/roomTrackersZod.ts";
import { SettingsZod } from "../types/settingsZod.ts";
import { useCallback, useContext, useMemo, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../helpers/getPluginId.ts";
import {
  RollAttributesContext,
  SetRollAttributesContext,
} from "./context/RollAttributesContext.ts";
import { ChevronUpIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
} from "../components/ui/collapsible.tsx";
import DiceRoller from "../action/diceRoller/DiceRoller.tsx";
import {
  DiceDrawerContext,
  SetDiceDrawerContext,
} from "./context/DiceDrawerContext.ts";

export function DiceDrawer() {
  const diceDrawer = useContext(DiceDrawerContext);
  const setDiceDrawer = useContext(SetDiceDrawerContext);
  const rollAttributes = useContext(RollAttributesContext);
  const setRollAttributes = useContext(SetRollAttributesContext);
  const [result, setResult] = useState<Roll>();
  // const trackerMetadata = useRoomMetadata(
  //   getPluginId("trackers"),
  //   RoomTrackersZod.parse,
  // );

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
    [rollAttributes, rollAttributes, definedSettings],
  );
  const diceRoller = useDiceRoller({ onRollResult: handleRollResult });

  if (!diceRoller.config) return;

  return (
    <div className="bg-mirage-50 border-mirage-300 rounded-t-2xl border border-b-0">
      <button
        className="flex w-full items-center justify-between gap-2 rounded-t-2xl px-4 py-2 font-bold"
        onClick={() => setDiceDrawer({ open: !diceDrawer.open })}
      >
        <div>Dice Roller</div>
        <ChevronUpIcon
          data-open={diceDrawer.open}
          className="transition-transform duration-200 ease-out data-[open=true]:-rotate-180"
        />
      </button>
      <Collapsible open={diceDrawer.open}>
        <CollapsibleContent>
          <DiceRoller
            diceResultViewerOpen={false}
            setDiceResultViewerOpen={() => {}}
            result={result}
            setResult={setResult}
            rollAttributes={rollAttributes}
            setRollAttributes={setRollAttributes}
            diceRoller={diceRoller}
            settings={definedSettings}
            onRollClicked={() => setDiceDrawer({ open: false })}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
