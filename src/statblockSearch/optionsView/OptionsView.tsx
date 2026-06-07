import { AlertTriangleIcon, XIcon } from "lucide-react";
import { MonsterPreviewCard } from "../components/MonsterPreviewCard";
import type { AppState } from "../helpers/AppState";
import { NoMonsterCard } from "../components/NoMonsterCard";
import Button from "../../components/ui/Button";
import { MinionOptions } from "./components/MinionOptions";
import { BasicOptions } from "./components/BasicOptions";
import { ScrollArea } from "../../components/ui/scrollArea";
import { sepertateTargetsForValidity } from "./helpers/sepertateTargetsForValidity";
import { ApplyToTokens } from "./helpers/applyToTokens";
import OBR, { type Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../helpers/getPluginId";

export function OptionsView({
  appState,
  setAppState,
  playerRole,
  targetItems,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  playerRole: "PLAYER" | "GM";
  targetItems: Item[];
}) {
  const setupOptions = appState.setupOptions;
  const selectedIndexBundle = appState.selectedIndexBundle;

  const { validTargets, invalidTargets } = sepertateTargetsForValidity(
    setupOptions?.type,
    targetItems,
  );

  if (selectedIndexBundle === undefined) {
    throw new Error("Selected index bundle cannot be undefined");
  }

  const disableConfirm = !setupOptions || validTargets.length === 0;

  const returnToSearch = () =>
    setAppState({
      ...appState,
      selectedIndexBundle: undefined,
      setupOptions: undefined,
    });

  return (
    <div className="flex grow flex-col">
      <ScrollArea className="grow basis-0">
        <div className="space-y-6 p-4">
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
          {invalidTargets.length > 0 && setupOptions && (
            <div className="bg-mirage-100 dark:bg-mirage-901 rounded-2xl p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon className="size-6 shrink-0" />
                  {validTargets.length > 0 ? (
                    <div>{`This data can only be applied to ${validTargets.length} of ${targetItems.length} target items.`}</div>
                  ) : (
                    <div>This data cannot be applied to any targets.</div>
                  )}
                </div>
                <div>
                  {invalidTargets.map((item) => (
                    <div
                      key={item.id}
                      className="text-foreground-secondary text-sm"
                    >
                      {`Cannot apply ${setupOptions.type} to ${item.name} because it is a ${item.type} on the ${item.layer} layer.`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <footer className="w-full">
        <div className="border-mirage-300 dark:border-mirage-700 flex gap-4 border-t px-4 py-3">
          <Button
            variant={"accentOutline"}
            className="grow"
            onClick={returnToSearch}
          >
            Back
          </Button>
          <Button
            disabled={disableConfirm}
            className="grow"
            onClick={() => {
              if (disableConfirm) return;
              ApplyToTokens(
                setupOptions,
                selectedIndexBundle,
                validTargets,
                playerRole,
              ).then(() => OBR.popover.close(getPluginId("statblockSearch")));
            }}
          >
            Confirm
          </Button>
        </div>
      </footer>
    </div>
  );
}
