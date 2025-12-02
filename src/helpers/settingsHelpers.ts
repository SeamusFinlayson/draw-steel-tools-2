import { type Metadata } from "@owlbear-rodeo/sdk";
import { SettingsZod, type DefinedSettings } from "../types/settingsZod";
import { parseMetadata } from "./parseMetadata";
import { getPluginId } from "./getPluginId";

export const SETTINGS_METADATA_KEY = getPluginId("metadata");

export const defaultSettings: DefinedSettings = {
  nameTagsEnabled: false,
  verticalOffset: 0,
  justifyHealthBarsTop: false,
  showHealthBars: false,
  segmentsCount: 0,
  keepPowerRollBonus: false,
  keepActivitiesOpen: false,
};

export function getSettings(
  metadata: Metadata,
  currentSettings?: DefinedSettings,
) {
  const settings = {
    ...defaultSettings,
    ...parseMetadata(metadata, SETTINGS_METADATA_KEY, SettingsZod.parse),
  };

  if (currentSettings === undefined) return { settings, isChanged: true };

  let isChanged = false;
  for (const key of Object.keys(defaultSettings)) {
    if (
      (currentSettings[key as keyof DefinedSettings] as unknown) ===
      settings[key as keyof DefinedSettings]
    ) {
      isChanged = true;
      break;
    }
  }

  return { settings, isChanged };
}
