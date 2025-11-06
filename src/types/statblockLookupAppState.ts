import type { MonsterDataBundle, IndexBundle } from "./monsterDataBundlesZod";

export type SetupOptions =
  | {
      type: "BASIC";
      stamina: { enabled: boolean; value: number };
      name: { enabled: boolean; value: string; nameTag: boolean };
    }
  | {
      type: "MINION";
      stamina: { value: number };
      groupName: { value: string; nameTags: boolean };
    };

export type AppState = {
  monsterViewerOpen: boolean;
  monsterViewerData: MonsterDataBundle | undefined;
  selectedIndexBundle: IndexBundle | "NONE" | undefined;
  setupOptions: SetupOptions | undefined;
};

export const defaultAppState: AppState = {
  monsterViewerOpen: false,
  monsterViewerData: undefined,
  selectedIndexBundle: undefined,
  setupOptions: undefined,
};
