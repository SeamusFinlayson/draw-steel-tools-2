import Button from "../components/ui/Button";
import { getPluginId } from "../helpers/getPluginId";
import { CalculatorIcon } from "lucide-react";
import { useRoomMetadata } from "../helpers/useRoomMetadata";
import { RoomTrackersZod } from "../types/roomTrackersZod";
import { MaliceCalculator } from "./MaliceCalculator";
import { useState } from "react";
import { HeroTokensCalculator } from "./HeroTokensCalculator";

export function ResourceCalculator() {
  const [calculator, setCalculator] = useState<"MALICE" | "HERO_TOKENS">(
    "MALICE",
  );
  const trackerMetadata = useRoomMetadata(
    getPluginId("trackers"),
    RoomTrackersZod.parse,
  );

  if (!trackerMetadata.ready) return;

  return (
    <div className="text-foreground bg-mirage-50 dark:bg-mirage-950 border-mirage-300 dark:border-mirage-700 flex h-screen flex-col rounded-2xl border">
      <div className="border-mirage-300 dark:border-mirage-700 flex items-center justify-between border-b px-4 py-3">
        {calculator === "MALICE" && (
          <h1 className="text-lg font-bold"> Round Malice</h1>
        )}
        {calculator === "HERO_TOKENS" && (
          <h1 className="text-lg font-bold"> Session Hero Tokens</h1>
        )}
        <Button
          className="-my-4"
          variant={"ghost"}
          size={"icon"}
          onClick={() => {
            if (calculator === "MALICE") setCalculator("HERO_TOKENS");
            else setCalculator("MALICE");
          }}
        >
          <CalculatorIcon />
        </Button>
      </div>
      {calculator === "MALICE" && (
        <MaliceCalculator
          roomTrackers={trackerMetadata.value}
          updateRoomTrackers={trackerMetadata.update}
        />
      )}
      {calculator === "HERO_TOKENS" && (
        <HeroTokensCalculator
          roomTrackers={trackerMetadata.value}
          updateRoomTrackers={trackerMetadata.update}
        />
      )}
    </div>
  );
}
