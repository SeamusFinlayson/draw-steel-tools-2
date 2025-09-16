import type { Metadata } from "@owlbear-rodeo/sdk";

export function parseMetadata<T>(
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
