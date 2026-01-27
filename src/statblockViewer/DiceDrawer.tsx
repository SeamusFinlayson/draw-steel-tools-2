import getResetRollAttributes, {
  powerRoll,
} from "../action/diceRoller/helpers.ts";
import { useDiceRoller } from "../helpers/useDiceRoller.ts";
import * as DiceProtocol from "../diceProtocol.ts";
import { defaultSettings } from "../helpers/settingsHelpers.ts";
import type { Roll } from "../types/diceRollerTypes.ts";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  RollAttributesContext,
  SetRollAttributesContext,
} from "./context/RollAttributesContext.ts";
import { CheckIcon, ChevronUpIcon, PlugZap, XIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
} from "../components/ui/collapsible.tsx";
import DiceRoller from "../action/diceRoller/DiceRoller.tsx";
import {
  DiceDrawerContext,
  SetDiceDrawerContext,
  type DiceDrawer,
} from "./context/DiceDrawerContext.ts";
import Button from "../components/ui/Button.tsx";
import Label from "../components/ui/Label.tsx";
import ConnectedDiceIcon from "../components/icons/ConnectedDiceIcon.tsx";
import { RoomSettingsContext } from "./context/RoomSettingsContext.ts";

export function DiceDrawer() {
  const diceDrawer = useContext(DiceDrawerContext);
  const setDiceDrawer = useContext(SetDiceDrawerContext);
  const rollAttributes = useContext(RollAttributesContext);
  const setRollAttributes = useContext(SetRollAttributesContext);

  const settingsMetadata = useContext(RoomSettingsContext);
  const definedSettings = useMemo(
    () => ({ ...defaultSettings, ...settingsMetadata }),
    [settingsMetadata],
  );

  const [diceResultViewerOpen, setDiceResultViewerOpen] = useState(false);

  // External dice roller
  const handleRollResult = useCallback(
    (data: DiceProtocol.PowerRollResult) => {
      const rolls = data.result.map((val) => val.result);
      for (let i = 0; i < rolls.length; i++) {
        if (rolls[i] === 0) rolls[i] = 10;
      }

      setDiceDrawer((prev) => ({
        ...prev,
        rollStatus: "DONE",
        result: powerRoll({
          bonus: data.rollProperties.bonus,
          hasSkill: data.rollProperties.hasSkill,
          netEdges: data.rollProperties.netEdges,
          rollMethod: "givenValues",
          dieValues: rolls,
          selectionStrategy:
            data.rollProperties.dice === "3d10kl2" ? "lowest" : "highest",
        }),
      }));
      setRollAttributes({
        ...getResetRollAttributes(rollAttributes, definedSettings),
        style: rollAttributes.style,
      });
    },
    [rollAttributes, rollAttributes, definedSettings],
  );
  const diceRoller = useDiceRoller({
    onRollResult: handleRollResult,
    channel: "statblockViewer",
  });

  const [noDiceRollersFound, setNoDiceRollersFound] = useState(true);
  useEffect(() => {
    if (diceRoller.config) setNoDiceRollersFound(false);
  }, [diceRoller]);

  return (
    <div className="bg-mirage-50 border-mirage-300 z-50 rounded-t-2xl">
      <button
        className="bg-accent flex w-full items-center justify-between gap-2 rounded-t-2xl px-4 py-2 font-bold text-white duration-200"
        onClick={() =>
          setDiceDrawer((prev) => ({ ...prev, open: !diceDrawer.open }))
        }
      >
        <div>Dice Roller</div>
        <ChevronUpIcon
          data-open={diceDrawer.open}
          className="transition-transform duration-300 ease-out data-[open=true]:-rotate-180"
        />
      </button>
      <Collapsible open={diceDrawer.open}>
        <CollapsibleContent>
          {/*<div className="border-mirage-300" />*/}
          <div className="grid grid-cols-2 gap-x-4 px-4 pt-3">
            <div>
              <Label variant="small" htmlFor="bonusInput">
                Ability
              </Label>
              {!diceDrawer.rollTargetId ? (
                <Button
                  className="inert pointer-events-none flex h-[36px] w-full items-center justify-between px-2 pl-4"
                  variant={"secondary"}
                >
                  <div className="overflow-clip">None</div>
                </Button>
              ) : (
                <Button
                  className="flex h-[36px] w-full items-center justify-between px-2 pl-4"
                  variant={"secondary"}
                  title={diceDrawer.rollTargetName}
                  onClick={() =>
                    setDiceDrawer(
                      (prev) =>
                        ({
                          ...prev,
                          rollTargetId: undefined,
                          rollTargetName: undefined,
                        }) satisfies DiceDrawer,
                    )
                  }
                >
                  <div className="max-w-[calc(100%-32px)] overflow-clip text-clip">
                    {diceDrawer.rollTargetName}
                  </div>
                  <XIcon className="shrink-0" />
                </Button>
              )}
            </div>
            <div>
              <Label variant="small" htmlFor="bonusInput">
                Dice Roller
              </Label>
              {noDiceRollersFound ? (
                <div className="flex gap-2">
                  <div className="bg-mirage-100 flex h-9 grow items-center rounded-full pl-4">
                    Internal
                  </div>
                  <Button
                    asChild
                    className="size-9"
                    variant={"secondary"}
                    size={"icon"}
                  >
                    <a
                      href="https://seamus-finlayson.ca/pages/connected-dice"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ConnectedDiceIcon className="stroke-black dark:stroke-white" />
                    </a>
                  </Button>
                </div>
              ) : diceRoller.config === undefined ? (
                <Button
                  className="flex h-[36px] w-full items-center justify-between px-2 pl-4"
                  variant={"secondary"}
                  onClick={() => {
                    diceRoller.connect();
                  }}
                >
                  <div className="max-w-[calc(100%-32px)] overflow-clip text-clip">
                    Connect
                  </div>
                  <PlugZap />
                </Button>
              ) : (
                <Button
                  className="flex h-[36px] w-full items-center justify-between px-2 pl-4"
                  variant={"secondary"}
                  onClick={() => {
                    diceRoller.disconnect();
                    setRollAttributes((prev) => ({
                      ...prev,
                      style: undefined,
                    }));
                  }}
                >
                  <div className="max-w-[calc(100%-32px)] overflow-clip text-clip">
                    Connected
                  </div>
                  <CheckIcon />
                </Button>
              )}
            </div>
          </div>
          <div className="bg-mirage-50 dark:bg-mirage-950 px-4 py-3">
            <DiceRoller
              autoOpenResultView={diceDrawer.rollTargetId === undefined}
              diceResultViewerOpen={diceResultViewerOpen}
              setDiceResultViewerOpen={setDiceResultViewerOpen}
              result={diceDrawer.result}
              setResult={(result: Roll | undefined) =>
                setDiceDrawer((prev) => ({
                  ...prev,
                  result,
                  rollStatus: result ? "DONE" : "PENDING",
                }))
              }
              rollAttributes={rollAttributes}
              setRollAttributes={setRollAttributes}
              diceRoller={diceRoller}
              settings={definedSettings}
              onRollClicked={() =>
                setDiceDrawer((prev) => ({
                  ...prev,
                  open: prev.rollTargetId ? false : true,
                  resultTargetId: prev.rollTargetId,
                }))
              }
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
