import * as DiceProtocol from "../diceProtocol";
import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";
import type { DiceRoller } from "../types/diceRollerTypes";

export function createRollRequest(args: {
  gmOnly: boolean;
  bonus: number;
  netEdges: number;
  hasSkill: boolean;
  dice: "2d10" | "3d10kh2" | "3d10kl2";
  styleId?: string;
}): DiceProtocol.PowerRollRequest {
  const { gmOnly, styleId, ...rollProperties } = args;
  return {
    id: `drawSteelTools-${Date.now()}`,
    replyChannel: DiceProtocol.ROLL_RESULT_CHANNEL,
    styleId,
    gmOnly,
    rollProperties,
  };
}

function requestDiceRollerConfig() {
  OBR.broadcast.sendMessage(
    DiceProtocol.DICE_ROLLER_HELLO_CHANNEL,
    {},
    { destination: "LOCAL" },
  );
}

export function useDiceRoller({
  onRollResult,
}: {
  onRollResult: (rollResult: DiceProtocol.PowerRollResult) => void;
}): DiceRoller {
  const [config, setConfig] = useState<DiceProtocol.DiceRollerConfig>();

  useEffect(() => {
    // Automatically connect to dice roller at startup
    requestDiceRollerConfig();

    return OBR.broadcast.onMessage(
      DiceProtocol.DICE_CLIENT_HELLO_CHANNEL,
      (event) => {
        const data = event.data as DiceProtocol.DiceRollerConfig;
        if (!data.dieTypes.includes("D10")) {
          console.error(
            "Error D10 is not supported by the requested dice roller",
          );
          return;
        }
        setConfig(data);
      },
    );
  }, []);

  useEffect(
    () =>
      OBR.broadcast.onMessage(DiceProtocol.ROLL_RESULT_CHANNEL, (event) => {
        const data = event.data as DiceProtocol.PowerRollResult;
        onRollResult(data);
      }),
    [onRollResult],
  );
  const getUnsetConfig = () => ({
    config: undefined,
    connect: requestDiceRollerConfig,
    disconnect: () => setConfig(undefined),
    requestRoll: undefined,
    onRollResult,
  });

  if (config === undefined) return getUnsetConfig();

  const channel = config.rollRequestChannels.find((val) =>
    val.includes("powerRollRequest"),
  );

  if (channel === undefined) return getUnsetConfig();

  return {
    config,
    connect: requestDiceRollerConfig,
    disconnect: () => setConfig(undefined),
    requestRoll: (rollRequest) => {
      OBR.broadcast.sendMessage(channel, rollRequest, {
        destination: "LOCAL",
      });
    },
    onRollResult,
  };
}
