import type { IndexBundle } from "./monsterDataBundlesZod";
import { defaultSearchData, type SearchData } from "./statblockSearchData";

export type MonsterSetupOptions = {
  type: "MONSTER";
  stamina: { enabled: boolean; value: number };
  name: { enabled: boolean; value: string; nameTag: boolean };
};
export type MinionSetupOptions = {
  type: "MINION";
  stamina: { value: number };
  groupName: { value: string; nameTags: boolean };
};
export type TerrainSetupOptions = {
  type: "TERRAIN";
  stamina: { enabled: boolean; value: number };
  name: { enabled: boolean; value: string; nameTag: boolean };
};

export type SetupOptions =
  | MonsterSetupOptions
  | MinionSetupOptions
  | TerrainSetupOptions;

export type AppState = {
  search: SearchData;
  monsterViewerOpen: boolean;
  previewIndexBundle: IndexBundle | undefined;
  selectedIndexBundle: IndexBundle | "NONE" | undefined;
  setupOptions: SetupOptions | undefined;
};

export const defaultAppState: AppState = {
  search: defaultSearchData,
  monsterViewerOpen: false,
  previewIndexBundle: undefined,
  selectedIndexBundle: undefined,
  setupOptions: undefined,
};
