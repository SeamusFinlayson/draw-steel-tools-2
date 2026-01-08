import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./../index.css";

import { StatblockViewer } from "./StatblockViewer.tsx";
import { PluginReadyProvider } from "./context/PluginReadyProvider.tsx";
import { RollAttributesProvider } from "./context/RollAttributesProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PluginReadyProvider>
      <RollAttributesProvider>
        <StatblockViewer />
      </RollAttributesProvider>
    </PluginReadyProvider>
  </StrictMode>,
);
