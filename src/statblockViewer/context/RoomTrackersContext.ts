import { createContext } from "react";
import type { RoomTrackers } from "../../types/roomTrackersZod";

export const RoomTrackersContext = createContext<RoomTrackers>(undefined);

export const UpdateRoomTrackersContext = createContext<
  (newValue: RoomTrackers) => void
>(() => {});
