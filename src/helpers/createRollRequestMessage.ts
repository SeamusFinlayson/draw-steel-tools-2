import * as DiceProtocol from "../diceProtocol";

export function createRollRequestMessage(args: {
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
