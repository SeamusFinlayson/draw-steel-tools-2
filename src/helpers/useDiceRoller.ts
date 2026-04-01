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
  onPowerRollResult,
  channel,
}: {
  onRollResult?: (rollResult: DiceProtocol.RollResult) => void;
  onPowerRollResult?: (rollResult: DiceProtocol.PowerRollResult) => void;
  channel?: string;
}): DiceRoller {
  const [config, setConfig] = useState<DiceProtocol.DiceRollerConfig>();
  const rollResultHandler = useEffectEvent(
    onRollResult ? onRollResult : () => {},
  );
  const powerRollResultHandler = useEffectEvent(
    onPowerRollResult ? onPowerRollResult : () => {},
  );

  useEffect(() => {
    // Automatically connect to dice roller at startup
    requestDiceRollerConfig();

    return OBR.broadcast.onMessage(
      DiceProtocol.DICE_CLIENT_HELLO_CHANNEL,
      (event) => {
        const data = event.data as DiceProtocol.DiceRollerConfig;
        let error = false;
        ["D3", "D6", "D10"].forEach((value) => {
          if (!(data.dieTypes as string[]).includes(value)) {
            console.error(
              `Error ${value} is not supported by the requested dice roller`,
            );
            error = true;
          }
        });
        if (error) return;
        setConfig(data);
      },
    );
  }, []);

  const rollReplyChannel =
    channel === undefined
      ? DiceProtocol.ROLL_RESULT_CHANNEL
      : `${DiceProtocol.ROLL_RESULT_CHANNEL}/${channel}`;

  useEffect(
    () =>
      OBR.broadcast.onMessage(rollReplyChannel, (event) => {
        const data = event.data as DiceProtocol.RollResult;
        rollResultHandler(data);
      }),
    [],
  );

  const powerRollReplyChannel =
    channel === undefined
      ? DiceProtocol.ROLL_RESULT_CHANNEL + "/powerRoll"
      : `${DiceProtocol.ROLL_RESULT_CHANNEL}/${channel}` + "/powerRoll";

  useEffect(
    () =>
      OBR.broadcast.onMessage(powerRollReplyChannel, (event) => {
        const data = event.data as DiceProtocol.PowerRollResult;
        powerRollResultHandler(data);
      }),
    [],
  );

  const getUnsetConfig = (): DiceRoller => ({
    config: undefined,
    connect: requestDiceRollerConfig,
    disconnect: () => setConfig(undefined),
    requestRoll: undefined,
    requestPowerRoll: undefined,
  });

  if (config === undefined) return getUnsetConfig();

  const rollRequestChannel = config.rollRequestChannels.find((val) =>
    val.includes("rollRequest"),
  );
  if (rollRequestChannel === undefined) return getUnsetConfig();

  const powerRollRequestChannel = config.rollRequestChannels.find((val) =>
    val.includes("powerRollRequest"),
  );
  if (powerRollRequestChannel === undefined) return getUnsetConfig();

  return {
    config,
    connect: requestDiceRollerConfig,
    disconnect: () => setConfig(undefined),
    requestRoll: (rollRequest) => {
      OBR.broadcast.sendMessage(
        rollRequestChannel,
        {
          ...rollRequest,
          replyChannel: rollReplyChannel,
        } satisfies DiceProtocol.RollRequest,
        {
          destination: "LOCAL",
        },
      );
    },
    requestPowerRoll: (rollRequest) => {
      OBR.broadcast.sendMessage(
        powerRollRequestChannel,
        {
          ...rollRequest,
          replyChannel: powerRollReplyChannel,
        } satisfies DiceProtocol.PowerRollRequest,
        {
          destination: "LOCAL",
        },
      );
    },
  };
}
