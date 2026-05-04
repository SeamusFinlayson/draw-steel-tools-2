import { getMonsterDataBundle } from "../statblockSearch/helpers/getMonsterDataBundle.ts";
import { monsterIndex } from "../statblockSearch/monsterIndex.ts";

export const dataFromBestiaryIndexId = async (id: string) => {
  let indexBundle = monsterIndex.find((val) => val.id === id);
  if (indexBundle === undefined)
    indexBundle = monsterIndex.find((val) => val.name === id);
  if (indexBundle === undefined)
    throw new Error("Could not find resource with id or name " + id);
  return await getMonsterDataBundle(indexBundle);
};
