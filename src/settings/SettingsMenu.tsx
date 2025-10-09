import { useCallback } from "react";
import HeightMatch from "../components/logic/HeightMatch";
import { ScrollArea } from "../components/ui/scrollArea";
import SettingsList from "./SettingsList";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../helpers/getPluginId";
import { useRoomMetadata } from "../helpers/useRoomMetadata";
import { SettingsZod } from "../types/settingsZod";
import { SETTINGS_METADATA_KEY } from "../helpers/settingsHelpers";

export default function SettingsMenu() {
  const settingsMetadata = useRoomMetadata(
    SETTINGS_METADATA_KEY,
    SettingsZod.parse,
  );

  const setPopoverHeight = useCallback((height: number) => {
    OBR.popover.setHeight(getPluginId("settings"), height);
  }, []);

  return (
    <div className="text-foreground bg-mirage-50 dark:bg-mirage-950 h-screen">
      {settingsMetadata.ready && (
        <ScrollArea className="h-full" type="always">
          <HeightMatch setHeight={setPopoverHeight}>
            <div className="border-mirage-300 dark:border-mirage-700 space-y-4 rounded-2xl border p-4 sm:p-6">
              <h1 className="w-full text-lg font-bold">
                <span>Draw Steel Tools </span>
                <span className="text-foreground-secondary font-normal">
                  Room Settings
                </span>
              </h1>
              <div className="text-foreground flex flex-col gap-4">
                <SettingsList
                  settings={settingsMetadata.value}
                  setSettings={settingsMetadata.update}
                />
              </div>
              <div className="text-foreground-secondary text-sm">
                Draw Steel Tools is an independent product published under the
                DRAW STEEL Creator License and is not affiliated with MCDM
                Productions, LLC. DRAW STEEL © 2024 MCDM Productions, LLC.
              </div>
            </div>
          </HeightMatch>
        </ScrollArea>
      )}
    </div>
  );
}
