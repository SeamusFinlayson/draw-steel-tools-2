import SearchView from "./searchView/SearchView";
import { useEffect, useState } from "react";
import { OptionsView } from "./optionsView/OptionsView";
import { getDefaulAppState } from "./helpers/AppState";
import type { IndexBundle } from "../types/monsterDataBundlesZod";
import usePlayerRole from "../helpers/usePlayerRole";
import { useItems } from "../helpers/useItems";
import usePlayerSelection from "../helpers/usePlayerSelection";
import { getTargetItems } from "./helpers/getItemsWithGroupId";
import { StatblockPreviewDialog } from "./components/StatblockPreviewDialog";

const params = new URLSearchParams(document.location.search);
const groupId = params.get("groupId");

export default function StatblockSearch({
  monsterIndex,
}: {
  monsterIndex: IndexBundle[];
}) {
  const [appState, setAppState] = useState(getDefaulAppState());
  const playerRole = usePlayerRole();
  const items = useItems();
  const selection = usePlayerSelection();

  const targetItems = getTargetItems(items, selection, groupId);

  useEffect(() => {}, []);

  return (
    <div>
      <StatblockPreviewDialog appState={appState} setAppState={setAppState} />
      <div className="text-foreground bg-mirage-50 dark:bg-mirage-950 border-mirage-300 dark:border-mirage-700 flex h-screen min-h-screen flex-col rounded-2xl border">
        {appState.selectedIndexBundle === undefined ? (
          <SearchView
            monsterIndex={monsterIndex}
            appState={appState}
            setAppState={setAppState}
            playerRole={playerRole}
          />
        ) : (
          <OptionsView
            appState={appState}
            setAppState={setAppState}
            playerRole={playerRole}
            targetItems={targetItems}
          />
        )}
      </div>
    </div>
  );
}
