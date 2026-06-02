import type { DefinedSettings } from "../../types/settingsZod";
import type { ThemeMode } from "../../types/themeMode";
import type { MinionGroup } from "../../types/minionGroup";
import { createRemoveStats } from "./createRemoveStats";
import { createAddStats } from "./createAddStats";
import { createGmMenu } from "./createGmMenu";
import { createPlayerMenu } from "./createPlayerMenu";

export default async function createContextMenuItems(
  settings: DefinedSettings,
  themeMode: ThemeMode,
  minionGroups: MinionGroup[],
) {
  createPlayerMenu(themeMode, settings.nameTagsEnabled, minionGroups);
  createGmMenu(themeMode, settings.nameTagsEnabled, minionGroups);
  createAddStats();
  createRemoveStats(minionGroups);
}
