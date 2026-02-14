import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

export default function usePlayerSelection() {
  const [playerSelection, setPlayerSelection] = useState<string[] | undefined>(
    [],
  );

  useEffect(() => {
    const updatePlayerSelection = (selection: string[] | undefined) => {
      setPlayerSelection(selection);
    };
    OBR.player.getSelection().then(updatePlayerSelection);
    return OBR.player.onChange((player) => {
      updatePlayerSelection(player.selection);
    });
  }, []);

  return playerSelection;
}
