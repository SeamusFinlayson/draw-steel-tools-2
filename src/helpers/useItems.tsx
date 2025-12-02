import type { Item } from "@owlbear-rodeo/sdk";
import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    const handleItems = (items: Item[]) => {
      setItems(items);
      console.log("handleItems");
    };

    OBR.scene.items.getItems().then(
      (items) => handleItems(items),
      () => {},
    );
    return OBR.scene.items.onChange(handleItems);
  }, []);

  return items;
}
