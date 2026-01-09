import { targetArrow } from "@lucide/lab";
import {
  SkullIcon,
  AlertCircleIcon,
  SwordIcon,
  BowArrowIcon,
  UserIcon,
  Ruler,
  Icon,
  StarIcon,
  Grid3X3Icon,
  LoaderCircleIcon,
} from "lucide-react";
import { Effect } from "./Effect";
import type { DrawSteelFeature } from "../../types/DrawSteelZod";
import { useContext } from "react";
import { SetRollAttributesContext } from "../context/RollAttributesContext";
import { PluginReadyGate } from "../context/PluginReadyGate";
import {
  DiceDrawerContext,
  SetDiceDrawerContext,
} from "../context/DiceDrawerContext";
import Button from "../../components/ui/Button";
import { DiceRollResultViewer } from "../../action/diceRoller/DiceRollResultViewer";
import {
  Collapsible,
  CollapsibleContent,
} from "../../components/ui/collapsible";

export function Feature({ feature: feature }: { feature: DrawSteelFeature }) {
  const setRollAttributes = useContext(SetRollAttributesContext);
  const diceDrawer = useContext(DiceDrawerContext);
  const setDiceDrawer = useContext(SetDiceDrawerContext);

  const isRollTarget = diceDrawer.target === feature.name;
  const highlightTier =
    isRollTarget && diceDrawer.result && diceDrawer.rollStatus !== "IDLE"
      ? diceDrawer.result.tier
      : undefined;

  let roll: string | undefined = undefined;
  let rollBonus: string = "";
  feature.effects.forEach((val) => {
    if ("roll" in val && val.roll) {
      roll = val.roll.replace("Power Roll", "2d10");
      rollBonus = val.roll.replace("Power Roll", "").replace(/\s/g, "");
    }
  });

  return (
    <div className="flex gap-1">
      <div className="flex size-[20px] items-center justify-center">
        {(() => {
          if (feature.icon === "☠️") return <SkullIcon />;
          if (feature.icon === "❗️") return <AlertCircleIcon />;
          if (feature.icon === "🔳") return <Grid3X3Icon />;
          if (feature.icon === "🗡") return <SwordIcon />;
          if (feature.icon === "🏹") return <BowArrowIcon />;
          if (feature.icon === "⭐️") return <StarIcon />;
          return <UserIcon />;
        })()}
      </div>
      <div className="w-full space-y-2">
        <div>
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-wrap gap-1">
              <div className="font-black">{feature.name}</div>
              <PluginReadyGate alternate={<div>{roll}</div>}>
                {roll && (
                  <Button
                    variant={"secondary"}
                    size={"xs"}
                    className="-my-0.5 px-3 font-normal text-nowrap"
                    onClick={() => {
                      setRollAttributes((prev) => ({
                        ...prev,
                        bonus: parseFloat(rollBonus),
                      }));
                      setDiceDrawer((prev) => ({
                        ...prev,
                        open: true,
                        rollStatus: "IDLE",
                        target: feature.name,
                      }));
                    }}
                  >
                    {roll}
                  </Button>
                )}
              </PluginReadyGate>
            </div>
            {feature.cost && <div className="font-black">{feature.cost}</div>}
            {feature.ability_type && (
              <div className="font-black">{feature.ability_type}</div>
            )}
          </div>
          <div className="flex flex-wrap justify-between">
            <div>{feature.keywords?.join(", ")}</div>
            <div>{feature.usage}</div>
          </div>
          {(feature.distance || feature.target) && (
            <div className="flex flex-wrap justify-between">
              <div className="flex items-center gap-1">
                <Ruler className="size-4" />
                <div>{feature.distance}</div>
              </div>
              <div className="flex items-center gap-1">
                <Icon iconNode={targetArrow} className="size-4 shrink-0" />
                <div>{feature.target}</div>
              </div>
            </div>
          )}
        </div>
        {feature.trigger && (
          <div>
            <span className="font-semibold">{"Trigger: "}</span>
            {feature.trigger}
          </div>
        )}
        {feature.effects.length > 0 && (
          <div className="space-y-2">
            {feature.effects.map((effect, index) => (
              <Effect
                key={index}
                effect={effect}
                highlightTier={index < 2 ? highlightTier : undefined}
              />
            ))}
          </div>
        )}
        {feature.flavor && <div className="italic">{feature.flavor}</div>}
        <Collapsible open={isRollTarget && diceDrawer.rollStatus !== "IDLE"}>
          <CollapsibleContent>
            <div className="border-mirage-300 rounded-2xl border px-4 py-2">
              {diceDrawer.result === undefined ? (
                <div className="flex w-full items-center justify-center gap-4">
                  <LoaderCircleIcon className="animate-spin opacity-40" />
                  <div>Rolling Dice</div>
                </div>
              ) : (
                <DiceRollResultViewer result={diceDrawer.result} />
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
