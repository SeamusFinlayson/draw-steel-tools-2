import { useEffect, useState } from "react";
import {
  CharacterTokenDataZod,
  DefinedCharacterTokenDataZod,
  type DefinedCharacterTokenData,
} from "../types/tokenDataZod";
import OBR, { type Item } from "@owlbear-rodeo/sdk";
import { getSelectedItems } from "../helpers/getSelectedItem";
import { parseTokenData, TOKEN_METADATA_KEY } from "../helpers/tokenHelpers";
import { useRoomMetadata } from "../helpers/useRoomMetadata";
import {
  defaultSettings,
  SETTINGS_METADATA_KEY,
} from "../helpers/settingsHelpers";
import { SettingsZod } from "../types/settingsZod";
import usePlayerRole from "../helpers/usePlayerRole";
import type { Token } from "../types/contextMenuToken";
import NameInput from "./components/NameInput";
import StatEditor from "./components/StatEditor";
import StatblockControls from "./components/StatblockControls";
import VisibilityToggle from "./components/VisibilityToggle";
import { useSceneMetadata } from "../helpers/useSceneMetadata";
import { MONSTER_GROUPS_METADATA_KEY } from "../helpers/monsterGroupHelpers";
import z from "zod";
import { MinionGroupZod, type MinionGroup } from "../types/minionGroup";
import MinionGroupEditor from "./components/MinionGroupEditor";
import { MinionGroupFallback } from "./components/MinionGroupFallback";

const parseMinionGroups = z.array(MinionGroupZod).parse;

export default function TokenEditor() {
  const playerRole = usePlayerRole();

  const settingsMetadata = useRoomMetadata(
    SETTINGS_METADATA_KEY,
    SettingsZod.parse,
  );

  const minionGroupsMetadata = useSceneMetadata(
    MONSTER_GROUPS_METADATA_KEY,
    parseMinionGroups,
  );

  const [token, setToken] = useState<Token>();
  useEffect(() => {
    const handleItems = (items: Item[]) => {
      if (items.length !== 1) throw new Error("Too many items selected.");
      const item = items[0];
      const characterData = parseTokenData(item.metadata);
      setToken({ ...characterData, item });
    };
    getSelectedItems().then(handleItems);
    return OBR.scene.items.onChange((items) => {
      getSelectedItems({ items }).then(handleItems);
    });
  }, []);

  if (token === undefined || !settingsMetadata.ready) return <></>;

  let minionGroup: MinionGroup | undefined = undefined;
  if (token.type === "MINION") {
    if (!minionGroupsMetadata.ready) return <></>;
    if (minionGroupsMetadata.value !== undefined) {
      const groupIndex = minionGroupsMetadata.value.findIndex(
        (val) => val.id === token.groupId,
      );
      minionGroup =
        groupIndex === -1 ? undefined : minionGroupsMetadata.value[groupIndex];
    }
  }

  const definedSettings = { ...defaultSettings, ...settingsMetadata.value };

  const updateToken = (
    characterTokenData: Partial<DefinedCharacterTokenData>,
  ) => {
    setToken({
      ...DefinedCharacterTokenDataZod.parse({
        ...token,
        ...characterTokenData,
      }),
      item: token.item,
    });
    OBR.scene.items.updateItems(
      (item) => item.id === token.item.id,
      (items) => {
        if (items.length !== 1) throw new Error("Too many items selected.");
        if (
          "name" in characterTokenData &&
          characterTokenData?.name &&
          characterTokenData.name.length > 0
        ) {
          items[0].name = characterTokenData.name;
        }
        const existingDataValidation = CharacterTokenDataZod.safeParse(
          items[0].metadata[TOKEN_METADATA_KEY],
        );
        items[0].metadata[TOKEN_METADATA_KEY] = CharacterTokenDataZod.parse({
          ...(existingDataValidation.success
            ? existingDataValidation.data
            : undefined),
          ...characterTokenData,
        });
      },
    );
  };

  return (
    <div className="text-foreground space-y-2 p-2">
      {token.type === "MINION" ? (
        minionGroup === undefined ? (
          <MinionGroupFallback
            minionGroups={minionGroupsMetadata.value}
            groupId={token.groupId}
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
        )
      ) : (
        <>
          {definedSettings.nameTagsEnabled && (
            <NameInput
              value={token.name}
              placeHolder={token.item.name}
              updateName={(name) => updateToken({ name })}
            />
          )}
          <StatEditor token={token} updateToken={updateToken} />
          {token.type === "MONSTER" && (
            <StatblockControls
              statblockName={token.statblockName}
              setStatblockName={() => updateToken({ statblockName: "" })}
              playerRole={playerRole}
            />
          )}
          {playerRole === "GM" && (
            <VisibilityToggle
              value={token.gmOnly}
              onClick={() => updateToken({ gmOnly: !token.gmOnly })}
            />
          )}
        </>
      )}
    </div>
  );
}
