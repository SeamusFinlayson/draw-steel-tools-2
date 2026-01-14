import { createContext } from "react";
import type { RoomTrackers } from "../../types/roomTrackersZod";

export const RoomTrackersContext = createContext<RoomTrackers>({
  malice: 0,
  heroTokens: 0,
});

export const UpdateRoomTrackersContext = createContext<
  (newValue: RoomTrackers) => void
>(() => {});
