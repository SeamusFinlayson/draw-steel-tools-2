import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./../index.css";
import ActionMenu from "./ActionMenu.tsx";
import { PluginGate } from "../helpers/PluginGate.tsx";
import { syncTheme } from "../helpers/syncTheme.ts";

syncTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PluginGate>
      <ActionMenu />
    </PluginGate>
  </StrictMode>,
);
