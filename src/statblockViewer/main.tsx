import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./../index.css";

import { StatblockViewer } from "./StatblockViewer.tsx";
import { PluginReadyProvider } from "./context/PluginReadyProvider.tsx";
import { RollAttributesProvider } from "./context/RollAttributesProvider.tsx";
import { DiceDrawerProvider } from "./context/DiceDrawerContextProvider.tsx";
import { RoomTrackersMetadataProvider } from "./context/RoomTrackersMetadataProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PluginReadyProvider>
      <DiceDrawerProvider>
        <RollAttributesProvider>
          <RoomTrackersMetadataProvider>
            <StatblockViewer />
          </RoomTrackersMetadataProvider>
        </RollAttributesProvider>
      </DiceDrawerProvider>
    </PluginReadyProvider>
  </StrictMode>,
);
