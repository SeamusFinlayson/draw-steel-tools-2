import z from "zod";
import {
  DrawSteelFeatureBlockZod,
  DrawSteelStatblockZod,
} from "./DrawSteelZod";

export const PathBundleZod = z.strictObject({
  statblock: z.string(),
  features: z.array(z.string()),
});

export const FeatureIndexBundleZod = z.strictObject({
  id: z.string(),
  path: z.string(),
  name: z.string(),
  type: z.literal("feature"),
});

export const StatblockIndexBundleZod = z.strictObject({
  id: z.string(),
  path: z.string(),
  name: z.string(),
  type: z.literal("statblock"),
  level: z.number(),
  ev: z.string(),
  roles: z.array(z.string()),
  ancestry: z.array(z.string()),
  features: z.array(z.string()),
});

export const TerrainIndexBundleZod = z.strictObject({
  id: z.string(),
  path: z.string(),
  name: z.string(),
  type: z.literal("terrain"),
  level: z.number(),
  ev: z.string(),
  roles: z.array(z.string()),
});

export const IndexBundleZod = z.union([
  FeatureIndexBundleZod,
  StatblockIndexBundleZod,
  TerrainIndexBundleZod,
]);

export const MonsterDataBundleZod = z.strictObject({
  key: z.string(),
  statblock: DrawSteelStatblockZod,
  featuresBlocks: z.array(DrawSteelFeatureBlockZod),
});

export type PathBundle = z.infer<typeof PathBundleZod>;
export type FeatureIndexBundle = z.infer<typeof FeatureIndexBundleZod>;
export type StatblockIndexBundle = z.infer<typeof StatblockIndexBundleZod>;
export type TerrainIndexBundle = z.infer<typeof TerrainIndexBundleZod>;
export type IndexBundle = z.infer<typeof IndexBundleZod>;
export type MonsterDataBundle = z.infer<typeof MonsterDataBundleZod>;
