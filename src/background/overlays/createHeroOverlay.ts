import type { Image, Item } from "@owlbear-rodeo/sdk";
import type { DefinedHeroTokenData } from "../../types/tokenDataZod";

import type { DefinedSettings } from "../../types/settingsZod";
import { createTokenOverlay } from "./createTokenOverlay";

export function createHeroOverlay(
  image: Image,
  token: DefinedHeroTokenData,
  role: "PLAYER" | "GM",
  dpi: number,
  settings: DefinedSettings,
): Item[] {
  return createTokenOverlay(
    {
      bars: [
        {
          value: token.stamina,
          maximum: token.staminaMaximum,
          display:
            token.staminaMaximum > 0 &&
            (role === "GM" || !token.gmOnly || settings.showHealthBars),
          lightBackground: !token.gmOnly,
          segments:
            role === "PLAYER" && token.gmOnly && settings.showHealthBars
              ? settings.segmentsCount
              : 0,
          variant:
            role === "PLAYER" && token.gmOnly && settings.showHealthBars
              ? "short"
              : "full",
        },
      ],
      bubbles: [
        {
          color: "darkgoldenrod",
          value: token.surges,
          display: (role === "GM" || !token.gmOnly) && token.surges > 0,
        },
        {
          color: "cornflowerblue",
          value: token.heroicResource,
          display:
            (role === "GM" || !token.gmOnly) && token.heroicResource !== 0,
        },
        {
          color: "olivedrab",
          value: token.temporaryStamina,
          display:
            (role === "GM" || !token.gmOnly) && token.temporaryStamina > 0,
        },
      ],
      nameTags: [
        {
          text: token.name,
          display: settings.nameTagsEnabled && token.name !== "",
        },
      ],
    },
    image,
    dpi,
    settings,
  );
}
