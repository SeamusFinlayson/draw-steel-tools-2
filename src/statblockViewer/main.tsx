import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./../index.css";
import MonsterView from "../statblockSearch/MonsterView.tsx";
import monsterIndex from "../statblockSearch/monsterIndex.json";
import { getMonsterDataBundle } from "../statblockSearch/helpers/getMonsterDataBundle.tsx";

const statblockName = new URLSearchParams(document.location.search).get(
  "statblockName",
);
const indexBundle = monsterIndex.find((val) => val.name === statblockName);
if (indexBundle === undefined) {
  throw new Error("Could not find statblock with name " + statblockName);
}
const monsterData = await getMonsterDataBundle(indexBundle);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MonsterView monsterData={monsterData} />
  </StrictMode>,
);
