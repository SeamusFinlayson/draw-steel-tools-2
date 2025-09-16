import z from "zod";

export const HeroTokenDataZod = z.object({
  type: z.literal("HERO").optional(),
  name: z.string().optional(),
  gmOnly: z.boolean().optional(),
  stamina: z.number().optional(),
  staminaMaximum: z.number().optional(),
  temporaryStamina: z.number().optional(),
  heroicResource: z.number().optional(),
  recoveries: z.number().optional(),
  surges: z.number().optional(),
});

export const MonsterTokenDataZod = z.object({
  type: z.literal("MONSTER"),
  name: z.string().optional(),
  gmOnly: z.boolean().optional(),
  stamina: z.number().optional(),
  staminaMaximum: z.number().optional(),
  temporaryStamina: z.number().optional(),
});

export const CharacterTokenDataZod = z
  .union([HeroTokenDataZod, MonsterTokenDataZod])
  .optional();

export const DefinedHeroTokenDataZod = z.object({
  type: z.literal("HERO"),
  name: z.string(),
  gmOnly: z.boolean(),
  stamina: z.number(),
  staminaMaximum: z.number(),
  temporaryStamina: z.number(),
  heroicResource: z.number(),
  recoveries: z.number(),
  surges: z.number(),
});

export const DefinedMonsterTokenDataZod = z.object({
  type: z.literal("MONSTER"),
  name: z.string(),
  gmOnly: z.boolean(),
  stamina: z.number(),
  staminaMaximum: z.number(),
  temporaryStamina: z.number(),
});

export const DefinedCharacterTokenDataZod = z.union([
  DefinedHeroTokenDataZod,
  DefinedMonsterTokenDataZod,
]);

export type HeroTokenData = z.infer<typeof HeroTokenDataZod>;
export type MonsterTokenData = z.infer<typeof MonsterTokenDataZod>;
export type CharacterTokenData = z.infer<typeof CharacterTokenDataZod>;
export type DefinedHeroTokenData = z.infer<typeof DefinedHeroTokenDataZod>;
export type DefinedMonsterTokenData = z.infer<
  typeof DefinedMonsterTokenDataZod
>;
export type DefinedCharacterTokenData = z.infer<
  typeof DefinedCharacterTokenDataZod
>;
