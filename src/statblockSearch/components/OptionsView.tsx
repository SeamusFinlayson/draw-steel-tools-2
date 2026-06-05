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
import Button from "../../components/ui/Button";
import OBR, { isImage } from "@owlbear-rodeo/sdk";
import z from "zod";
import { generateGroupId } from "../../helpers/generateGroupId";
import { getPluginId } from "../../helpers/getPluginId";
import { getSelectedItems } from "../../helpers/getSelectedItem";
import { MONSTER_GROUPS_METADATA_KEY } from "../../helpers/monsterGroupHelpers";
import { TOKEN_METADATA_KEY } from "../../helpers/tokenHelpers";
import { MinionGroupZod, type MinionGroup } from "../../types/minionGroup";
import {
  type MinionTokenData,
  TerrainTokenDataZod,
  type TerrainTokenData,
  MonsterTokenDataZod,
  type MonsterTokenData,
  MinionTokenDataZod,
} from "../../types/tokenDataZod";

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
  const setupOptions = appState.setupOptions;
  const selectedIndexBundle = appState.selectedIndexBundle;

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
      <div className="grow space-y-6 p-4 sm:p-6">
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
              <div>
                <h1 className="mb-1">Minion Squad Options</h1>
                <div className="bg-mirage-99 dark:bg-mirage-901 my-1 space-y-4 rounded-2xl p-4">
                  <div>
                    <Label htmlFor="nameInput" className="mb-2">
                      Individual Stamina
                    </Label>
                    <Input id="nameInput" className="w-60 max-w-full">
                      <FreeWheelInput
                        clearContentOnFocus
                        value={setupOptions.stamina.value.toString()}
                        onUpdate={(target) => {
                          const stamina = parseNumber(target.value, {
                            truncate: true,
                            min: 1,
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
                    <Label htmlFor="groupNameInput" className="mb-2">
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
            {(setupOptions.type === "BASIC" ||
              setupOptions.type === "TERRAIN") && (
              <div>
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
                        <Label htmlFor="nameInput" className="mb-2">
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
                        <Label htmlFor="nameInput" className="mb-2">
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
              </div>
            )}
          </>
        ) : (
          <div className="text-foreground/20">Loading...</div>
        )}
      </div>

      <footer className="w-full">
        <div className="border-mirage-300 dark:border-mirage-700 flex gap-4 border-t px-4 py-2 sm:px-6 sm:py-3">
          {!appState.setupOptions ? (
            <></>
          ) : (
            <>
              <Button
                variant={"accentOutline"}
                className="grow"
                onClick={returnToSearch}
              >
                Back
              </Button>
              <Button
                className="grow"
                onClick={async () => {
                  const tokenOptions = appState.setupOptions;
                  if (!tokenOptions) throw new Error("Invalid token options");
                  const selectedItems = await getSelectedItems();

                  if (tokenOptions.type === "TERRAIN") {
                    let targetItems = selectedItems;
                    if (groupId !== null) {
                      targetItems = await OBR.scene.items.getItems(
                        (item) =>
                          isImage(item) &&
                          (
                            item.metadata?.[
                              TOKEN_METADATA_KEY
                            ] as MinionTokenData
                          )?.groupId === groupId,
                      );
                    }
                    const nameOptions = tokenOptions.name;
                    const staminaOptions = tokenOptions.stamina;
                    OBR.scene.items.updateItems(
                      targetItems.map((item) => item.id),
                      (items) => {
                        items.forEach((item) => {
                          const existingDataValidation =
                            TerrainTokenDataZod.safeParse(
                              items[0].metadata[TOKEN_METADATA_KEY],
                            );
                          item.metadata[TOKEN_METADATA_KEY] =
                            TerrainTokenDataZod.parse({
                              ...(existingDataValidation.success
                                ? existingDataValidation.data
                                : undefined),
                              type: "TERRAIN",
                              gmOnly: playerRole === "GM" ? true : false,
                              ...(nameOptions.enabled && nameOptions.nameTag
                                ? { name: nameOptions.value }
                                : {}),
                              ...(staminaOptions.enabled
                                ? {
                                    stamina: staminaOptions.value,
                                    staminaMaximum: staminaOptions.value,
                                  }
                                : {}),
                              ...(typeof appState.selectedIndexBundle ===
                              "object"
                                ? {
                                    statblockName:
                                      appState.selectedIndexBundle.name,
                                    resourceId: appState.selectedIndexBundle.id,
                                  }
                                : {}),
                            } satisfies TerrainTokenData);
                          if (nameOptions.enabled) {
                            item.name = nameOptions.value;
                          }
                        });
                      },
                    );
                  } else if (tokenOptions.type === "BASIC") {
                    let targetItems = selectedItems;
                    if (groupId !== null) {
                      targetItems = await OBR.scene.items.getItems(
                        (item) =>
                          isImage(item) &&
                          (
                            item.metadata?.[
                              TOKEN_METADATA_KEY
                            ] as MinionTokenData
                          )?.groupId === groupId,
                      );
                    }
                    const nameOptions = tokenOptions.name;
                    const staminaOptions = tokenOptions.stamina;
                    OBR.scene.items.updateItems(
                      targetItems.map((item) => item.id),
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
                              gmOnly: playerRole === "GM" ? true : false,
                              ...(nameOptions.enabled && nameOptions.nameTag
                                ? { name: nameOptions.value }
                                : {}),
                              ...(staminaOptions.enabled
                                ? {
                                    stamina: staminaOptions.value,
                                    staminaMaximum: staminaOptions.value,
                                  }
                                : {}),
                              ...(typeof appState.selectedIndexBundle ===
                              "object"
                                ? {
                                    statblockName:
                                      appState.selectedIndexBundle.name,
                                    resourceId: appState.selectedIndexBundle.id,
                                  }
                                : {}),
                            } satisfies MonsterTokenData);
                          if (nameOptions.enabled) {
                            item.name = nameOptions.value;
                          }
                        });
                      },
                    );
                  } else if (tokenOptions.type === "MINION") {
                    let groupSize: number | null = null;
                    if (groupId === "" || groupId === null) {
                      groupId = generateGroupId();
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
                          ...(minionGroups.success
                            ? minionGroups.data.filter(
                                (value) => value.id !== groupId,
                              )
                            : []),
                          {
                            type: "MINION",
                            id: groupId,
                            individualStamina: tokenOptions.stamina.value,
                            name: tokenOptions.groupName.value,
                            ...(typeof appState.selectedIndexBundle === "object"
                              ? {
                                  statblock: appState.selectedIndexBundle.name,
                                  resourceId: appState.selectedIndexBundle.id,
                                }
                              : {}),
                            currentStamina:
                              tokenOptions.stamina.value * groupSize,
                            nameTagsEnabled: tokenOptions.groupName.nameTags,
                            gmOnly: playerRole === "GM" ? true : false,
                          },
                        ] satisfies MinionGroup[]),
                    });
                  }
                  OBR.popover.close(getPluginId("statblockSearch"));
                }}
              >
                Confirm
              </Button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
