import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";
import { PluginReadyContext } from "./PluginReadyContext";

export function PluginReadyProvider({ children }: { children: any }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (OBR.isAvailable) {
      OBR.onReady(() => setReady(true));
    }
  }, []);

  return <PluginReadyContext value={ready}>{children}</PluginReadyContext>;
}
