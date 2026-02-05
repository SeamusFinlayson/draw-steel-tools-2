import { useState } from "react";
import { getLocalStorageNumber } from "../helpers/localStorageHelpers";
import type { RoomTrackers } from "../types/roomTrackersZod";
import OBR from "@owlbear-rodeo/sdk";
import FreeWheelInput from "../components/logic/FreeWheelInput";
import Button from "../components/ui/Button";
import { broadcastSetRoundNumberMessage } from "../helpers/broadcastRoundImplementation";
import { getPluginId } from "../helpers/getPluginId";
import parseNumber from "../helpers/parseNumber";
import { Counter } from "./Counter";

export function MaliceCalculator({
  roomTrackers,
  updateRoomTrackers,
}: {
  roomTrackers: RoomTrackers;
  updateRoomTrackers: (roomTrackers: RoomTrackers) => void;
}) {
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

  const malice = roomTrackers?.malice ? roomTrackers.malice : 0;

  const newMalice = heroCount + roundNumber + includedVictories + malice;

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between">
          <div className="min-w-32 text-nowrap">Round</div>
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
          <div className="min-w-32 text-nowrap">Heroes</div>
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
          <div className="min-w-32 text-nowrap">Average Victories</div>
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
          <div className="text-nowrap">Current Malice</div>
          <FreeWheelInput
            clearContentOnFocus
            className="h-8 w-28 rounded-md text-center transition-colors outline-none hover:bg-black/5 focus:bg-black/10 dark:hover:bg-white/5 dark:focus:bg-white/10"
            value={malice.toString()}
            onUpdate={(target) =>
              updateRoomTrackers({
                ...roomTrackers,
                malice: parseNumber(target.value, { truncate: true }),
              })
            }
          />
        </div>
        <div className="border-b" />
        <div className="flex flex-wrap items-center justify-between font-bold">
          <div className="text-nowrap">New Total</div>
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
            updateRoomTrackers({
              ...roomTrackers,
              malice: newMalice,
            });
            OBR.popover.close(getPluginId("resourceCalculator"));
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
