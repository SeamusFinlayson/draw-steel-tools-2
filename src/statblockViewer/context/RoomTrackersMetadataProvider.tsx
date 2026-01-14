import { useEffect, useState } from "react";
import { RoomTrackersContext } from "./RoomTrackersMetadataContext";
import { parseMetadata } from "../../helpers/parseMetadata";
import {
  RoomTrackersZod,
  type RoomTrackers,
} from "../../types/roomTrackersZod";
import OBR, { type Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../helpers/getPluginId";

const parser = RoomTrackersZod.parse;
const key = getPluginId("trackers");

export function RoomTrackersMetadataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [obrReady, setObrReady] = useState(false);

  useEffect(() => {
    if (OBR.isAvailable) {
      OBR.onReady(() => setObrReady(true));
    }
  }, []);

  const [metadata, setMetadata] = useState<RoomTrackers>({
    malice: 0,
    heroTokens: 0,
  });
  const [_ready, setReady] = useState(false);

  // const updateMetadata = useCallback(
  //   (newValue: RoomTrackers) => {
  //     setMetadata(newValue);
  //     OBR.room.setMetadata({
  //       [key]: newValue,
  //     });
  //   },
  //   [key],
  // );

  useEffect(() => {
    if (!obrReady) return;
    const handleRoomMetadata = (metadata: Metadata) => {
      setMetadata(parseMetadata(metadata, key, parser));
      setReady(true);
    };
    OBR.room.getMetadata().then(handleRoomMetadata);
    return OBR.room.onMetadataChange(handleRoomMetadata);
  }, [key, parser, obrReady]);

  console.log(obrReady, metadata);

  return <RoomTrackersContext value={metadata}>{children}</RoomTrackersContext>;
}
