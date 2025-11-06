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
import OBR, { isImage } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../helpers/getPluginId";
import { OptionsView } from "./components/OptionsView";
import {
  defaultAppState,
  type AppState,
} from "../types/statblockLookupAppState";
import { getSelectedItems } from "../helpers/getSelectedItem";
import { TOKEN_METADATA_KEY } from "../helpers/tokenHelpers";
import {
  MinionTokenDataZod,
  MonsterTokenDataZod,
  type MinionTokenData,
  type MonsterTokenData,
} from "../types/tokenDataZod";
import { MinionGroupZod, type MinionGroup } from "../types/minionGroup";
import { MONSTER_GROUPS_METADATA_KEY } from "../helpers/monsterGroupHelpers";
import z from "zod";

const params = new URLSearchParams(document.location.search);
let groupId = params.get("groupId");

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
            {appState.setupOptions && (
              <Button
                className="grow"
                onClick={async () => {
                  const tokenOptions = appState.setupOptions;
                  if (!tokenOptions) throw new Error("Invalid token options");
                  const selectedItems = await getSelectedItems();

                  if (tokenOptions.type === "BASIC") {
                    const nameOptions = tokenOptions.name;
                    const staminaOptions = tokenOptions.stamina;
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
                              ...(nameOptions.enabled && nameOptions.nameTag
                                ? { name: nameOptions.value }
                                : {}),
                              ...(staminaOptions.enabled
                                ? {
                                    stamina: staminaOptions.value,
                                    staminaMaximum: staminaOptions.value,
                                  }
                                : {}),
                              statblockName:
                                typeof appState.selectedIndexBundle === "object"
                                  ? appState.selectedIndexBundle.name
                                  : appState.selectedIndexBundle === "NONE"
                                    ? undefined
                                    : "",
                            } satisfies MonsterTokenData);
                          if (nameOptions.enabled) {
                            item.name = nameOptions.value;
                          }
                        });
                      },
                    );
                  }
                  if (tokenOptions.type === "MINION") {
                    let groupSize: number | null = null;
                    if (groupId === "" || groupId === null) {
                      groupId = `${Date.now().toString()}-${Math.trunc(Math.random() * 10000)}`;
                      groupSize = (
                        (await OBR.player.getSelection()) as string[]
                      ).length;
                      OBR.scene.items.updateItems(
                        selectedItems.map((item) => item.id),
                        (items) => {
                          items.forEach(async (item) => {
                            const existingDataValidation =
                              MinionTokenDataZod.safeParse(
                                items[0].metadata[TOKEN_METADATA_KEY],
                              );
                            item.metadata[TOKEN_METADATA_KEY] =
                              MinionTokenDataZod.parse({
                                ...(existingDataValidation.success
                                  ? existingDataValidation.data
                                  : undefined),
                                type: "MINION",
                                groupId: groupId as string,
                              } satisfies MinionTokenData);
                            item.name = tokenOptions.groupName.value;
                          });
                        },
                      );
                    } else {
                      const groupItems = await OBR.scene.items.getItems(
                        (item) =>
                          isImage(item) &&
                          (
                            item.metadata?.[
                              TOKEN_METADATA_KEY
                            ] as MinionTokenData
                          )?.groupId === groupId,
                      );
                      groupSize = groupItems.length;
                    }

                    const minionGroups = z
                      .array(MinionGroupZod)
                      .safeParse(
                        (await OBR.scene.getMetadata())[
                          MONSTER_GROUPS_METADATA_KEY
                        ],
                      );

                    OBR.scene.setMetadata({
                      [MONSTER_GROUPS_METADATA_KEY]: z
                        .array(MinionGroupZod)
                        .parse([
                          ...(minionGroups.success ? minionGroups.data : []),
                          {
                            type: "MINION",
                            id: groupId,
                            individualStamina: tokenOptions.stamina.value,
                            name: tokenOptions.groupName.value,
                            statblock:
                              typeof appState.selectedIndexBundle === "object"
                                ? appState.selectedIndexBundle.name
                                : appState.selectedIndexBundle === "NONE"
                                  ? undefined
                                  : "",
                            currentStamina:
                              tokenOptions.stamina.value * groupSize,
                          },
                        ] satisfies MinionGroup[]),
                    });
                  }
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
