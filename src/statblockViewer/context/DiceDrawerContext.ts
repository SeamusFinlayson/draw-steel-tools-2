import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Roll } from "../../types/diceRollerTypes";

export type DiceDrawer = {
  open: boolean;
  result?: Roll;
  rollTargetId?: string;
  rollTargetName?: string;
  resultTargetId?: string;
};
export const defaultDiceDrawer = {
  open: false,
} satisfies DiceDrawer;

export const DiceDrawerContext = createContext<DiceDrawer>(defaultDiceDrawer);
export const SetDiceDrawerContext = createContext<
  Dispatch<SetStateAction<DiceDrawer>>
>(() => {});
