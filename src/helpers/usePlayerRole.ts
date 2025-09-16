import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

export default function usePlayerRole() {
  const [playerRole, setPlayerRole] = useState<"GM" | "PLAYER">("PLAYER");

  useEffect(() => {
    const updatePlayerRole = (role: "GM" | "PLAYER") => {
      setPlayerRole(role);
    };
    OBR.player.getRole().then(updatePlayerRole);
    return OBR.player.onChange((player) => {
      updatePlayerRole(player.role);
    });
  }, []);

  return playerRole;
}
