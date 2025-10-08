import {
  DrawSteelStatblockZod,
  DrawSteelFeatureBlockZod,
} from "../../types/DrawSteelZod";
import type {
  IndexBundle,
  MonsterDataBundle,
} from "../../types/monsterDataBundlesZod";
import fetchTypedData from "./getTypedData";
import getUrl from "./getUrl";

export async function getMonsterDataBundle(
  indexBundle: IndexBundle,
): Promise<MonsterDataBundle> {
  const statblockUrl = getUrl(indexBundle.statblock);
  const featureBLockUrls = indexBundle.features.map((item) => getUrl(item));

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
