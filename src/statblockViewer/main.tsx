import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./../index.css";

import { StatblockViewer } from "./StatblockViewer.tsx";
import { PluginReadyProvider } from "./context/PluginReadyProvider.tsx";
import { RollAttributesProvider } from "./context/RollAttributesProvider.tsx";
import { DiceDrawerProvider } from "./context/DiceDrawerContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PluginReadyProvider>
      <DiceDrawerProvider>
        <RollAttributesProvider>
          <StatblockViewer />
        </RollAttributesProvider>
      </DiceDrawerProvider>
    </PluginReadyProvider>
  </StrictMode>,
);
