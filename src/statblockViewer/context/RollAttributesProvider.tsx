import { useState } from "react";
import { defaultRollAttributes } from "../../action/diceRoller/helpers";
import {
  RollAttributesContext,
  SetRollAttributesContext,
} from "./RollAttributesContext";
import type { RollAttributes } from "../../types/diceRollerTypes";

export function RollAttributesProvider({ children }: { children: any }) {
  const [rollAttributes, setRollAttributes] = useState<RollAttributes>(
    defaultRollAttributes,
  );

  return (
    <RollAttributesContext value={rollAttributes}>
      <SetRollAttributesContext value={setRollAttributes}>
        {children}
      </SetRollAttributesContext>
    </RollAttributesContext>
  );
}
