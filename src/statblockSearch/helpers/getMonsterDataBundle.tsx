import {
  DrawSteelStatblockZod,
  DrawSteelFeatureBlockZod,
} from "../../types/DrawSteelZod";
import type {
  MonsterDataBundle,
  StatblockIndexBundle,
} from "../../types/monsterDataBundlesZod";
import fetchTypedData from "./getTypedData";
import getBestiaryUrl from "./getBestiaryUrl";
import { monsterIndex } from "../monsterIndex";

export async function getMonsterDataBundle(
  indexBundle: StatblockIndexBundle,
): Promise<MonsterDataBundle> {
  const statblockUrl = getBestiaryUrl(indexBundle.path);
  const featureBLockUrls = indexBundle.features
    .map((id) => {
      const item = monsterIndex.find((item) => item.id === id);
      if (!item) console.error("Id not found:", id);
      return item?.path;
    })
    .filter((path) => path !== undefined)
    .map((path) => getBestiaryUrl(path));

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
