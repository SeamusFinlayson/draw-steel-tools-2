import { PlugZap, Settings2, UnplugIcon } from "lucide-react";
import ConnectedDiceIcon from "../../components/icons/ConnectedDiceIcon";
import Button from "../../components/ui/Button";
import usePlayerRole from "../../helpers/usePlayerRole";
import type { DiceRoller, RollAttributes } from "../../types/diceRollerTypes";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import SideBarMenu from "./SideBarMenu";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../helpers/getPluginId";

export function Header({
  setRollAttributes: setRollAttributes,
  diceRoller,
}: {
  setRollAttributes: React.Dispatch<React.SetStateAction<RollAttributes>>;
  diceRoller: DiceRoller;
}) {
  const playerRole = usePlayerRole();
  const [noDiceRollersFound, setNoDiceRollersFound] = useState(true);
  useEffect(() => {
    if (diceRoller.config) setNoDiceRollersFound(false);
  }, [diceRoller]);

  return (
    <div className="flex h-14 items-center gap-2 px-4">
      <h1 className="w-full text-lg font-bold">Draw Steel Tools</h1>

      <div className="flex gap-2">
        {noDiceRollersFound ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant={"ghost"} size={"icon"}>
                <a
                  href="https://seamus-finlayson.ca/pages/connected-dice"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ConnectedDiceIcon className="stroke-black dark:stroke-white" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Get Connected Dice</TooltipContent>
          </Tooltip>
        ) : diceRoller.config === undefined ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  diceRoller.connect();
                }}
                variant={"ghost"}
                size={"icon"}
              >
                <PlugZap />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Connect Dice Roller</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  diceRoller.disconnect();
                  setRollAttributes((prev) => ({
                    ...prev,
                    style: undefined,
                  }));
                }}
                variant={"ghost"}
                size={"icon"}
              >
                <UnplugIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Disconnect Dice Roller
            </TooltipContent>
          </Tooltip>
        )}

        <SideBarMenu>
          {playerRole === "GM" && (
            <Button
              variant={"ghost"}
              className="h-10 w-full items-center justify-start gap-4 rounded-none px-4"
              onClick={async () => {
                const themeMode = (await OBR.theme.getTheme()).mode;
                OBR.popover.open({
                  id: getPluginId("settings"),
                  url: `/settings?themeMode=${themeMode}`,
                  height: 400,
                  width: 500,
                  hidePaper: false,
                });
              }}
            >
              <div className="place-items- grid size-6">
                <Settings2 />
              </div>
              <div>Settings</div>
            </Button>
          )}
        </SideBarMenu>
      </div>
    </div>
  );
}
