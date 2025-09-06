import z from "zod";

export const RoomTrackersZod = z
  .object({
    malice: z.int().optional(),
    heroTokens: z.int().optional(),
  })
  .optional();
export type RoomTrackers = z.infer<typeof RoomTrackersZod>;
