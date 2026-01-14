import { useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { RoomTrackersContext } from "../context/RoomTrackersMetadataContext";
import Button from "../../components/ui/Button";
import { EqualIcon, MinusIcon } from "lucide-react";
import Input from "../../components/ui/Input";
import FreeWheelInput from "../../components/logic/FreeWheelInput";
import Label from "../../components/ui/Label";
import parseNumber from "../../helpers/parseNumber";
import { PopoverClose } from "@radix-ui/react-popover";

export function MaliceSpender({
  trigger,
  cost,
}: {
  trigger: React.ReactNode;
  cost: number;
}) {
  // TODO: this is unsafe, need ready checking
  const trackerMetadata = useContext(RoomTrackersContext);
  const malice = trackerMetadata?.malice ? trackerMetadata.malice : 0;

  const [configuredCost, setConfiguredCost] = useState(cost);

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent side="top" align="end" className="rounded-2xl">
        <div aria-label="open focus target" tabIndex={1} />
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="space-y-1">
              <Label className="w-full">Current</Label>

              <Input hasFocusHighlight className="w-16 text-center">
                <FreeWheelInput
                  clearContentOnFocus
                  value={malice.toString()}
                  onUpdate={() => {}}
                />
              </Input>
            </div>
            <MinusIcon className="h-9" />
            <div className="space-y-1">
              <Label className="center w-full">Cost</Label>

              <Input hasFocusHighlight className="w-16 text-center">
                <FreeWheelInput
                  clearContentOnFocus
                  value={configuredCost.toString()}
                  onUpdate={(target) =>
                    setConfiguredCost(
                      parseNumber(target.value, {
                        min: -999,
                        max: 999,
                        truncate: true,
                      }),
                    )
                  }
                />
              </Input>
            </div>
            <EqualIcon className="h-9" />
            <div className="self-end pb-1 text-lg">
              {malice - configuredCost}
            </div>
          </div>
          <PopoverClose asChild>
            <Button className="w-full">Spend</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
