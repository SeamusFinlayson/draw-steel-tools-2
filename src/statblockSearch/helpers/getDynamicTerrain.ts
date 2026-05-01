import { DrawSteelDynamicTerrainZod } from "../../types/DrawSteelZod";
import type { DynamicTerrainIndexBundle } from "../../types/monsterDataBundlesZod";
import getBestiaryUrl from "./getBestiaryUrl";
import fetchTypedData from "./getTypedData";

export function getDynaimcTerrain(indexBundle: DynamicTerrainIndexBundle) {
  const url = getBestiaryUrl(indexBundle.dynamicTerrain);
  const data = fetchTypedData(url, DrawSteelDynamicTerrainZod.parse);
  console.log(data);
  return data;
}
