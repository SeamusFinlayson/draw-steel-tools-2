import * as DiceProtocol from "../diceProtocol";
import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useEffectEvent, useState } from "react";
import type { DiceRoller } from "../types/diceRollerTypes";

function requestDiceRollerConfig() {
  OBR.broadcast.sendMessage(
    DiceProtocol.DICE_ROLLER_HELLO_CHANNEL,
    {},
    { destination: "LOCAL" },
  );
}

export function useDiceRoller({
  onRollResult,
  channel,
}: {
  onRollResult: (rollResult: DiceProtocol.PowerRollResult) => void;
  channel?: string;
}): DiceRoller {
  const [config, setConfig] = useState<DiceProtocol.DiceRollerConfig>();
  const rollResultHandler = useEffectEvent(onRollResult);

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

  const replyChannel =
    channel === undefined
      ? DiceProtocol.ROLL_RESULT_CHANNEL
      : `${DiceProtocol.ROLL_RESULT_CHANNEL}/${channel}`;

  useEffect(
    () =>
      OBR.broadcast.onMessage(replyChannel, (event) => {
        const data = event.data as DiceProtocol.PowerRollResult;
        rollResultHandler(data);
      }),
    [],
  );
  const getUnsetConfig = () => ({
    config: undefined,
    connect: requestDiceRollerConfig,
    disconnect: () => setConfig(undefined),
    requestRoll: undefined,
  });

  if (config === undefined) return getUnsetConfig();

  const requestChannel = config.rollRequestChannels.find((val) =>
    val.includes("powerRollRequest"),
  );

  if (requestChannel === undefined) return getUnsetConfig();

  return {
    config,
    connect: requestDiceRollerConfig,
    disconnect: () => setConfig(undefined),
    requestRoll: (rollRequest) => {
      OBR.broadcast.sendMessage(
        requestChannel,
        {
          ...rollRequest,
          replyChannel: replyChannel,
        } satisfies DiceProtocol.PowerRollRequest,
        {
          destination: "LOCAL",
        },
      );
    },
  };
}
