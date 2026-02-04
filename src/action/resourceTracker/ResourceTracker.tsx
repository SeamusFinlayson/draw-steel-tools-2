import { getPluginId } from "../../helpers/getPluginId";
import OBR from "@owlbear-rodeo/sdk";
import { RoomTrackersZod } from "../../types/roomTrackersZod";
import parseNumber from "../../helpers/parseNumber";
import { DropDownInput } from "../../components/ui/DropDownInput";
import Button from "../../components/ui/Button";
import { Calculator } from "lucide-react";

export default function ResourceTracker({
  trackers,
  setTrackers,
  playerRole,
}: {
  trackers:
    | {
        malice?: number | undefined;
        heroTokens?: number | undefined;
      }
    | undefined;
  setTrackers: (
    newValue:
      | {
          malice?: number | undefined;
          heroTokens?: number | undefined;
        }
      | undefined,
  ) => void;
  playerRole: "GM" | "PLAYER";
}) {
  const malice = trackers?.malice ? trackers.malice : 0;
  const heroTokens = trackers?.heroTokens ? trackers.heroTokens : 0;

  return (
    <div className="bg-mirage-50 dark:bg-mirage-950 mx-4 flex gap-4 rounded-2xl p-4 pb-1.5">
      <Button
        size={"icon"}
        onClick={async () => {
          const themeMode = (await OBR.theme.getTheme()).mode;
          OBR.popover.open({
            id: getPluginId("resourceCalculator"),
            height: 400,
            width: 300,
            url: `/resourceCalculator?themeMode=${themeMode}&showNone=true`,
          });
        }}
      >
        <Calculator />
      </Button>
      <div>
        <DropDownInput
          label={"Malice"}
          disabled={playerRole === "PLAYER"}
          value={malice.toString()}
          onUpdate={(target) => {
            const value = RoomTrackersZod.parse({
              ...trackers,
              malice: parseNumber(target.value, {
                min: -9999,
                max: 9999,
                truncate: true,
                inlineMath: { previousValue: malice },
              }),
            });
            setTrackers(value);
          }}
        />
      </div>
      <div>
        <DropDownInput
          label="Hero Tokens"
          value={heroTokens.toString()}
          onUpdate={(target) => {
            const value = RoomTrackersZod.parse({
              ...trackers,
              heroTokens: parseNumber(target.value, {
                min: -9999,
                max: 9999,
                truncate: true,
                inlineMath: { previousValue: heroTokens },
              }),
            });
            OBR.room.setMetadata({
              [getPluginId("trackers")]: value,
            });
            setTrackers(value);
          }}
        />
      </div>
    </div>
  );
}
