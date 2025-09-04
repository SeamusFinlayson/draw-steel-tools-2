import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

export default function usePlayerName() {
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const updatePlayerName = (name: string) => {
      setPlayerName(name);
    };
    OBR.player.getName().then(updatePlayerName);
    return OBR.player.onChange((player) => {
      updatePlayerName(player.name);
    });
  }, []);

  return playerName;
}
