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
import { defaultRollerAttributes, powerRoll } from "./helpers";
import { createRollRequest } from "../../helpers/diceCommunicationHelpers";
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
import Input from "../../components/ui/Input";
import z from "zod";
import parseNumber from "../../helpers/parseNumber";
import type {
  DiceRoller,
  Roll,
  RollAttributes,
} from "../../types/diceRollerTypes";

export default function DiceRoller({
  playerName,
  rollAttributes,
  setRollAttributes,
  diceRoller,
  result,
  setResult,
  diceResultViewerOpen,
  setDiceResultViewerOpen,
}: {
  playerName: string;
  rollAttributes: RollAttributes;
  setRollAttributes: React.Dispatch<React.SetStateAction<RollAttributes>>;
  diceRoller: DiceRoller;
  result: Roll | undefined;
  setResult: React.Dispatch<React.SetStateAction<Roll | undefined>>;
  diceResultViewerOpen: boolean;
  setDiceResultViewerOpen: (diceRollerOpen: boolean) => void;
}) {
  const netEdges = rollAttributes.edges - rollAttributes.banes;

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
          <Input className="px-0 text-center" hasFocusHighlight>
            <FreeWheelInput
              id="bonusInput"
              value={rollAttributes.bonus.toString()}
              onUpdate={(target) => {
                const bonus = z.int().parse(
                  parseNumber(target.value, {
                    min: -999,
                    max: 999,
                    truncate: true,
                  }),
                );
                setRollAttributes((prev) => ({
                  ...prev,
                  bonus,
                }));
              }}
              clearContentOnFocus
            />
          </Input>
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
