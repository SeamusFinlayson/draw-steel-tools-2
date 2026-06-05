import { XIcon } from "lucide-react";
import { MonsterPreviewCard } from "../components/MonsterPreviewCard";
import type { AppState } from "../../types/statblockLookupAppState";
import { NoMonsterCard } from "../components/NoMonsterCard";
import Button from "../../components/ui/Button";
import { MinionOptions } from "./components/MinionOptions";
import { BasicOptions } from "./components/BasicOptions";
import { ScrollArea } from "../../components/ui/scrollArea";
import { useItems } from "../../helpers/useItems";
import usePlayerSelection from "../../helpers/usePlayerSelection";
import { getItemsWithGroupId } from "./helpers/getItemsWithGroupId";
import { sepertateTargetsForValidity } from "./helpers/sepertateTargetsForValidity";
import { ApplyToTokens } from "./helpers/applyToTokens";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../helpers/getPluginId";

const params = new URLSearchParams(document.location.search);
let groupId = params.get("groupId");

export function OptionsView({
  appState,
  setAppState,
  playerRole,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  playerRole: "PLAYER" | "GM";
}) {
  const items = useItems();
  const selection = usePlayerSelection();

  const selectedItems = items.filter((item) => selection?.includes(item.id));
  const itemsWithGroupId = getItemsWithGroupId(groupId, items);
  let targetItems = itemsWithGroupId ? itemsWithGroupId : selectedItems;

  const setupOptions = appState.setupOptions;
  const selectedIndexBundle = appState.selectedIndexBundle;

  const { valid, invalid } = sepertateTargetsForValidity(
    setupOptions?.type,
    targetItems,
  );
  targetItems = valid;

  if (selectedIndexBundle === undefined) {
    throw new Error("Selected index bundle cannot be undefined");
  }

  const returnToSearch = () =>
    setAppState({
      ...appState,
      selectedIndexBundle: undefined,
      setupOptions: undefined,
    });

  return (
    <div className="flex grow flex-col">
      <ScrollArea className="grow basis-0">
        <div className="space-y-6 p-4 sm:p-6">
          <div>
            <h1 className="mb-1">Selected Statblock</h1>
            {selectedIndexBundle === "NONE" ? (
              <NoMonsterCard
                variant={
                  setupOptions?.type === "MINION"
                    ? "MINION"
                    : setupOptions?.type === "TERRAIN"
                      ? "TERRAIN"
                      : "BASIC"
                }
                onActionClick={returnToSearch}
                icon={<XIcon />}
              />
            ) : (
              <MonsterPreviewCard
                indexBundle={selectedIndexBundle}
                onCardClick={() =>
                  setAppState({ ...appState, monsterViewerOpen: true })
                }
                onActionClick={returnToSearch}
                icon={<XIcon />}
              />
            )}
          </div>
          {setupOptions ? (
            <>
              {setupOptions.type === "MINION" && (
                <MinionOptions
                  setupOptions={setupOptions}
                  setSetupOptions={(setupOptions) =>
                    setAppState({ ...appState, setupOptions })
                  }
                />
              )}
              {(setupOptions.type === "MONSTER" ||
                setupOptions.type === "TERRAIN") && (
                <BasicOptions
                  setupOptions={setupOptions}
                  setSetupOptions={(setupOptions) =>
                    setAppState({ ...appState, setupOptions })
                  }
                />
              )}
            </>
          ) : (
            <div className="text-foreground/20">Loading...</div>
          )}
        </div>
        {invalid.length > 0 && (
          <div>{`${invalid.length} items cannot be assigned a statblock of this type.`}</div>
        )}
      </ScrollArea>

      <footer className="w-full">
        <div className="border-mirage-300 dark:border-mirage-700 flex gap-4 border-t px-4 py-2 sm:px-6 sm:py-3">
          <Button
            variant={"accentOutline"}
            className="grow"
            onClick={returnToSearch}
          >
            Back
          </Button>
          {setupOptions && targetItems.length > 0 && (
            <Button
              className="grow"
              onClick={() => {
                ApplyToTokens(
                  setupOptions,
                  selectedIndexBundle,
                  targetItems,
                  playerRole,
                ).then(() => OBR.popover.close(getPluginId("statblockSearch")));
              }}
            >
              Confirm
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
