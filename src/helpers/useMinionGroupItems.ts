import OBR, { isImage, type Image, type Item } from "@owlbear-rodeo/sdk";
import { TOKEN_METADATA_KEY } from "./tokenHelpers";
import type { MinionTokenData } from "../types/tokenDataZod";
import { useEffect, useState } from "react";

export function useMinionGroupItems(groupId: string) {
  const [groupItems, setGroupItems] = useState<Image[]>([]);
  useEffect(() => {
    const handleItems = (items: Item[]) => {
      setGroupItems(
        items.filter(
          (item) =>
            isImage(item) &&
            ["CHARACTER", "MOUNT"].includes(item.layer) &&
            (item.metadata?.[TOKEN_METADATA_KEY] as MinionTokenData)
              ?.groupId === groupId,
        ) as Image[],
      );
    };
    OBR.scene.items.getItems().then(handleItems);
    return OBR.scene.items.onChange(handleItems);
  }, [groupId]);

  return groupItems;
}
