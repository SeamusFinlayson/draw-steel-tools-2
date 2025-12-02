import { useCallback, useEffect, useState } from "react";
import type { Metadata } from "@owlbear-rodeo/sdk";
import OBR from "@owlbear-rodeo/sdk";
import { parseMetadata } from "./parseMetadata";

/**
 *
 * @param key object key where data is saved
 * @param parser function that returns data with type validation
 * @returns an array containing the current value saved at the key and a function that sets the react state and the value scene metadata and a boolean indicating if data has been received
 */
export function useSceneMetadata<T>(
  key: string,
  parser: (value: unknown) => T,
) {
  const [metadata, setMetadata] = useState<T>();
  const [ready, setReady] = useState(false);

  const updateMetadata = useCallback(
    (newValue: T) => {
      setMetadata(newValue);
      OBR.scene.setMetadata({
        [key]: newValue,
      });
    },
    [key],
  );

  useEffect(() => {
    const handleSceneMetadata = (metadata: Metadata) => {
      setMetadata(parseMetadata(metadata, key, parser));
      setReady(true);
    };

    OBR.scene.getMetadata().then(handleSceneMetadata, () => {});
    return OBR.scene.onMetadataChange(handleSceneMetadata);
  }, [key, parser]);

  return { value: metadata, update: updateMetadata, ready };
}
