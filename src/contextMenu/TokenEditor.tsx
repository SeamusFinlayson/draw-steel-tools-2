import { useEffect, useState } from "react";
import {
  CharacterTokenDataZod,
  DefinedCharacterTokenDataZod,
  type DefinedCharacterTokenData,
} from "../types/tokenDataZod";
import OBR, { type Item } from "@owlbear-rodeo/sdk";
import { getSelectedItems } from "../helpers/getSelectedItem";
import { parseTokenData, TOKEN_METADATA_KEY } from "../helpers/tokenHelpers";
import parseNumber from "../helpers/parseNumber";
import BarTrackerInput from "./trackerInputs/BarTrackerInput";
import ValueButtonTrackerInput from "./trackerInputs/ValueButtonTrackerInput";
import {
  BookLockIcon,
  BookOpenIcon,
  HeartCrackIcon,
  HeartPulseIcon,
  Sparkles,
  XIcon,
} from "lucide-react";
import CounterTracker from "./trackerInputs/CounterTrackerInput";
import { cn } from "../helpers/utils";
import Toggle from "../components/ui/Toggle";
import { useRoomMetadata } from "../helpers/useRoomMetadata";
import {
  defaultSettings,
  SETTINGS_METADATA_KEY,
} from "../helpers/settingsHelpers";
import { SettingsZod } from "../types/settingsZod";
import usePlayerRole from "../helpers/usePlayerRole";
import { Label } from "./trackerInputs/Label";
import InputBackground from "./trackerInputs/InputBackground";
import { getPluginId } from "../helpers/getPluginId";

export default function TokenEditor() {
  const [token, setToken] = useState<
    DefinedCharacterTokenData & { item: Item }
  >();

  const playerRole = usePlayerRole();

  useEffect(() => {
    const handleItems = (items: Item[]) => {
      if (items.length !== 1) throw new Error("Too many items selected.");
      const item = items[0];
      const characterData = parseTokenData(item.metadata);
      setToken({ ...characterData, item });
    };
    getSelectedItems().then(handleItems);
    return OBR.scene.items.onChange((items) => {
      getSelectedItems({ items }).then(handleItems);
    });
  }, []);

  const settingsMetadata = useRoomMetadata(
    SETTINGS_METADATA_KEY,
    SettingsZod.parse,
  );

  if (token === undefined || !settingsMetadata.ready) return <></>;

  const definedSettings = { ...defaultSettings, ...settingsMetadata.value };

  const updateToken = (
    characterTokenData: Partial<DefinedCharacterTokenData>,
  ) => {
    setToken({
      ...DefinedCharacterTokenDataZod.parse({
        ...token,
        ...characterTokenData,
      }),
      item: token.item,
    });
    OBR.scene.items.updateItems(
      (item) => item.id === token.item.id,
      (items) => {
        if (items.length !== 1) throw new Error("Too many items selected.");
        if (characterTokenData.name && characterTokenData.name.length > 0) {
          items[0].name = characterTokenData.name;
        }
        const existingDataValidation = CharacterTokenDataZod.safeParse(
          items[0].metadata[TOKEN_METADATA_KEY],
        );
        items[0].metadata[TOKEN_METADATA_KEY] = CharacterTokenDataZod.parse({
          ...(existingDataValidation.success
            ? existingDataValidation.data
            : undefined),
          ...characterTokenData,
        });
      },
    );
  };

  const NameInput = (
    <ValueButtonTrackerInput
      label="Name"
      parentValue={token.name}
      updateHandler={(target) => updateToken({ name: target.value })}
      inputProps={{
        className: "text-start pl-2",
        placeholder: token.item.name,
        clearContentsOnFocus: false,
      }}
      buttonProps={
        token.name.length === 0
          ? {
              children: <Sparkles />,
              onClick: () => updateToken({ name: token.item.name.trim() }),
            }
          : { children: <XIcon />, onClick: () => updateToken({ name: "" }) }
      }
    />
  );

  const StatEditor = (
    <div className="grid grid-cols-2 gap-2">
      <div className={cn({ "col-span-2": token.type === "HERO" })}>
        <BarTrackerInput
          label={"Stamina"}
          labelTitle={`Winded Value: ${Math.trunc(token.staminaMaximum / 2)}`}
          color="RED"
          parentValue={token.stamina.toString()}
          parentMax={token.staminaMaximum.toString()}
          valueUpdateHandler={(target) =>
            updateToken({
              stamina: parseNumber(target.value, {
                min: -9999,
                max: 9999,
                truncate: true,
                inlineMath: { previousValue: token.stamina },
              }),
            })
          }
          maxUpdateHandler={(target) =>
            updateToken({
              staminaMaximum: parseNumber(target.value, {
                min: -9999,
                max: 9999,
                truncate: true,
                inlineMath: { previousValue: token.staminaMaximum },
              }),
            })
          }
        />
      </div>

      <ValueButtonTrackerInput
        label={"Temporary Stamina"}
        color="GREEN"
        parentValue={token.temporaryStamina}
        updateHandler={(target) =>
          updateToken({
            temporaryStamina: parseNumber(target.value, {
              min: -999,
              max: 999,
              truncate: true,
              inlineMath: { previousValue: token.temporaryStamina },
            }),
          })
        }
        buttonProps={{
          title: "Apply to Stamina",
          children: <HeartCrackIcon />,
          className: token.temporaryStamina < 0 ? "" : "hidden",
          onClick: () => {
            if (token.temporaryStamina >= 0) return;
            updateToken({
              stamina: token.stamina + token.temporaryStamina,
              temporaryStamina: 0,
            });
          },
        }}
      />
      {token.type === "HERO" && (
        <>
          <CounterTracker
            label={"Heroic Resource"}
            color="BLUE"
            parentValue={token.heroicResource}
            updateHandler={(target) =>
              updateToken({
                heroicResource: parseNumber(target.value, {
                  min: -999,
                  max: 999,
                  truncate: true,
                  inlineMath: { previousValue: token.heroicResource },
                }),
              })
            }
            incrementHandler={() => {
              if (token.heroicResource >= 999) return;
              updateToken({
                heroicResource: token.heroicResource + 1,
              });
            }}
            decrementHandler={() => {
              if (token.heroicResource <= -999) return;
              updateToken({
                heroicResource: token.heroicResource - 1,
              });
            }}
          />
          <CounterTracker
            label={"Surges"}
            color="GOLD"
            parentValue={token.surges}
            updateHandler={(target) =>
              updateToken({
                surges: parseNumber(target.value, {
                  min: -999,
                  max: 999,
                  truncate: true,
                  inlineMath: { previousValue: token.surges },
                }),
              })
            }
            incrementHandler={() => {
              if (token.surges >= 999) return;
              updateToken({ surges: token.surges + 1 });
            }}
            decrementHandler={() => {
              if (token.surges <= -999) return;
              updateToken({ surges: token.surges - 1 });
            }}
          />
          <ValueButtonTrackerInput
            label={"Recoveries"}
            labelTitle={`Recovery Value: ${Math.trunc(token.staminaMaximum / 3)}`}
            parentValue={token.recoveries}
            updateHandler={(target) =>
              updateToken({
                recoveries: parseNumber(target.value, {
                  min: -999,
                  max: 999,
                  truncate: true,
                  inlineMath: { previousValue: token.recoveries },
                }),
              })
            }
            buttonProps={{
              title: "Spend Recovery",
              children: <HeartPulseIcon />,
              onClick: () => {
                if (token.recoveries <= 0) return;
                if (token.staminaMaximum <= 0) return;
                if (token.stamina >= token.staminaMaximum) return;
                const staminaIncrease = Math.trunc(token.staminaMaximum / 3);
                const newStamina = token.stamina + staminaIncrease;
                updateToken({
                  stamina:
                    newStamina < token.staminaMaximum
                      ? newStamina
                      : token.staminaMaximum,
                  recoveries: token.recoveries - 1,
                });
              },
            }}
          />
        </>
      )}
      {token.type === "MONSTER" && (
        <div className="text-foreground col-span-2 w-full">
          <Label name="Statblock" />
          {token.statblockName !== "" ? (
            <div className="flex w-full items-center gap-1">
              <InputBackground
                color="DEFAULT"
                className="flex grow overflow-clip"
              >
                <button className="hover:bg-foreground/7 focus-visible:bg-foreground/7 w-full">
                  <div className="flex h-9 items-center-safe justify-center text-sm">
                    {token.statblockName}
                  </div>
                </button>
              </InputBackground>
              <InputBackground color="DEFAULT" className="overflow-clip">
                <button
                  className="hover:bg-foreground/7 focus-visible:bg-foreground/7 flex w-9 shrink-0 items-center justify-center gap-2"
                  onClick={() => updateToken({ statblockName: "" })}
                >
                  <XIcon />
                </button>
              </InputBackground>
            </div>
          ) : (
            <InputBackground color="DEFAULT" className="overflow-clip">
              <button
                className="hover:bg-foreground/7 focus-visible:bg-foreground/7 grow"
                onClick={async () => {
                  const themeMode = (await OBR.theme.getTheme()).mode;
                  OBR.popover.open({
                    id: getPluginId("statblockSearch"),
                    url: `/statblockSearch?themeMode=${themeMode}`,
                    height: 1000,
                    width: 800,
                    anchorOrigin: { horizontal: "CENTER", vertical: "CENTER" },
                    transformOrigin: {
                      horizontal: "CENTER",
                      vertical: "CENTER",
                    },
                  });
                }}
              >
                <div className="h-9 items-center p-2 text-sm">
                  Add Statblock
                </div>
              </button>
            </InputBackground>
          )}
        </div>
      )}
    </div>
  );

  const VisibilityToggle = (
    <div className="flex w-full justify-center">
      <Toggle
        variant="ghost"
        className="w-full gap-x-2 bg-none font-normal data-[state=pressed]:bg-none"
        pressed={token.gmOnly}
        onClick={() => updateToken({ gmOnly: !token.gmOnly })}
      >
        <span>
          {token.gmOnly ? (
            <BookLockIcon className="size-5.5" />
          ) : (
            <BookOpenIcon className="size-5.5" />
          )}
        </span>
        <span>{token.gmOnly ? "Director Only" : "Shared"}</span>
      </Toggle>
    </div>
  );

  return (
    <div className="text-foreground space-y-2 p-2">
      {definedSettings.nameTagsEnabled && NameInput}
      {StatEditor}
      {playerRole === "GM" && VisibilityToggle}
    </div>
  );
}
