import z from "zod";

export const SettingsZod = z
  .object({
    nameTagsEnabled: z.boolean().optional(),
    verticalOffset: z.number().optional(),
    alignHealthBarsTop: z.boolean().optional(),
    showHealthBars: z.boolean().optional(),
    segmentsCount: z.number().optional(),
  })
  .optional();

export type Settings = z.infer<typeof SettingsZod>;
