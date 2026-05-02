import { getMonsterDataBundle } from "../statblockSearch/helpers/getMonsterDataBundle.tsx";
import { monsterIndex } from "../statblockSearch/monsterIndex.ts";

export const dataFromBestiaryIndexId = async (id: string, isName = false) => {
  const indexBundle = isName
    ? monsterIndex.find((val) => val.name === id)
    : monsterIndex.find((val) => val.id === id);

  if (indexBundle === undefined)
    throw new Error("Could not find statblock with name " + id);
  if (indexBundle.type === "terrain")
    throw new Error("Terrain lookup not implemented");
  if (indexBundle.type === "feature")
    throw new Error("Feature lookup not implemented");

  return await getMonsterDataBundle(indexBundle);
};
