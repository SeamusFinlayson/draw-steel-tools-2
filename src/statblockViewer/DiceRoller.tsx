import getResetRollAttributes, {
  powerRoll,
} from "../action/diceRoller/helpers.ts";
import { useDiceRoller } from "../helpers/useDiceRoller.ts";
import * as DiceProtocol from "../diceProtocol";
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

export function DiceRoller() {
  const rollAttributes = useContext(RollAttributesContext);
  const setRollAttributes = useContext(SetRollAttributesContext);
  const [result, setResult] = useState<Roll>();
  const trackerMetadata = useRoomMetadata(
    getPluginId("trackers"),
    RoomTrackersZod.parse,
  );

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

  const netEdges = rollAttributes.edges - rollAttributes.banes;

  return (
    <div className="flex justify-center bg-white">
      <div>{`Bonus: ${rollAttributes.bonus}`}</div>
      <button
        className="bg-accent rounded-t-md px-3 py-1 text-white"
        onClick={() => {
          diceRoller.requestRoll({
            id: Math.random().toString(),
            gmOnly: false,
            replyChannel: DiceProtocol.ROLL_RESULT_CHANNEL,
            rollProperties: {
              bonus: rollAttributes.banes,
              dice: rollAttributes.diceOptions,
              hasSkill: rollAttributes.hasSkill,
              netEdges,
            },
          });
        }}
      >
        Roll Me
      </button>
    </div>
  );
}
