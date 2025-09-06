import DiceRoller from "./diceRoller/DiceRoller";
import ResourceTracker from "./resourceTracker/ResourceTracker";
import { useCallback, useState } from "react";
import * as DiceProtocol from "../diceProtocol";
import OBR from "@owlbear-rodeo/sdk";
import usePlayerName from "../helpers/usePlayerName";
import { useDiceRoller } from "../helpers/diceCommunicationHelpers";
import type { Roll, RollAttributes } from "../types/diceRollerTypes";
import { defaultRollerAttributes, powerRoll } from "./diceRoller/helpers";
import { Header } from "./header/Header";
import { ScrollArea } from "../components/ui/scrollArea";
import ActionHeightMatch from "./ActionHeightMatch";

function ActionMenu() {
  const playerName = usePlayerName();
  const [rollAttributes, setRollAttributes] = useState<RollAttributes>(
    defaultRollerAttributes,
  );
  const [diceResultViewerOpen, setDiceResultViewerOpen] = useState(false);
  const [result, setResult] = useState<Roll>();

  // External dice roller
  const handleRollResult = useCallback(
    (data: DiceProtocol.PowerRollResult) => {
      OBR.action.open();
      const rolls = data.result.map((val) => val.result);
      for (let i = 0; i < rolls.length; i++) {
        if (rolls[i] === 0) rolls[i] = 10;
      }

      setResult(
        powerRoll({
          bonus: data.rollProperties.bonus,
          hasSkill: data.rollProperties.hasSkill,
          netEdges: data.rollProperties.netEdges,
          playerName,
          rollMethod: "givenValues",
          dieValues: rolls,
          selectionStrategy:
            data.rollProperties.dice === "3d10kl2" ? "lowest" : "highest",
        }),
      );

      setRollAttributes({ ...defaultRollerAttributes });
    },
    [playerName],
  );
  const diceRoller = useDiceRoller({ onRollResult: handleRollResult });

  return (
    <div className="h-screen">
      <ScrollArea className="h-full" type="always">
        <ActionHeightMatch>
          <div className="text-foreground flex flex-col gap-4 pb-4">
            <Header
              diceRoller={diceRoller}
              setRollAttributes={setRollAttributes}
            />
            <ResourceTracker />
            <DiceRoller
              playerName={playerName}
              diceResultViewerOpen={diceResultViewerOpen}
              setDiceResultViewerOpen={setDiceResultViewerOpen}
              rollAttributes={rollAttributes}
              setRollAttributes={setRollAttributes}
              result={result}
              setResult={setResult}
              diceRoller={diceRoller}
            />
          </div>
        </ActionHeightMatch>
      </ScrollArea>
    </div>
  );
}

export default ActionMenu;
