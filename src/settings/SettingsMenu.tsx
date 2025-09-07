import { useCallback } from "react";
import HeightMatch from "../components/logic/HeightMatch";
import { ScrollArea } from "../components/ui/scrollArea";
import SettingsList from "./SettingsList";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../helpers/getPluginId";
import { useRoomMetadata } from "../helpers/roomMetadata";
import { SettingsZod } from "../types/settings";

export default function SettingsMenu() {
  const [settings, setSettings, ready] = useRoomMetadata(
    getPluginId("metadata"),
    SettingsZod.parse,
  );

  const setPopoverHeight = useCallback((height: number) => {
    OBR.popover.setHeight(getPluginId("settings"), height);
  }, []);

  return (
    <div className="text-foreground bg-mirage-50 dark:bg-mirage-950 h-screen">
      {ready && (
        <ScrollArea className="h-full" type="always">
          <HeightMatch setHeight={setPopoverHeight}>
            <div className="space-y-4 p-4 sm:p-6">
              <h1 className="w-full text-lg font-bold">Room Settings</h1>
              <div className="text-foreground flex flex-col gap-4">
                <SettingsList settings={settings} setSettings={setSettings} />
              </div>
            </div>
          </HeightMatch>
        </ScrollArea>
      )}
    </div>
  );
}
