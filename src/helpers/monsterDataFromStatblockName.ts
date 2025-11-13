import monsterIndex from "../statblockSearch/monsterIndex.json";
import { getMonsterDataBundle } from "../statblockSearch/helpers/getMonsterDataBundle.tsx";

export const monsterDataFromStatblockName = async (monsterId: string) => {
  const indexBundle = monsterIndex.find((val) => val.name === monsterId);
  if (indexBundle === undefined) {
    throw new Error("Could not find statblock with name " + monsterId);
  }
  return await getMonsterDataBundle(indexBundle);
};
