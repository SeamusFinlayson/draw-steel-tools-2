import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import type { Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../helpers/getPluginId";
import OBR from "@owlbear-rodeo/sdk";
import {
  RoomTrackersZod,
  type RoomTrackers,
} from "../../types/roomTrackersTypes";
import FreeWheelInput from "../../components/logic/FreeWheelInput";
import Label from "../../components/ui/Label";
import parseNumber from "../../helpers/parseNumber";

export default function ResourceTracker() {
  const { trackers, setTrackers } = useRoomTrackers();
  const malice = trackers?.malice ? trackers.malice : 0;
  const heroTokens = trackers?.heroTokens ? trackers.heroTokens : 0;

  return (
    <div className="bg-mirage-950 mx-4 flex gap-4 rounded-2xl p-4">
      <div>
        <Label variant="small">Malice</Label>
        <Input>
          <FreeWheelInput
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
              OBR.room.setMetadata({
                [getPluginId("trackers")]: value,
              });
              setTrackers(value);
            }}
            clearContentOnFocus
          />
        </Input>
      </div>
      <div>
        <Label variant="small">Hero Tokens</Label>
        <Input>
          <FreeWheelInput
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
            clearContentOnFocus
          />
        </Input>
      </div>
    </div>
  );
}

function parseMetadataTrackers(metadata: Metadata) {
  const trackerMetadata = metadata[getPluginId("trackers")];
  const validation = RoomTrackersZod.safeParse(trackerMetadata);
  return validation.success ? validation.data : undefined;
}

function useRoomTrackers() {
  const [trackers, setTrackers] = useState<RoomTrackers>();

  useEffect(() => {
    const handleRoomMetadata = (metadata: Metadata) => {
      setTrackers(parseMetadataTrackers(metadata));
    };
    OBR.room.getMetadata().then(handleRoomMetadata);
    return OBR.room.onMetadataChange(handleRoomMetadata);
  }, []);

  return { trackers, setTrackers };
}
