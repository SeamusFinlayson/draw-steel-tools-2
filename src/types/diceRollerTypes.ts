import * as DiceProtocol from "../diceProtocol";

export type DiceOptions = "2d10" | "3d10kh2" | "3d10kl2";
export type RollVisibility = "shared" | "self";
export type RollAttributes = {
  edges: number;
  banes: number;
  bonus: number;
  hasSkill: boolean;
  diceOptions: DiceOptions;
  visibility: RollVisibility;
  style?: DiceProtocol.DieStyle;
};

export type Roll = {
  timeStamp: number;
  playerName: string;
  bonus: number;
  hasSkill: boolean;
  netEdges: number;
  tier: number;
  critical: boolean;
  total: number;
  dieResults: DieResult[];
};

export type DieResult = {
  value: number;
  dropped: boolean;
};

export type DiceRoller = {
  connect: () => void;
  disconnect: () => void;
  onRollResult: (rollResult: DiceProtocol.PowerRollResult) => void;
} & (
  | {
      config: DiceProtocol.DiceRollerConfig;
      requestRoll: (rollRequest: DiceProtocol.PowerRollRequest) => void;
    }
  | {
      config: undefined;
      requestRoll: undefined;
    }
);
