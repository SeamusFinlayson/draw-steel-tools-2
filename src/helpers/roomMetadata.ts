import { useCallback, useEffect, useState } from "react";
import type { Metadata } from "@owlbear-rodeo/sdk";
import OBR from "@owlbear-rodeo/sdk";

function parseMetadata<T>(
  metadata: Metadata,
  key: string,
  parser: (value: unknown) => T,
) {
  const trackerMetadata = metadata[key];
  try {
    return parser(trackerMetadata);
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

/**
 *
 * @param key object key where data is saved
 * @param parser function that returns data with type validation
 * @returns an array containing the current value saved at the key and a function that sets the react state and the value room metadata and a boolean indicating if data has been received
 */
export function useRoomMetadata<T>(
  key: string,
  parser: (value: unknown) => T,
): [T | undefined, (newValue: T) => void, boolean] {
  const [value, setValue] = useState<T>();
  const [ready, setReady] = useState(false);

  const updateMetadata = useCallback(
    (newValue: T) => {
      setValue(newValue);
      OBR.room.setMetadata({
        [key]: newValue,
      });
    },
    [key],
  );

  useEffect(() => {
    const handleRoomMetadata = (metadata: Metadata) => {
      setValue(parseMetadata(metadata, key, parser));
      setReady(true);
    };
    OBR.room.getMetadata().then(handleRoomMetadata);
    return OBR.room.onMetadataChange(handleRoomMetadata);
  }, [key, parser]);

  return [value, updateMetadata, ready];
}
