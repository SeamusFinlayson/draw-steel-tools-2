import type { Image, Item } from "@owlbear-rodeo/sdk";
import type { DefinedMinionTokenData } from "../../types/tokenDataZod";

import type { DefinedSettings } from "../../types/settingsZod";
import { createTokenOverlay } from "./createTokenOverlay";
import type { MinionGroup } from "../../types/minionGroup";

export function createMinionOverlay(
  image: Image,
  token: DefinedMinionTokenData,
  minionGroups: MinionGroup[],
  role: "PLAYER" | "GM",
  dpi: number,
  settings: DefinedSettings,
  minionGroupTokenCounts: {
    [groupId: string]: number;
  },
): Item[] {
  const minionGroup = minionGroups.find((item) => item.id === token.groupId);
  if (!minionGroup) return [];

  const groupRequiredChange = Math.trunc(
    Math.ceil(minionGroup.currentStamina / minionGroup.individualStamina) -
      minionGroupTokenCounts[minionGroup.id],
  );

  return createTokenOverlay(
    {
      bubbles: [
        {
          color: "#a0201f",
          value: minionGroup.individualStamina,
          display:
            role === "GM" ||
            ("gmOnly" in minionGroup && minionGroup.gmOnly === false),
        },
        {
          color: "black",
          value:
            groupRequiredChange > 0
              ? `+${groupRequiredChange}`
              : groupRequiredChange,
          display:
            groupRequiredChange !== 0 && !Number.isNaN(groupRequiredChange),
        },
      ],
      nameTags: [
        {
          text: minionGroup.name,
          display:
            settings.nameTagsEnabled &&
            minionGroup.nameTagsEnabled &&
            minionGroup.name !== "",
        },
      ],
    },
    image,
    dpi,
    settings,
  );
}
