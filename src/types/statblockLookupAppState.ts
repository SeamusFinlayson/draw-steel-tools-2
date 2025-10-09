import type { MonsterDataBundle, IndexBundle } from "./monsterDataBundlesZod";

export type TokenOptions = {
  stamina: { overwriteTokens: boolean; value: number };
  name: { overwriteTokens: boolean; value: string; nameTag: boolean };
  removeExistingStatblock: { showOption: boolean; value: boolean };
};

export type AppState = {
  monsterViewerOpen: boolean;
  monsterViewerData: MonsterDataBundle | undefined;
  selectedIndexBundle: IndexBundle | "NONE" | undefined;
  tokenOptions: TokenOptions | undefined;
};

export const defaultAppState: AppState = {
  monsterViewerOpen: false,
  monsterViewerData: undefined,
  selectedIndexBundle: undefined,
  tokenOptions: undefined,
};
