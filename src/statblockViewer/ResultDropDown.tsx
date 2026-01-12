import { ChevronDownIcon, LoaderCircleIcon } from "lucide-react";
import Button from "../components/ui/Button";
import { Badge } from "../components/ui/badge";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent } from "../components/ui/collapsible";
import { DiceRollResultViewer } from "../action/diceRoller/DiceRollResultViewer";
import type { Roll } from "../types/diceRollerTypes";

export function ResultDropDown({ result }: { result: Roll | undefined }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (result === undefined) setOpen(false);
  }, [result]);

  if (result === undefined) {
    return (
      <div className="border-mirage-300 p- flex h-[36px] w-full items-center justify-center gap-4 rounded-full border">
        <LoaderCircleIcon className="animate-spin text-black" />
        <div>Rolling Dice</div>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant={"outline"}
        className="flex w-full items-center justify-between pr-2.5 pl-0"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 px-1.5">
          <Badge className="bg-black text-sm" text={`Total: ${result.total}`} />
          <Badge className="bg-black text-sm" text={`Tier: ${result.tier}`} />
        </div>
        <ChevronDownIcon
          data-open={open}
          className="aspect-square shrink-0 transition-transform duration-300 data-[open=true]:rotate-180"
        />
      </Button>
      <Collapsible open={open}>
        <CollapsibleContent>
          <div className="pt-2">
            <div className="border-mirage-300 rounded-2xl border p-2">
              <DiceRollResultViewer result={result} />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
