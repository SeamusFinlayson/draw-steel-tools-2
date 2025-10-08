import { XIcon } from "lucide-react";
import FreeWheelInput from "../components/logic/FreeWheelInput";
import Input from "../components/ui/Input";
import { MonsterPreviewCard } from "./MonsterPreviewCard";
import { Checkbox } from "../components/ui/checkbox";
import Label from "../components/ui/Label";
import { Collapsible, CollapsibleContent } from "../components/ui/collapsible";
import type { AppState, TokenOptions } from "../types/statblockLookupAppState";
import parseNumber from "../helpers/parseNumber";
import { NoMonsterCard } from "./NoMonsterCard";

export function OptionsView({
  appState,
  setAppState,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) {
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
      {appState.tokenOptions ? (
        <div>
          <h1 className="mb-1">Token Options</h1>
          <div className="flex items-center">
            <Checkbox
              id="setStaminaCheckbox"
              checked={appState.tokenOptions.stamina.overwriteTokens}
              onCheckedChange={(checked) =>
                setAppState({
                  ...appState,
                  tokenOptions: {
                    ...(appState.tokenOptions as TokenOptions),
                    stamina: {
                      ...(appState.tokenOptions as TokenOptions).stamina,
                      overwriteTokens: checked === true,
                    },
                  },
                })
              }
            />
            <Label className="h-fit" htmlFor="setStaminaCheckbox">
              {"Set Stamina"}
            </Label>
          </div>
          <Collapsible open={appState.tokenOptions.stamina.overwriteTokens}>
            <CollapsibleContent>
              <div className="bg-mirage-99 dark:bg-mirage-901 my-1 ml-10 space-y-4 rounded-2xl p-4">
                <div>
                  <Label htmlFor="nameInput" className="mb-2">
                    Stamina
                  </Label>
                  <Input id="nameInput" className="w-60 max-w-full">
                    <FreeWheelInput
                      value={appState.tokenOptions.stamina.value.toString()}
                      onUpdate={(target) => {
                        const stamina = parseNumber(target.value, {
                          truncate: true,
                          min: 0,
                          max: 9999,
                        });
                        setAppState({
                          ...appState,
                          tokenOptions: {
                            ...(appState.tokenOptions as TokenOptions),
                            stamina: {
                              ...(appState.tokenOptions as TokenOptions)
                                .stamina,
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
              checked={appState.tokenOptions.name.overwriteTokens}
              onCheckedChange={(checked) =>
                setAppState({
                  ...appState,
                  tokenOptions: {
                    ...(appState.tokenOptions as TokenOptions),
                    name: {
                      ...(appState.tokenOptions as TokenOptions).name,
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
          <Collapsible open={appState.tokenOptions.name.overwriteTokens}>
            <CollapsibleContent>
              <div className="bg-mirage-99 dark:bg-mirage-901 my-1 ml-10 space-y-4 rounded-2xl p-4">
                <div>
                  <Label htmlFor="nameInput" className="mb-1">
                    Name
                  </Label>
                  <Input id="nameInput" className="w-60 max-w-full">
                    <FreeWheelInput
                      value={appState.tokenOptions.name.value}
                      onUpdate={(target) => {
                        setAppState({
                          ...appState,
                          tokenOptions: {
                            ...(appState.tokenOptions as TokenOptions),
                            name: {
                              ...(appState.tokenOptions as TokenOptions).name,
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
                    checked={appState.tokenOptions.name.nameTag}
                    onCheckedChange={(checked) =>
                      setAppState({
                        ...appState,
                        tokenOptions: {
                          ...(appState.tokenOptions as TokenOptions),
                          name: {
                            ...(appState.tokenOptions as TokenOptions).name,
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
