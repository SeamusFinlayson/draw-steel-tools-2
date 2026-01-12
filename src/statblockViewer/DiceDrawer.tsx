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
import { SettingsZod } from "../types/settingsZod.ts";
import { useCallback, useContext, useMemo } from "react";
import OBR from "@owlbear-rodeo/sdk";
import {
  RollAttributesContext,
  SetRollAttributesContext,
} from "./context/RollAttributesContext.ts";
import { ChevronUpIcon, XIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
} from "../components/ui/collapsible.tsx";
import DiceRoller from "../action/diceRoller/DiceRoller.tsx";
import {
  DiceDrawerContext,
  SetDiceDrawerContext,
} from "./context/DiceDrawerContext.ts";
import Button from "../components/ui/Button.tsx";
import Label from "../components/ui/Label.tsx";

export function DiceDrawer() {
  const diceDrawer = useContext(DiceDrawerContext);
  const setDiceDrawer = useContext(SetDiceDrawerContext);
  const rollAttributes = useContext(RollAttributesContext);
  const setRollAttributes = useContext(SetRollAttributesContext);
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

      setDiceDrawer((prev) => ({
        ...prev,
        rollStatus: "DONE",
        result: powerRoll({
          bonus: data.rollProperties.bonus,
          hasSkill: data.rollProperties.hasSkill,
          netEdges: data.rollProperties.netEdges,
          rollMethod: "givenValues",
          dieValues: rolls,
          selectionStrategy:
            data.rollProperties.dice === "3d10kl2" ? "lowest" : "highest",
        }),
      }));
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
    <div className="bg-mirage-50 border-mirage-300 z-50 rounded-t-2xl">
      <button
        className="bg-accent flex w-full items-center justify-between gap-2 rounded-t-2xl px-4 py-2 font-bold text-white duration-200"
        onClick={() =>
          setDiceDrawer((prev) => ({ ...prev, open: !diceDrawer.open }))
        }
      >
        <div>Dice Roller</div>
        <ChevronUpIcon
          data-open={diceDrawer.open}
          className="transition-transform duration-300 ease-out data-[open=true]:-rotate-180"
        />
      </button>
      <Collapsible open={diceDrawer.open}>
        <CollapsibleContent>
          {/*<div className="border-mirage-300" />*/}
          {diceDrawer.target && (
            <div className="px-4 pt-4">
              <Label variant="small" htmlFor="bonusInput">
                Ability
              </Label>
              <div className="border-mirage-300 flex items-center justify-between rounded-2xl border pl-4">
                <div>{diceDrawer.target}</div>
                <Button
                  className="size-[36px] rounded-2xl"
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() =>
                    setDiceDrawer((prev) => ({ ...prev, target: undefined }))
                  }
                >
                  <XIcon />
                </Button>
              </div>
            </div>
          )}
          <DiceRoller
            diceResultViewerOpen={false}
            setDiceResultViewerOpen={() => {}}
            result={diceDrawer.result}
            setResult={(result: Roll | undefined) =>
              setDiceDrawer((prev) => ({
                ...prev,
                result,
                rollStatus: result ? "DONE" : "PENDING",
              }))
            }
            rollAttributes={rollAttributes}
            setRollAttributes={setRollAttributes}
            diceRoller={diceRoller}
            settings={definedSettings}
            onRollClicked={() =>
              setDiceDrawer((prev) => ({ ...prev, open: false }))
            }
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
