import {
  MinionTokenDataZod,
  type MinionTokenData,
} from "../../types/tokenDataZod";
import Button from "../../components/ui/Button";
import { getPluginId } from "../../helpers/getPluginId";
import { removeCreatureData } from "../../helpers/removeCreatureData";
import { generateGroupId } from "../../helpers/generateGroupId";
import { TOKEN_METADATA_KEY } from "../../helpers/tokenHelpers";
import OBR from "@owlbear-rodeo/sdk";
import type { MinionGroup } from "../../types/minionGroup";

export function MinionGroupFallback({
  minionGroups,
  groupId,
}: {
  minionGroups: MinionGroup[] | undefined;
  groupId: string;
}) {
  return (
    <div className="space-y-2">
      <div>
        <div className="text-sm">Group Not Found</div>
        <div className="text-foreground-secondary text-sm">
          Minion group data is not transferred between scenes.
        </div>
      </div>
      <Button
        variant={"secondary"}
        className="bg-mirage-400/30 dark:bg-mirage-500/30 hover:bg-mirage-400/30 hover:dark:bg-mirage-500/30 group w-full overflow-clip p-0 focus-visible:ring-0"
        onClick={async () => {
          let items = await OBR.scene.items.getItems();
          items = items.filter((item) => {
            return MinionTokenDataZod.safeParse(
              item.metadata[TOKEN_METADATA_KEY],
            ).success;
          });

          const groupIdsInUse = minionGroups
            ? minionGroups?.map((group) => group.id)
            : [];
          items = items.filter((item) => {
            return !groupIdsInUse.includes(
              (item.metadata[TOKEN_METADATA_KEY] as { groupId: string })
                .groupId,
            );
          });

          removeCreatureData(items);
        }}
      >
        <div className="group-hover:bg-foreground/7 flex size-full items-center-safe justify-center text-sm duration-150">
          Remove Stray Minions
        </div>
      </Button>
      <Button
        className="w-full text-sm"
        onClick={async () => {
          const newGroupId = generateGroupId();
          OBR.scene.items.updateItems(
            (item) => {
              const itemData = item.metadata[TOKEN_METADATA_KEY];
              const parsedData = MinionTokenDataZod.safeParse(itemData);
              return parsedData.success && parsedData.data.groupId === groupId;
            },
            (items) =>
              items.forEach(
                (item) =>
                  (item.metadata[TOKEN_METADATA_KEY] = {
                    type: "MINION",
                    groupId: newGroupId as string,
                  } satisfies MinionTokenData),
              ),
          );

          const themeMode = (await OBR.theme.getTheme()).mode;
          OBR.popover.open({
            id: getPluginId("statblockSearch"),
            url: `/statblockSearch?themeMode=${themeMode}&groupId=${newGroupId}`,
            height: 1000,
            width: 800,
            anchorOrigin: { horizontal: "CENTER", vertical: "CENTER" },
            transformOrigin: {
              horizontal: "CENTER",
              vertical: "CENTER",
            },
          });
        }}
      >
        Replace Group
      </Button>
    </div>
  );
}
