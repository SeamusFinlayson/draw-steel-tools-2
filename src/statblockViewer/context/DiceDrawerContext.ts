import { createContext, type Dispatch, type SetStateAction } from "react";

export type DiceDrawer = { open: boolean };
export const defaultDiceDrawer = { open: false };

export const DiceDrawerContext = createContext<DiceDrawer>(defaultDiceDrawer);
export const SetDiceDrawerContext = createContext<
  Dispatch<SetStateAction<DiceDrawer>>
>(() => {});
