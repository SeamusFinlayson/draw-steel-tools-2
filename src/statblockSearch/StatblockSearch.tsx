import monsterIndex from "./monsterIndex.json";
import SearchView from "./components/SearchView";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../components/ui/dialog";
import MonsterView from "./components/MonsterView";
import { useState } from "react";
import { ScrollArea } from "../components/ui/scrollArea";
import Button from "../components/ui/Button";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../helpers/getPluginId";
import { OptionsView } from "./components/OptionsView";
import {
  defaultAppState,
  type AppState,
} from "../types/statblockLookupAppState";
import { getSelectedItems } from "../helpers/getSelectedItem";
import { TOKEN_METADATA_KEY } from "../helpers/tokenHelpers";
import {
  MonsterTokenDataZod,
  type MonsterTokenData,
} from "../types/tokenDataZod";

export default function StatblockSearch() {
  const [appState, setAppState] = useState<AppState>(defaultAppState);

  return (
    <div>
      <Dialog open={appState.monsterViewerOpen}>
        <DialogContent
          className="bg-mirage-50 h-11/12 p-0"
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
            <ScrollArea className="grow" noDarkMode>
              <DialogTitle className="max-h-0 overflow-clip">
                Statblock Viewer
              </DialogTitle>
              <DialogDescription className="max-h-0 overflow-clip">
                View of the selected statblock
              </DialogDescription>
              {appState.monsterViewerData ? (
                <MonsterView monsterData={appState.monsterViewerData} />
              ) : (
                <div className="grid h-full place-items-center p-4 text-black/20">
                  {"Loading..."}
                </div>
              )}
            </ScrollArea>
            <div className="border-mirage-300 flex gap-4 border-t px-4 py-2 sm:px-6 sm:py-3">
              <Button
                className="w-full"
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
          <SearchView monsterIndex={monsterIndex} setAppState={setAppState} />
        ) : (
          <OptionsView appState={appState} setAppState={setAppState} />
        )}

        <footer className="w-full">
          <div className="border-mirage-300 dark:border-mirage-700 flex gap-4 border-t px-4 py-2 sm:px-6 sm:py-3">
            <Button
              variant={"accentOutline"}
              className="grow"
              onClick={() => OBR.popover.close(getPluginId("statblockSearch"))}
            >
              Close
            </Button>
            {appState.tokenOptions && (
              <Button
                className="grow"
                onClick={async () => {
                  const tokenOptions = appState.tokenOptions;
                  if (!tokenOptions) throw new Error("Invalid token options");
                  const nameOptions = tokenOptions.name;
                  const staminaOptions = tokenOptions.stamina;

                  const selectedItems = await getSelectedItems();
                  OBR.scene.items.updateItems(
                    selectedItems.map((item) => item.id),
                    (items) => {
                      items.forEach((item) => {
                        const existingDataValidation =
                          MonsterTokenDataZod.safeParse(
                            items[0].metadata[TOKEN_METADATA_KEY],
                          );
                        item.metadata[TOKEN_METADATA_KEY] =
                          MonsterTokenDataZod.parse({
                            ...(existingDataValidation.success
                              ? existingDataValidation.data
                              : undefined),
                            type: "MONSTER",
                            gmOnly: true,
                            ...(nameOptions.overwriteTokens &&
                            nameOptions.nameTag
                              ? { name: nameOptions.value }
                              : {}),
                            ...(staminaOptions.overwriteTokens
                              ? {
                                  stamina: staminaOptions.value,
                                  staminaMaximum: staminaOptions.value,
                                }
                              : {}),
                            statblockName:
                              typeof appState.selectedIndexBundle === "object"
                                ? appState.selectedIndexBundle.name
                                : appState.selectedIndexBundle === "NONE"
                                  ? ""
                                  : "",
                          } satisfies MonsterTokenData);
                        if (nameOptions.overwriteTokens) {
                          item.name = nameOptions.value;
                        }
                      });
                    },
                  );
                  OBR.popover.close(getPluginId("statblockSearch"));
                }}
              >
                Confirm
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
