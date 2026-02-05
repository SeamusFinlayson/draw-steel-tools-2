import OBR from "@owlbear-rodeo/sdk";
import Button from "../components/ui/Button";
import { getPluginId } from "../helpers/getPluginId";
import { useState } from "react";
import { CalculatorIcon, ChevronLeft, ChevronRight } from "lucide-react";
import FreeWheelInput from "../components/logic/FreeWheelInput";
import z from "zod";
import parseNumber from "../helpers/parseNumber";
import { useRoomMetadata } from "../helpers/useRoomMetadata";
import { RoomTrackersZod } from "../types/roomTrackersZod";
import { getLocalStorageNumber } from "../helpers/localStorageHelpers";
import { broadcastSetRoundNumberMessage } from "../helpers/broadcastRoundImplementation";

export function ResourceCalculator() {
  const [heroCount, setHeroCount] = useState(
    getLocalStorageNumber("heroCount", 1),
  );
  const [roundNumber, setRoundNumber] = useState(
    getLocalStorageNumber("roundNumber", 1),
  );
  const [victories, setVictories] = useState(
    getLocalStorageNumber("victories"),
  );
  const ignoreVictories = roundNumber > 1;
  const includedVictories = ignoreVictories ? 0 : victories;

  const trackerMetadata = useRoomMetadata(
    getPluginId("trackers"),
    RoomTrackersZod.parse,
  );
  const malice = trackerMetadata.value?.malice
    ? trackerMetadata.value.malice
    : 0;

  const newMalice = heroCount + roundNumber + includedVictories + malice;

  return (
    <div className="text-foreground bg-mirage-50 dark:bg-mirage-950 border-mirage-300 dark:border-mirage-700 flex h-screen flex-col rounded-2xl border">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="space-y-3">
          <div className="border-mirage-300 dark:border-mirage-700 -mx-4 -mt-4 mb-4 flex items-center justify-between border-b p-4">
            <h1 className="text-lg font-bold">New Round Malice</h1>
            <Button inert className="-my-4" variant={"ghost"} size={"icon"}>
              <CalculatorIcon className="" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <div className="min-w-36 text-nowrap">Round</div>
            <Counter
              label="round number"
              value={roundNumber}
              setValue={(value) => {
                localStorage.setItem("roundNumber", value.toString());
                setRoundNumber(value);
                broadcastSetRoundNumberMessage(value);
              }}
              min={1}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <div className="min-w-36 text-nowrap">Heroes</div>
            <Counter
              label="number of heroes"
              value={heroCount}
              setValue={(value) => {
                localStorage.setItem("heroCount", value.toString());
                setHeroCount(value);
              }}
              min={0}
            />
          </div>

          <div
            inert={ignoreVictories}
            className={
              "flex flex-wrap items-center justify-between inert:opacity-50"
            }
          >
            <div className="min-w-36 text-nowrap">Average Victories</div>
            <Counter
              label="average victories of heroes"
              value={victories}
              setValue={(value) => {
                localStorage.setItem("victories", value.toString());
                setVictories(value);
              }}
              min={0}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <div className="min-w-36 text-nowrap">Current Malice</div>
            <FreeWheelInput
              clearContentOnFocus
              className="h-8 w-28 rounded-md text-center transition-colors outline-none hover:bg-black/5 focus:bg-black/10 dark:hover:bg-white/5 dark:focus:bg-white/10"
              value={malice.toString()}
              onUpdate={(target) =>
                trackerMetadata.update({
                  ...trackerMetadata.value,
                  malice: parseNumber(target.value, { truncate: true }),
                })
              }
            />
          </div>
          <div className="border-b" />
          <div className="flex flex-wrap items-center justify-between font-bold">
            <div className="min-w-36 text-nowrap">New Total</div>
            <div className="grid h-8 w-28 place-items-center">{newMalice}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            className="flex-1"
            variant={"outline"}
            onClick={() => OBR.popover.close(getPluginId("resourceCalculator"))}
          >
            Close
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              trackerMetadata.update({
                ...trackerMetadata.value,
                malice: newMalice,
              });
              OBR.popover.close(getPluginId("resourceCalculator"));
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

function Counter({
  value,
  setValue,
  min,
  label,
}: {
  value: number;
  setValue: (value: number) => void;
  min: number;
  label: string;
}) {
  return (
    <div className="flex w-fit gap-1">
      <Button
        variant={"secondary"}
        size={"sm"}
        className="flex w-8 items-center justify-center"
        aria-label={"decrement " + label}
        onClick={() => (value > min ? setValue(value - 1) : setValue(min))}
      >
        <ChevronLeft />
      </Button>
      <FreeWheelInput
        className="h-8 w-10 rounded-md text-center transition-colors outline-none hover:bg-black/5 focus:bg-black/10 dark:hover:bg-white/5 dark:focus:bg-white/10"
        aria-label={label}
        value={value.toString()}
        onUpdate={(target) => {
          const bonus = z.int().parse(
            parseNumber(target.value, {
              min: min,
              max: 99,
              truncate: true,
            }),
          );
          setValue(bonus);
        }}
        clearContentOnFocus
      />
      <Button
        size={"sm"}
        variant={"secondary"}
        className="flex w-8 items-center justify-center"
        aria-label={"increment " + label}
        onClick={() => setValue(value + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
