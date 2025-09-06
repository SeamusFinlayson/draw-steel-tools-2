import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

export default function usePlayerRole() {
  const [playerRole, setPlayerRole] = useState("");

  useEffect(() => {
    const updatePlayerRole = (role: string) => {
      setPlayerRole(role);
    };
    OBR.player.getRole().then(updatePlayerRole);
    return OBR.player.onChange((player) => {
      updatePlayerRole(player.role);
    });
  }, []);

  return playerRole;
}
