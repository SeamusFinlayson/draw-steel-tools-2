import z from "zod";
import {
  DrawSteelFeatureBlockZod,
  DrawSteelStatblockZod,
} from "./DrawSteelZod";

export const PathBundleZod = z.strictObject({
  statblock: z.string(),
  features: z.array(z.string()),
});
export const IndexBundleZod = z.strictObject({
  ...PathBundleZod.shape,
  name: z.string(),
  level: z.number(),
  ev: z.string(),
  roles: z.array(z.string()),
  ancestry: z.array(z.string()),
});

export const MonsterDataBundleZod = z.strictObject({
  key: z.string(),
  statblock: DrawSteelStatblockZod,
  featuresBlocks: z.array(DrawSteelFeatureBlockZod),
});

export const DynamicTerrainIndexBundleZod = z.strictObject({
  dynamicTerrain: z.string(),
  name: z.string(),
  ev: z.string(),
  level: z.number(),
});

export type MonsterIndexBundle = z.infer<typeof IndexBundleZod>;
export type MonsterPathBundle = z.infer<typeof PathBundleZod>;
export type MonsterDataBundle = z.infer<typeof MonsterDataBundleZod>;
export type DynamicTerrainIndexBundle = z.infer<
  typeof DynamicTerrainIndexBundleZod
>;
