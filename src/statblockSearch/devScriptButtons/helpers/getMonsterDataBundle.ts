import { DrawSteelFeatureBlockZod } from "../../../types/DrawSteelZod";
import {
  DrawSteelResourceZod,
  type DrawSteelResource,
  type DrawSteelResourceBundle,
  type IndexBundle,
} from "../../../types/monsterDataBundlesZod";
import fetchTypedData from "./fetchTypedData";
import getBestiaryUrl from "./getBestiaryUrl";
import { monsterIndex } from "../monsterIndex";

export async function getMonsterDataBundle(
  indexBundle: IndexBundle,
): Promise<DrawSteelResourceBundle> {
  const fetches: Promise<DrawSteelResource>[] = [];
  const path = getBestiaryUrl(indexBundle.path);
  fetches.push(fetchTypedData(path, DrawSteelResourceZod.parse));

  if (indexBundle.type === "statblock") {
    const featureBLockUrls = indexBundle.features
      .map((id) => {
        const item = monsterIndex.find((item) => item.id === id);
        if (!item) console.error("Id not found:", id);
        return item?.path;
      })
      .filter((path) => path !== undefined)
      .map((path) => getBestiaryUrl(path));

    fetches.push(
      ...featureBLockUrls.map((item) => {
        return fetchTypedData(item, DrawSteelFeatureBlockZod.parse);
      }),
    );
  }

  const results = await Promise.all(fetches);

  const [resource, ...append] = results;

  return {
    key: indexBundle.id,
    resource,
    append,
  };
}
