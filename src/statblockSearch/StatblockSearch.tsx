import SearchView from "./searchView/SearchView";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../components/ui/dialog";
import { useState } from "react";
import Button from "../components/ui/Button";
import { OptionsView } from "./optionsView/OptionsView";
import {
  defaultAppState,
  type AppState,
} from "../types/statblockLookupAppState";
import type { IndexBundle } from "../types/monsterDataBundlesZod";
import usePlayerRole from "../helpers/usePlayerRole";
import { defaultSearchData } from "../types/statblockSearchData";

const params = new URLSearchParams(document.location.search);
const orgaization = params.get("organization");

export default function StatblockSearch({
  monsterIndex,
}: {
  monsterIndex: IndexBundle[];
}) {
  const [appState, setAppState] = useState<AppState>({
    ...defaultAppState,
    search: {
      ...defaultSearchData,
      organizations: orgaization ? [orgaization] : [],
    },
  });
  const playerRole = usePlayerRole();

  return (
    <div>
      <Dialog open={appState.monsterViewerOpen}>
        <DialogTitle className="max-h-0 overflow-clip">
          Statblock Viewer
        </DialogTitle>
        <DialogDescription className="max-h-0 overflow-clip">
          View of the selected statblock
        </DialogDescription>
        <DialogContent
          className="bg-mirage-50 h-10/12 w-lg p-0"
          onPointerDownOutside={() =>
            setAppState({ ...appState, monsterViewerOpen: false })
          }
          onEscapeKeyDown={() =>
            setAppState({ ...appState, monsterViewerOpen: false })
          }
          onInteractOutside={() =>
            setAppState({ ...appState, monsterViewerOpen: false })
          }
        >
          <div className="bg-mirage-50 flex h-full flex-col">
            {appState.previewIndexBundle ? (
              <iframe
                className="w-full grow"
                src={(() => {
                  const url = new URL(
                    "/statblockViewer",
                    window.location.origin,
                  );
                  url.searchParams.set(
                    "statblockName",
                    appState.previewIndexBundle.name,
                  );
                  return url.toString();
                })()}
              />
            ) : (
              <div className="grid grow place-items-center p-4 text-black/20">
                {"Loading..."}
              </div>
            )}
            <div className="border-mirage-300 flex gap-4 border-t px-4 py-2 sm:px-6 sm:py-3">
              <Button
                className="w-full bg-[#9966ff] text-[#f5f2ff] hover:bg-[#9966ff]/90"
                onClick={() =>
                  setAppState({ ...appState, monsterViewerOpen: false })
                }
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
          />
        )}
      </div>
    </div>
  );
}
