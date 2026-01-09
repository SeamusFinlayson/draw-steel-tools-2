import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Roll } from "../../types/diceRollerTypes";

export type DiceDrawer = {
  open: boolean;
  result?: Roll;
  target?: string;
  rollStatus: "IDLE" | "PENDING" | "DONE";
};
export const defaultDiceDrawer = {
  open: false,
  rollStatus: "IDLE",
} satisfies DiceDrawer;

export const DiceDrawerContext = createContext<DiceDrawer>(defaultDiceDrawer);
export const SetDiceDrawerContext = createContext<
  Dispatch<SetStateAction<DiceDrawer>>
>(() => {});
