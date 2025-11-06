import z from "zod";

export const MinionGroupZod = z.object({
  type: z.literal("MINION"),
  name: z.string(),
  id: z.string(),
  statblock: z.string().optional(),
  individualStamina: z.number(),
  currentStamina: z.number(),
});

export type MinionGroup = z.infer<typeof MinionGroupZod>;
