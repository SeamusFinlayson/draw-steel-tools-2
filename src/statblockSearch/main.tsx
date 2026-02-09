import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./../index.css";
import { syncThemeMode } from "../helpers/syncThemeMode.ts";
import StatblockSearch from "./StatblockSearch.tsx";
import { PluginReadyProvider } from "../components/logic/PluginReadyProvider.tsx";
import { PluginReadyGate } from "../components/logic/PluginReadyGate.tsx";
import { DevActionButtons } from "./components/DevScriptButtons.tsx";

import monsterIndex from "./monsterIndex.json";

syncThemeMode();

const params = new URLSearchParams(document.location.search);
const devMode = params.get("dev");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PluginReadyProvider>
      <PluginReadyGate
        alternate={
          devMode === "true" && <DevActionButtons monsterIndex={monsterIndex} />
        }
      >
        <StatblockSearch monsterIndex={monsterIndex} />
      </PluginReadyGate>
    </PluginReadyProvider>
  </StrictMode>,
);
