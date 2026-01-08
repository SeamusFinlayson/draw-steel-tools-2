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
} from "lucide-react";
import { Effect } from "./Effect";
import type { DrawSteelFeature } from "../../types/DrawSteelZod";
import { useContext } from "react";
import { SetRollAttributesContext } from "../context/RollAttributesContext";
import { PluginReadyGate } from "../context/PluginReadyGate";

export function Feature({ feature: feature }: { feature: DrawSteelFeature }) {
  const setRollAttributes = useContext(SetRollAttributesContext);

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
          <div className="flex justify-between">
            <div className="flex gap-1">
              <div className="font-black">{feature.name}</div>
              <PluginReadyGate alternate={<div>{roll}</div>}>
                {roll && (
                  <button
                    className="hover:bg-mirage-200 bg-mirage-100 rounded-full px-2 duration-200"
                    onClick={() =>
                      setRollAttributes((prev) => ({
                        ...prev,
                        bonus: parseFloat(rollBonus),
                      }))
                    }
                  >
                    {roll}
                  </button>
                )}
              </PluginReadyGate>
            </div>
            {feature.cost && <div className="font-black">{feature.cost}</div>}
            {feature.ability_type && (
              <div className="font-black">{feature.ability_type}</div>
            )}
          </div>
          <div className="flex justify-between">
            <div>{feature.keywords?.join(", ")}</div>
            <div>{feature.usage}</div>
          </div>
          {(feature.distance || feature.target) && (
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <Ruler className="size-4" />
                <div>{feature.distance}</div>
              </div>
              <span className="flex items-center gap-1">
                <Icon iconNode={targetArrow} className="size-4" />
                <span>{feature.target}</span>
              </span>
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
              <Effect key={index} effect={effect} />
            ))}
          </div>
        )}
        {feature.flavor && <div className="italic">{feature.flavor}</div>}
      </div>
    </div>
  );
}
