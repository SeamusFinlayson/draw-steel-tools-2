import { useRoomMetadata } from "../helpers/useRoomMetadata";
import {
  defaultSettings,
  SETTINGS_METADATA_KEY,
} from "../helpers/settingsHelpers";
import { SettingsZod } from "../types/settingsZod";
import { useSceneMetadata } from "../helpers/useSceneMetadata";
import { MONSTER_GROUPS_METADATA_KEY } from "../helpers/monsterGroupHelpers";
import z from "zod";
import { MinionGroupZod, type MinionGroup } from "../types/minionGroup";
import MinionGroupEditor from "./components/MinionGroupEditor";
import { MinionGroupFallback } from "./components/MinionGroupFallback";
import { useItems } from "../helpers/useItems";
import usePlayerSelection from "../helpers/usePlayerSelection";
import { parseTokenData } from "../helpers/tokenHelpers";

const parseMinionGroups = z.array(MinionGroupZod).parse;

export default function MinionContextMenu() {
  const settingsMetadata = useRoomMetadata(
    SETTINGS_METADATA_KEY,
    SettingsZod.parse,
  );

  const minionGroupsMetadata = useSceneMetadata(
    MONSTER_GROUPS_METADATA_KEY,
    parseMinionGroups,
  );

  const items = useItems();
  const selection = usePlayerSelection();

  if (!selection || selection.length < 1) return <></>;

  const tokenData = items
    .filter((item) => selection.includes(item.id))
    .map((item) => parseTokenData(item.metadata))
    .filter((data) => data.type === "MINION");

  const groupId = tokenData[0].groupId;

  if (!settingsMetadata.ready) return <></>;
  if (!minionGroupsMetadata.ready) return <></>;
  if (!groupId) {
    return (
      <div className="text-foreground p-2">Error: no group ID provided.</div>
    );
  }

  let minionGroup: MinionGroup | undefined = undefined;
  if (minionGroupsMetadata.value !== undefined) {
    const groupIndex = minionGroupsMetadata.value.findIndex(
      (val) => val.id === groupId,
    );
    minionGroup =
      groupIndex === -1 ? undefined : minionGroupsMetadata.value[groupIndex];
  }

  const definedSettings = { ...defaultSettings, ...settingsMetadata.value };

  return (
    <div className="text-foreground space-y-2 p-2">
      {minionGroup === undefined ? (
        <MinionGroupFallback
          minionGroups={minionGroupsMetadata.value}
          groupId={groupId}
        />
      ) : (
        <MinionGroupEditor
          minionGroup={minionGroup}
          setMinionGroup={(minionGroup) => {
            if (minionGroupsMetadata.value === undefined) return;
            minionGroupsMetadata.update(
              minionGroupsMetadata.value.map((val) =>
                val.id === minionGroup.id ? minionGroup : val,
              ),
            );
          }}
          settings={definedSettings}
        />
      )}
    </div>
  );
}
