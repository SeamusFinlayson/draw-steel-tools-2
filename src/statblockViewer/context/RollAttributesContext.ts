import { createContext, type Dispatch, type SetStateAction } from "react";
import type { RollAttributes } from "../../types/diceRollerTypes";
import { defaultRollAttributes } from "../../action/diceRoller/helpers";

export const RollAttributesContext = createContext<RollAttributes>(
  defaultRollAttributes,
);
export const SetRollAttributesContext = createContext<
  Dispatch<SetStateAction<RollAttributes>>
>(() => {});
