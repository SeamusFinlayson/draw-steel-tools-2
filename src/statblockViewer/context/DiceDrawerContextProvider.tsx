import { useState } from "react";
import {
  defaultDiceDrawer,
  DiceDrawerContext,
  SetDiceDrawerContext,
  type DiceDrawer,
} from "./DiceDrawerContext";

export function DiceDrawerProvider({ children }: { children: any }) {
  const [diceDrawer, setDiceDrawer] = useState<DiceDrawer>(defaultDiceDrawer);

  return (
    <DiceDrawerContext value={diceDrawer}>
      <SetDiceDrawerContext value={setDiceDrawer}>
        {children}
      </SetDiceDrawerContext>
    </DiceDrawerContext>
  );
}
