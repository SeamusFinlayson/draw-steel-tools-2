import OBR from "@owlbear-rodeo/sdk";
import type { localStorageKey } from "../types/localStorageKey";
import { getPluginId } from "./getPluginId";
import { useEffect } from "react";
import { getLocalStorageNumber } from "./localStorageHelpers";
import { handleRoundChangeEventMessage } from "./broadcastRoundImplementation";

export function useRoundMessageHandler() {
  useEffect(
    () =>
      handleRoundChangeEventMessage(async (data) => {
        if (data.roundNumber === null) return;

        const localRoundNumber = getLocalStorageNumber("roundNumber", 1);
        localStorage.setItem(
          "roundNumber" satisfies localStorageKey,
          data.roundNumber.toString(),
        );

        if (localRoundNumber >= data.roundNumber) return;
        if ((await OBR.player.getRole()) !== "GM") return;

        const themeMode = (await OBR.theme.getTheme()).mode;
        OBR.popover.open({
          id: getPluginId("resourceCalculator"),
          height: 400,
          width: 300,
          url: `/resourceCalculator?themeMode=${themeMode}`,
        });
      }),
    [],
  );
}
