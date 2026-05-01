import {
  DrawSteelStatblockZod,
  DrawSteelFeatureBlockZod,
} from "../../types/DrawSteelZod";
import type {
  MonsterIndexBundle,
  MonsterDataBundle,
} from "../../types/monsterDataBundlesZod";
import fetchTypedData from "./getTypedData";
import getStatblockUrl from "./getStatblockUrl";

export async function getMonsterDataBundle(
  indexBundle: MonsterIndexBundle,
): Promise<MonsterDataBundle> {
  const statblockUrl = getStatblockUrl(indexBundle.statblock);
  const featureBLockUrls = indexBundle.features.map((item) =>
    getStatblockUrl(item),
  );

  const statblock = await fetchTypedData(
    statblockUrl,
    DrawSteelStatblockZod.parse,
  );
  const featureBlocks = await Promise.all(
    featureBLockUrls.map((item) =>
      fetchTypedData(item, DrawSteelFeatureBlockZod.parse),
    ),
  );

  return {
    key: indexBundle.name,
    statblock,
    featuresBlocks: featureBlocks,
  };
}
