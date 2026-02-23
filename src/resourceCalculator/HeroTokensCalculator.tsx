import { useState } from "react";
import { getLocalStorageNumber } from "../helpers/localStorageHelpers";
import type { RoomTrackers } from "../types/roomTrackersZod";
import OBR from "@owlbear-rodeo/sdk";
import Button from "../components/ui/Button";
import { getPluginId } from "../helpers/getPluginId";
import { Counter } from "./Counter";

export function HeroTokensCalculator({
  roomTrackers,
  updateRoomTrackers,
}: {
  roomTrackers: RoomTrackers;
  updateRoomTrackers: (roomTrackers: RoomTrackers) => void;
}) {
  const [heroCount, setHeroCount] = useState(
    getLocalStorageNumber("heroCount", 1),
  );

  const newHeroTokens = heroCount;

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-3">
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

        <div className="border-b" />
        <div className="flex flex-wrap items-center justify-between font-bold">
          <div className="text-nowrap">New Total</div>
          <div className="grid h-8 w-28 place-items-center">
            {newHeroTokens}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          className="flex-1"
          variant={"accentOutline"}
          onClick={() => OBR.popover.close(getPluginId("resourceCalculator"))}
        >
          Close
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            updateRoomTrackers({
              ...roomTrackers,
              heroTokens: newHeroTokens,
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
