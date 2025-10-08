import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./../index.css";
import { PluginGate } from "../components/logic/PluginGate.tsx";
import { syncThemeMode } from "../helpers/syncThemeMode.ts";
import App from "./StatblockSearch.tsx";

syncThemeMode();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PluginGate>
      <App />
    </PluginGate>
  </StrictMode>,
);
