import z from "zod";

export const SettingsZod = z
  .object({
    nameTagsEnabled: z.boolean().optional(),
    verticalOffset: z.number().optional(),
    justifyHealthBarsTop: z.boolean().optional(),
    showHealthBars: z.boolean().optional(),
    segmentsCount: z.number().optional(),
  })
  .optional();

export const DefinedSettingsZod = z.object({
  nameTagsEnabled: z.boolean(),
  verticalOffset: z.number(),
  justifyHealthBarsTop: z.boolean(),
  showHealthBars: z.boolean(),
  segmentsCount: z.number(),
});

export type Settings = z.infer<typeof SettingsZod>;
export type DefinedSettings = z.infer<typeof DefinedSettingsZod>;
