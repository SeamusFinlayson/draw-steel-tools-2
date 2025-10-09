import { XIcon } from "lucide-react";
import FreeWheelInput from "../components/logic/FreeWheelInput";
import Input from "../components/ui/Input";
import { MonsterPreviewCard } from "./MonsterPreviewCard";
import { Checkbox } from "../components/ui/checkbox";
import Label from "../components/ui/Label";
import { Collapsible, CollapsibleContent } from "../components/ui/collapsible";
import type { AppState } from "../types/statblockLookupAppState";
import parseNumber from "../helpers/parseNumber";
import { NoMonsterCard } from "./NoMonsterCard";

export function OptionsView({
  appState,
  setAppState,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) {
  const tokenOptions = appState.tokenOptions;

  return (
    <div className="grow space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="mb-1">Selected Statblock</h1>
        {appState.selectedIndexBundle !== undefined &&
          (appState.selectedIndexBundle === "NONE" ? (
            <NoMonsterCard
              onActionClick={() =>
                setAppState({
                  ...appState,
                  selectedIndexBundle: undefined,
                  tokenOptions: undefined,
                })
              }
              icon={<XIcon />}
            />
          ) : (
            <MonsterPreviewCard
              indexBundle={appState.selectedIndexBundle}
              onCardClick={() =>
                setAppState({ ...appState, monsterViewerOpen: true })
              }
              onActionClick={() =>
                setAppState({
                  ...appState,
                  selectedIndexBundle: undefined,
                  tokenOptions: undefined,
                })
              }
              icon={<XIcon />}
            />
          ))}
      </div>
      {tokenOptions ? (
        <div>
          <h1 className="mb-1">Token Options</h1>
          <div className="flex items-center">
            <Checkbox
              id="setStaminaCheckbox"
              checked={tokenOptions.stamina.overwriteTokens}
              onCheckedChange={(checked) => {
                setAppState({
                  ...appState,
                  tokenOptions: {
                    ...tokenOptions,
                    stamina: {
                      ...tokenOptions.stamina,
                      overwriteTokens: checked === true,
                    },
                  },
                });
              }}
            />
            <Label className="h-fit" htmlFor="setStaminaCheckbox">
              {"Set Stamina"}
            </Label>
          </div>
          <Collapsible open={tokenOptions.stamina.overwriteTokens}>
            <CollapsibleContent>
              <div className="bg-mirage-99 dark:bg-mirage-901 my-1 ml-10 space-y-4 rounded-2xl p-4">
                <div>
                  <Label htmlFor="nameInput" className="mb-2">
                    Stamina
                  </Label>
                  <Input id="nameInput" className="w-60 max-w-full">
                    <FreeWheelInput
                      clearContentOnFocus
                      value={tokenOptions.stamina.value.toString()}
                      onUpdate={(target) => {
                        const stamina = parseNumber(target.value, {
                          truncate: true,
                          min: 0,
                          max: 9999,
                          inlineMath: {
                            previousValue: tokenOptions.stamina.value,
                          },
                        });
                        setAppState({
                          ...appState,
                          tokenOptions: {
                            ...tokenOptions,
                            stamina: {
                              ...tokenOptions.stamina,
                              value: stamina,
                            },
                          },
                        });
                      }}
                    />
                  </Input>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <div className="flex items-center">
            <Checkbox
              id="setNameCheckbox"
              checked={tokenOptions.name.overwriteTokens}
              onCheckedChange={(checked) =>
                setAppState({
                  ...appState,
                  tokenOptions: {
                    ...tokenOptions,
                    name: {
                      ...tokenOptions.name,
                      overwriteTokens: checked === true,
                    },
                  },
                })
              }
            />
            <Label className="h-fit" htmlFor="setNameCheckbox">
              {"Set Name"}
            </Label>
          </div>
          <Collapsible open={tokenOptions.name.overwriteTokens}>
            <CollapsibleContent>
              <div className="bg-mirage-99 dark:bg-mirage-901 my-1 ml-10 space-y-4 rounded-2xl p-4">
                <div>
                  <Label htmlFor="nameInput" className="mb-1">
                    Name
                  </Label>
                  <Input id="nameInput" className="w-60 max-w-full">
                    <FreeWheelInput
                      value={tokenOptions.name.value}
                      onUpdate={(target) => {
                        setAppState({
                          ...appState,
                          tokenOptions: {
                            ...tokenOptions,
                            name: {
                              ...tokenOptions.name,
                              value: target.value,
                            },
                          },
                        });
                      }}
                    />
                  </Input>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="AddNameTagCheckbox"
                    checked={tokenOptions.name.nameTag}
                    onCheckedChange={(checked) =>
                      setAppState({
                        ...appState,
                        tokenOptions: {
                          ...tokenOptions,
                          name: {
                            ...tokenOptions.name,
                            nameTag: checked === true,
                          },
                        },
                      })
                    }
                  />
                  <Label className="h-fit" htmlFor="AddNameTagCheckbox">
                    Add Name Tag
                  </Label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : (
        <div className="text-foreground/20">Loading...</div>
      )}
    </div>
  );
}
