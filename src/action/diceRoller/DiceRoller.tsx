import { useCallback, useState } from "react";
import {
  EllipsisVerticalIcon,
  HistoryIcon,
  LoaderCircleIcon,
  MinusIcon,
  PlusIcon,
  SwatchBookIcon,
  XIcon,
} from "lucide-react";
import Button from "../../components/ui/Button";
import FreeWheelInput from "../../components/logic/FreeWheelInput";
import Label from "../../components/ui/Label";
import * as DiceProtocol from "../../diceProtocol";
import type { Roll, RollAttributes } from "./types";
import OBR from "@owlbear-rodeo/sdk";
import { powerRoll } from "./helpers";
import usePlayerName from "../../helpers/usePlayerName";
import {
  createRollRequest,
  useDiceRoller,
} from "../../helpers/diceCommunicationHelpers";
import Toggle from "../../components/ui/Toggle";
import DiceStylePicker from "./DiceStylePicker";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggleGroup";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { DiceRollViewer } from "./DiceRollResultViewer";
import { Separator } from "../../components/ui/Separator";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radioGroup";
import { cn } from "../../helpers/utils";

const defaultRollerAttributes = {
  edges: 0,
  banes: 0,
  bonus: 0,
  hasSkill: false,
  diceOptions: "2d10",
  visibility: "shared",
} satisfies RollAttributes;

export default function DiceRoller() {
  const [rollAttributes, setRollAttributes] = useState<RollAttributes>(
    defaultRollerAttributes,
  );
  const netEdges = rollAttributes.edges - rollAttributes.banes;
  const [result, setResult] = useState<Roll>();
  const playerName = usePlayerName();

  const [diceResultViewerOpen, setDiceResultViewerOpen] = useState(false);

  // External dice roller
  const handleRollResult = useCallback(
    (data: DiceProtocol.PowerRollResult) => {
      OBR.action.open();
      const rolls = data.result.map((val) => val.result);
      for (let i = 0; i < rolls.length; i++) {
        if (rolls[i] === 0) rolls[i] = 10;
      }

      setResult(
        powerRoll({
          bonus: data.rollProperties.bonus,
          hasSkill: data.rollProperties.hasSkill,
          netEdges: data.rollProperties.netEdges,
          playerName,
          rollMethod: "givenValues",
          dieValues: rolls,
          selectionStrategy:
            data.rollProperties.dice === "3d10kl2" ? "lowest" : "highest",
        }),
      );

      setRollAttributes({ ...defaultRollerAttributes });
    },
    [playerName],
  );
  const diceRoller = useDiceRoller({ onRollResult: handleRollResult });

  return (
    <div className="bg-mirage-50 dark:bg-mirage-950 mx-4 space-y-4 rounded-2xl p-4">
      <div>
        <Label variant="small" htmlFor="bonusInput">
          Bonus
        </Label>
        <div className="grid grid-cols-3 place-items-stretch gap-1">
          <Button
            aria-label="decrement bonus"
            className="rounded-r-[8px]"
            variant="secondary"
            onClick={() =>
              setRollAttributes((prev) => ({
                ...prev,
                bonus: prev.bonus - 1,
              }))
            }
          >
            <MinusIcon />
          </Button>
          <div className="grid place-items-center px-0.5">
            <FreeWheelInput
              id="bonusInput"
              className={cn(
                "file:text-foreground placeholder:text-foreground/50 selection:bg-primary selection:text-foreground ring-mirage-950/20 dark:ring-mirage-50/20 text-foreground flex h-9 h-full w-full min-w-0 rounded-[8px] bg-transparent px-3 py-1 text-center text-base shadow-xs ring transition-[color,box-shadow] duration-75 outline-none file:inline-flex file:h-7 file:bg-transparent file:text-sm file:font-medium file:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                { "focus:ring-accent focus:ring-2": true },
              )}
              value={rollAttributes.bonus.toString()}
              onUpdate={(target) =>
                setRollAttributes((prev) => ({
                  ...prev,
                  bonus: parseFloat(target.value),
                }))
              }
              clearContentOnFocus
            />
          </div>
          <Button
            aria-label="increment bonus"
            className="rounded-l-[8px]"
            variant="secondary"
            onClick={() =>
              setRollAttributes((prev) => ({
                ...prev,
                bonus: prev.bonus + 1,
              }))
            }
          >
            <PlusIcon />
          </Button>
        </div>
      </div>

      <div
        data-two-col={diceRoller.config !== undefined}
        className="grid gap-2 data-[two-col=true]:grid-cols-2"
      >
        <div className="col-span-1">
          <Label variant="small" htmlFor="skillToggleButton">
            Skill
          </Label>
          <Toggle
            id="skillToggleButton"
            pressed={rollAttributes.hasSkill}
            onClick={() =>
              setRollAttributes((prev) => ({
                ...prev,
                hasSkill: !prev.hasSkill,
              }))
            }
          >
            {rollAttributes.hasSkill ? "+2" : "+0"}
          </Toggle>
        </div>
        {diceRoller.config !== undefined && (
          <div>
            <Label variant="small" htmlFor="colorPickerTrigger">
              Dice Color
            </Label>
            <DiceStylePicker
              dialogTrigger={
                <Button
                  id="colorPickerTrigger"
                  className="w-full"
                  variant="secondary"
                >
                  <SwatchBookIcon className="w-10 shrink-0" />
                  <div
                    style={{
                      backgroundColor: rollAttributes.style?.color,
                    }}
                    className="outline-text-secondary size-5 rounded-full outline duration-150 dark:outline-white/20"
                  />
                </Button>
              }
              dieStyles={diceRoller.config.styles}
              onStyleClick={(style) =>
                setRollAttributes((prev) => ({ ...prev, style }))
              }
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="grow">
          <Label variant="small" htmlFor="edgesButtonGroup">
            Edges
          </Label>
          <ToggleGroup
            id="edgesButtonGroup"
            className="w-full"
            type="single"
            value={rollAttributes.edges.toString()}
            onValueChange={(val) =>
              setRollAttributes((prev) => ({
                ...prev,
                edges: val === "" ? 0 : parseFloat(val),
              }))
            }
          >
            <ToggleGroupItem aria-label="Edge" value="1">
              1
            </ToggleGroupItem>
            <ToggleGroupItem aria-label="Double Edge" value="2">
              2
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="grow">
          <Label variant="small" htmlFor="banesButtonGroup">
            Banes
          </Label>
          <ToggleGroup
            id="banesButtonGroup"
            className="w-full"
            type="single"
            value={rollAttributes.banes.toString()}
            onValueChange={(val) =>
              setRollAttributes((prev) => ({
                ...prev,
                banes: val === "" ? 0 : parseFloat(val),
              }))
            }
          >
            <ToggleGroupItem aria-label="Bane" value="1">
              1
            </ToggleGroupItem>
            <ToggleGroupItem aria-label="Double Bane" value="2">
              2
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Dialog open={diceResultViewerOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={result === undefined}
              size={"lg"}
              variant={"ghost"}
              className="w-10 px-0"
              onClick={() => setDiceResultViewerOpen(true)}
            >
              <HistoryIcon />
            </Button>
          </DialogTrigger>
          <DialogContent
            showCloseButton={false}
            onEscapeKeyDown={() => setDiceResultViewerOpen(false)}
            onPointerDownOutside={() => setDiceResultViewerOpen(false)}
          >
            <DialogHeader>
              <DialogTitle className="hidden">Roll Result</DialogTitle>
              <DialogDescription className="hidden">
                The result of your power roll.
              </DialogDescription>
              {result === undefined ? (
                <div className="grid place-items-center gap-4 p-4">
                  <div className="p-4">
                    <LoaderCircleIcon className="animate-spin" />
                  </div>
                  <div>Rolling Dice</div>
                </div>
              ) : (
                <DiceRollViewer result={result} />
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Button
          variant={"primary"}
          size={"lg"}
          className="grow"
          onClick={() => {
            setDiceResultViewerOpen(true);
            if (diceRoller.config === undefined) {
              setResult(
                powerRoll({
                  playerName,
                  bonus: rollAttributes.bonus,
                  hasSkill: rollAttributes.hasSkill,
                  netEdges,
                  rollMethod: "rollNow",
                  dice: "2d10",
                }),
              );
              setRollAttributes({ ...defaultRollerAttributes });
            } else {
              setResult(undefined);
              diceRoller.requestRoll(
                createRollRequest({
                  bonus: rollAttributes.bonus,
                  netEdges,
                  hasSkill: rollAttributes.hasSkill,
                  styleId: rollAttributes.style?.id,
                  dice: "2d10",
                  gmOnly: false,
                }),
              );
            }
          }}
        >
          Roll
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              aria-label="open advanced roll options"
              variant={"primary"}
              size={"icon"}
            >
              <EllipsisVerticalIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex size-full max-w-full flex-col justify-between rounded-none">
            <div className="space-y-3">
              <DialogHeader>
                <DialogTitle>Advanced Roll </DialogTitle>
                <DialogClose asChild className="absolute top-3.5 right-3.5">
                  <Button variant={"ghost"} size={"icon"}>
                    <XIcon />
                  </Button>
                </DialogClose>
                <DialogDescription>
                  Make a roll with additional configurations
                </DialogDescription>
              </DialogHeader>
              <Separator className="mb-[13px]" />
              <div>
                <div className="text-foreground-secondary text-sm">
                  Dice Options
                </div>
                <RadioGroup
                  value={rollAttributes.diceOptions}
                  onValueChange={(val) =>
                    setRollAttributes((prev) => ({
                      ...prev,
                      diceOptions: val as "2d10" | "3d10kh2" | "3d10kl2",
                    }))
                  }
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="2d10" id="2d10" />
                    <Label htmlFor="2d10">2d10</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="3d10kh2" id="3d10kh2" />
                    <Label htmlFor="3d10kh2">3d10 keep highest 2</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="3d10kl2" id="3d10kl2" />
                    <Label htmlFor="3d10kl2">3d10 keep lowest 2</Label>
                  </div>
                </RadioGroup>
              </div>

              {diceRoller.config !== undefined && (
                <div>
                  <div className="text-foreground-secondary text-sm">
                    Roll Visibility
                  </div>
                  <RadioGroup
                    value={rollAttributes.visibility}
                    onValueChange={(val) =>
                      setRollAttributes((prev) => ({
                        ...prev,
                        visibility: val as "shared" | "self",
                      }))
                    }
                  >
                    <div className="flex items-center">
                      <RadioGroupItem value="shared" id="shared" />
                      <Label htmlFor="shared">Shared</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="self" id="self" />
                      <Label htmlFor="self">Self</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
            <DialogClose asChild>
              <Button
                variant={"primary"}
                size={"lg"}
                onClick={() => {
                  setDiceResultViewerOpen(true);
                  if (diceRoller.config === undefined) {
                    setResult(
                      powerRoll({
                        bonus: rollAttributes.bonus,
                        hasSkill: rollAttributes.hasSkill,
                        netEdges,
                        playerName,
                        rollMethod: "rollNow",
                        dice: rollAttributes.diceOptions,
                      }),
                    );
                    setRollAttributes({ ...defaultRollerAttributes });
                  } else {
                    setResult(undefined);
                    diceRoller.requestRoll(
                      createRollRequest({
                        bonus: rollAttributes.bonus,
                        hasSkill: rollAttributes.hasSkill,
                        styleId: rollAttributes.style?.id,
                        netEdges,
                        dice: rollAttributes.diceOptions,
                        gmOnly: rollAttributes.visibility === "self",
                      }),
                    );
                  }
                }}
              >
                Roll
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
