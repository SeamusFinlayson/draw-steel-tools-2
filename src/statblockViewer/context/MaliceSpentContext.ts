import { createContext, type Dispatch, type SetStateAction } from "react";

export type MaliceSpent = { target: string; value: number } | undefined;

export const MaliceSpentContext = createContext<MaliceSpent>(undefined);
export const SetMaliceSpentContext = createContext<
  Dispatch<SetStateAction<MaliceSpent>>
>(() => {});
