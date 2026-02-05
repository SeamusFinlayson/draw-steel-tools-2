import Button from "../components/ui/Button";
import { getPluginId } from "../helpers/getPluginId";
import { CalculatorIcon } from "lucide-react";
import { useRoomMetadata } from "../helpers/useRoomMetadata";
import { RoomTrackersZod } from "../types/roomTrackersZod";
import { MaliceCalculator } from "./MaliceCalculator";

export function ResourceCalculator() {
  const trackerMetadata = useRoomMetadata(
    getPluginId("trackers"),
    RoomTrackersZod.parse,
  );

  if (!trackerMetadata.ready) return;

  return (
    <div className="text-foreground bg-mirage-50 dark:bg-mirage-950 border-mirage-300 dark:border-mirage-700 flex h-screen flex-col rounded-2xl border">
      <div className="border-mirage-300 dark:border-mirage-700 flex items-center justify-between border-b px-4 py-3">
        <h1 className="text-lg font-bold">New Round Malice</h1>
        <Button className="-my-4" variant={"ghost"} size={"icon"}>
          <CalculatorIcon className="" />
        </Button>
      </div>
      <MaliceCalculator
        roomTrackers={trackerMetadata.value}
        updateRoomTrackers={trackerMetadata.update}
      />
    </div>
  );
}
