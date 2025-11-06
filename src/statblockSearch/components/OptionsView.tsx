import { XIcon } from "lucide-react";
import FreeWheelInput from "../../components/logic/FreeWheelInput";
import Input from "../../components/ui/Input";
import { MonsterPreviewCard } from "./MonsterPreviewCard";
import { Checkbox } from "../../components/ui/checkbox";
import Label from "../../components/ui/Label";
import {
  Collapsible,
  CollapsibleContent,
} from "../../components/ui/collapsible";
import type { AppState } from "../../types/statblockLookupAppState";
import parseNumber from "../../helpers/parseNumber";
import { NoMonsterCard } from "./NoMonsterCard";

export function OptionsView({
  appState,
  setAppState,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) {
  const setupOptions = appState.setupOptions;
  const selectedIndexBundle = appState.selectedIndexBundle;

  if (selectedIndexBundle === undefined) {
    throw new Error("Selected index bundle cannot be undefined");
  }

  return (
    <div className="grow space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="mb-1">Selected Statblock</h1>
        {selectedIndexBundle === "NONE" ? (
          <NoMonsterCard
            onActionClick={() =>
              setAppState({
                ...appState,
                selectedIndexBundle: undefined,
                setupOptions: undefined,
              })
            }
            icon={<XIcon />}
          />
        ) : (
          <MonsterPreviewCard
            indexBundle={selectedIndexBundle}
            onCardClick={() =>
              setAppState({ ...appState, monsterViewerOpen: true })
            }
            onActionClick={() =>
              setAppState({
                ...appState,
                selectedIndexBundle: undefined,
                setupOptions: undefined,
              })
            }
            icon={<XIcon />}
          />
        )}
      </div>
      {setupOptions ? (
        <>
          {setupOptions.type === "MINION" && (
            <div>
              <h1 className="mb-1">Minion Squad Options</h1>
              <div className="bg-mirage-99 dark:bg-mirage-901 my-1 space-y-4 rounded-2xl p-4">
                <div>
                  <Label htmlFor="nameInput" className="mb-1">
                    Individual Stamina
                  </Label>
                  <Input id="nameInput" className="w-60 max-w-full">
                    <FreeWheelInput
                      clearContentOnFocus
                      value={setupOptions.stamina.value.toString()}
                      onUpdate={(target) => {
                        const stamina = parseNumber(target.value, {
                          truncate: true,
                          min: 0,
                          max: 9999,
                          inlineMath: {
                            previousValue: setupOptions.stamina.value,
                          },
                        });
                        setAppState({
                          ...appState,
                          setupOptions: {
                            ...setupOptions,
                            stamina: {
                              ...setupOptions.stamina,
                              value: stamina,
                            },
                          },
                        });
                      }}
                    />
                  </Input>
                </div>
                <div>
                  <Label htmlFor="groupNameInput" className="mb-1">
                    Squad Name
                  </Label>
                  <Input id="groupNameInput" className="w-60 max-w-full">
                    <FreeWheelInput
                      value={setupOptions.groupName.value}
                      onUpdate={(target) => {
                        setAppState({
                          ...appState,
                          setupOptions: {
                            ...setupOptions,
                            groupName: {
                              ...setupOptions.groupName,
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
                    checked={setupOptions.groupName.nameTags}
                    onCheckedChange={(checked) =>
                      setAppState({
                        ...appState,
                        setupOptions: {
                          ...setupOptions,
                          groupName: {
                            ...setupOptions.groupName,
                            nameTags: checked === true,
                          },
                        },
                      })
                    }
                  />
                  <Label className="h-fit" htmlFor="AddNameTagCheckbox">
                    Add Name Tags
                  </Label>
                </div>
              </div>
            </div>
          )}
          <div>
            {setupOptions.type === "BASIC" && (
              <>
                <h1 className="mb-1">Token Options</h1>
                <div className="flex items-center">
                  <Checkbox
                    id="setStaminaCheckbox"
                    checked={setupOptions.stamina.enabled}
                    onCheckedChange={(checked) => {
                      setAppState({
                        ...appState,
                        setupOptions: {
                          ...setupOptions,
                          stamina: {
                            ...setupOptions.stamina,
                            enabled: checked === true,
                          },
                        },
                      });
                    }}
                  />
                  <Label className="h-fit" htmlFor="setStaminaCheckbox">
                    {"Set Stamina"}
                  </Label>
                </div>
                <Collapsible open={setupOptions.stamina.enabled}>
                  <CollapsibleContent>
                    <div className="bg-mirage-99 dark:bg-mirage-901 my-1 ml-10 space-y-4 rounded-2xl p-4">
                      <div>
                        <Label htmlFor="nameInput" className="mb-1">
                          Stamina
                        </Label>
                        <Input id="nameInput" className="w-60 max-w-full">
                          <FreeWheelInput
                            clearContentOnFocus
                            value={setupOptions.stamina.value.toString()}
                            onUpdate={(target) => {
                              const stamina = parseNumber(target.value, {
                                truncate: true,
                                min: 0,
                                max: 9999,
                                inlineMath: {
                                  previousValue: setupOptions.stamina.value,
                                },
                              });
                              setAppState({
                                ...appState,
                                setupOptions: {
                                  ...setupOptions,
                                  stamina: {
                                    ...setupOptions.stamina,
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
                    checked={setupOptions.name.enabled}
                    onCheckedChange={(checked) =>
                      setAppState({
                        ...appState,
                        setupOptions: {
                          ...setupOptions,
                          name: {
                            ...setupOptions.name,
                            enabled: checked === true,
                          },
                        },
                      })
                    }
                  />
                  <Label className="h-fit" htmlFor="setNameCheckbox">
                    {"Set Name"}
                  </Label>
                </div>
                <Collapsible open={setupOptions.name.enabled}>
                  <CollapsibleContent>
                    <div className="bg-mirage-99 dark:bg-mirage-901 my-1 ml-10 space-y-4 rounded-2xl p-4">
                      <div>
                        <Label htmlFor="nameInput" className="mb-1">
                          Name
                        </Label>
                        <Input id="nameInput" className="w-60 max-w-full">
                          <FreeWheelInput
                            value={setupOptions.name.value}
                            onUpdate={(target) => {
                              setAppState({
                                ...appState,
                                setupOptions: {
                                  ...setupOptions,
                                  name: {
                                    ...setupOptions.name,
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
                          checked={setupOptions.name.nameTag}
                          onCheckedChange={(checked) =>
                            setAppState({
                              ...appState,
                              setupOptions: {
                                ...setupOptions,
                                name: {
                                  ...setupOptions.name,
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
              </>
            )}
          </div>
        </>
      ) : (
        <div className="text-foreground/20">Loading...</div>
      )}
    </div>
  );
}
