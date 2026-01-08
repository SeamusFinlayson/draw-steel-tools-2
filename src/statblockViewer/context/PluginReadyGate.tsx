import { useContext } from "react";
import { PluginReadyContext } from "./PluginReadyContext";

export function PluginReadyGate({
  children,
  alternate,
}: {
  children: React.ReactNode;
  alternate?: React.ReactNode;
}) {
  const ready = useContext(PluginReadyContext);

  if (ready) {
    return children;
  } else {
    return alternate;
  }
}
