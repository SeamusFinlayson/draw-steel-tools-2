import {
  Dice3Icon,
  EllipsisVerticalIcon,
  FileUserIcon,
  HeartCrackIcon,
  HeartPulseIcon,
  LinkIcon,
  Settings2Icon,
} from "lucide-react";
import parseNumber from "../../helpers/parseNumber";
import { cn } from "../../helpers/utils";
import type { Token } from "../../types/contextMenuToken";
import type { DefinedCharacterTokenData } from "../../types/tokenDataZod";
import BarTrackerInput from "../trackerInputs/BarTrackerInput";
import CounterTracker from "../trackerInputs/CounterTrackerInput";
import ValueButtonTrackerInput from "../trackerInputs/ValueButtonTrackerInput";
import { useDiceRoller } from "../../helpers/useDiceRoller";
import Button from "../../components/ui/Button";
import { ROLL_RESULT_CHANNEL } from "../../diceProtocol";

export default function StatEditor({
  token,
  updateToken,
}: {
  token: Token;
  updateToken: (characterTokenData: Partial<DefinedCharacterTokenData>) => void;
}) {
  const diceRoller = useDiceRoller({
    onRollResult: (data) => {
      console.log(data);
    },
    channel: "tokenEditor",
  });

  if (token.type !== "HERO" && token.type !== "MONSTER")
    throw new Error("Expected hero or monster token type");

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className={cn({ "col-span-2": token.type === "HERO" })}>
        <div className="flex items-end gap-2">
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
          <div className="">
            <div className="flex max-w-[116px] gap-2">
              {token.type === "HERO" && false && (
                <Button
                  variant={"secondary"}
                  size={"base"}
                  className="bg-mirage-400/30 dark:bg-mirage-500/30 hover:bg-mirage-400/30 hover:dark:bg-mirage-500/30 shrink px-2"
                  onClick={
                    !diceRoller.config
                      ? () => {}
                      : () =>
                          diceRoller.requestRoll({
                            dice: [
                              {
                                id: `drawSteelTools-${Date.now()}`,
                                type: "D3",
                              },
                            ],
                            id: `drawSteelTools-${Date.now()}`,
                            gmOnly: false,
                          })
                  }
                >
                  <FileUserIcon />
                </Button>
              )}
              {token.type === "HERO" && (
                <div>
                  <Button
                    variant={"secondary"}
                    size={"base"}
                    className="bg-mirage-400/30 dark:bg-mirage-500/30 hover:bg-mirage-400/30 hover:dark:bg-mirage-500/30 shrink px-2"
                    onClick={
                      !diceRoller.config
                        ? () => {}
                        : () =>
                            diceRoller.requestRoll({
                              dice: [
                                {
                                  id: `drawSteelTools-${Date.now()}`,
                                  type: "D3",
                                },
                              ],
                              id: `drawSteelTools-${Date.now()}`,
                              gmOnly: false,
                            })
                    }
                  >
                    <EllipsisVerticalIcon />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
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
    </div>
  );
}
