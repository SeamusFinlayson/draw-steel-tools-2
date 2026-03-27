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
  Trash2Icon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "lucide-react";
import { Effect } from "./Effect";
import type { DrawSteelFeature } from "../../types/DrawSteelZod";
import { Input } from "./Input";
import FreeWheelInput from "../../components/logic/FreeWheelInput";
import Button from "../../components/ui/Button";
import { useState } from "react";
import Toggle from "../../components/ui/Toggle";

export function Feature({
  feature: feature,
}: {
  blockName: string;
  feature: DrawSteelFeature;
}) {
  const [organizeMode, setOrganizeMode] = useState(false);

  return (
    <div className="flex gap-1">
      <Button variant={"primary"} size={"icon"}>
        {(() => {
          if (feature.icon === "☠️") return <SkullIcon />;
          if (feature.icon === "❗️") return <AlertCircleIcon />;
          if (feature.icon === "🔳") return <Grid3X3Icon />;
          if (feature.icon === "🗡") return <SwordIcon />;
          if (feature.icon === "🏹") return <BowArrowIcon />;
          if (feature.icon === "⭐️") return <StarIcon />;
          return <UserIcon />;
        })()}
      </Button>
      <div className="w-full">
        <div className="w-full space-y-4">
          <div className="space-y-1">
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <Input>
                <FreeWheelInput
                  className="grow font-black"
                  placeholder="Name"
                  value={feature.name}
                  onUpdate={() => {}}
                />
              </Input>
              <Input>
                <FreeWheelInput
                  placeholder="Type or Cost"
                  value={
                    (feature.cost ? feature.cost : "") +
                    (feature.ability_type ? feature.ability_type : "")
                  }
                  onUpdate={() => {}}
                />
              </Input>
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <Input>
                <FreeWheelInput
                  className="grow"
                  placeholder="Keywords"
                  value={feature.keywords ? feature.keywords.join(", ") : ""}
                  onUpdate={() => {}}
                />
              </Input>
              <Input>
                <FreeWheelInput
                  placeholder="Usage"
                  value={feature.usage ? feature.usage : ""}
                  onUpdate={() => {}}
                />
              </Input>
            </div>

            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <div className="flex grow items-center gap-1">
                <Ruler className="size-4" />
                <Input>
                  <FreeWheelInput
                    className="grow"
                    placeholder="Range"
                    value={feature.distance ? feature.distance : ""}
                    onUpdate={() => {}}
                  />
                </Input>
              </div>
              <div className="flex items-center gap-1">
                <Icon iconNode={targetArrow} className="size-4 shrink-0" />
                <Input>
                  <FreeWheelInput
                    placeholder="Target"
                    value={feature.target ? feature.target : ""}
                    onUpdate={() => {}}
                  />
                </Input>
              </div>
            </div>
          </div>
          {feature.usage && feature.usage.search(/[t|T]rig/g) !== -1 && (
            <div className="flex items-center gap-1">
              <div className="font-semibold">{"Trigger"}</div>
              <Input>
                <FreeWheelInput
                  className="grow"
                  placeholder="Target"
                  value={feature.trigger ? feature.trigger : ""}
                  onUpdate={() => {}}
                />
              </Input>
            </div>
          )}
          {feature.effects.length > 0 && (
            <div className="space-y-4">
              {feature.effects.map((effect, index) => (
                <div key={index} className="grid">
                  <div inert={organizeMode} className="col-start-1 row-start-1">
                    <Effect effect={effect} />
                  </div>
                  {organizeMode && (
                    <div className="bg-accent/50 border-accent z-50 col-start-1 row-start-1 flex items-end justify-end place-self-stretch rounded-md border p-1">
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 gap-0.5">
                          <Button
                            size={"sm"}
                            variant={"secondary"}
                            disabled={index === 0}
                            className={"self-start"}
                          >
                            <ArrowUpIcon />
                          </Button>
                          <Button
                            size={"sm"}
                            variant={"secondary"}
                            disabled={index >= feature.effects.length - 1}
                            className="self-end"
                          >
                            <ArrowDownIcon />
                          </Button>
                        </div>
                        <Button size={"icon"} variant={"secondary"}>
                          <Trash2Icon />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap justify-between gap-1">
            <div className="flex flex-wrap gap-1">
              <Button variant={"secondary"} size={"sm"}>
                Add Text
              </Button>
              <Button variant={"secondary"} size={"sm"}>
                Add Roll
              </Button>
            </div>
            <Toggle
              className="w-fit"
              variant={"default"}
              size={"sm"}
              onClick={() => setOrganizeMode(!organizeMode)}
            >
              Organize
            </Toggle>
          </div>
          {feature.flavor && <div className="italic">{feature.flavor}</div>}
        </div>
      </div>
    </div>
  );
}
