import { createContext } from "react";
import type { Settings } from "../../types/settingsZod";

export const RoomSettingsContext = createContext<Settings>(undefined);

export const UpdateRoomSettingsContext = createContext<
  (newValue: Settings) => void
>(() => {});
