import { useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  RoomTrackersContext,
  UpdateRoomTrackersContext,
} from "../context/RoomTrackersContext";
import Button from "../../components/ui/Button";
import { EqualIcon, MinusIcon } from "lucide-react";
import Input from "../../components/ui/Input";
import FreeWheelInput from "../../components/logic/FreeWheelInput";
import Label from "../../components/ui/Label";
import parseNumber from "../../helpers/parseNumber";
import { PopoverClose } from "@radix-ui/react-popover";
import { SetMaliceSpentContext } from "../context/MaliceSpentContext";
import { FeatureIdContext } from "../context/FeatureIdContext";

export function MaliceSpender({
  trigger,
  cost,
  align = "end",
  side = "top",
  alignOffset,
}: {
  trigger: React.ReactNode;
  cost: number;
  align?: "end" | "center" | "start" | undefined;
  side?: "top" | "right" | "bottom" | "left" | undefined;
  alignOffset?: number | undefined;
}) {
  // TODO: this is unsafe, need ready checking
  const trackerMetadata = useContext(RoomTrackersContext);
  const updateTrackerMetadata = useContext(UpdateRoomTrackersContext);
  const setMaliceSpent = useContext(SetMaliceSpentContext);
  const [configuredCost, setConfiguredCost] = useState(cost);

  const malice = trackerMetadata?.malice ? trackerMetadata.malice : 0;
  const newMalice = malice - configuredCost;
  const featureId = useContext(FeatureIdContext);

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        alignOffset={alignOffset}
        className="w-fit rounded-2xl"
      >
        <div aria-label="open focus target" tabIndex={1} />
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="space-y-1">
              <Label className="w-full">Current</Label>

              <Input hasFocusHighlight className="w-16 text-center">
                <FreeWheelInput
                  clearContentOnFocus
                  value={malice.toString()}
                  onUpdate={(target) =>
                    updateTrackerMetadata({
                      ...trackerMetadata,
                      malice: parseNumber(target.value, {
                        min: -999,
                        max: 999,
                        truncate: true,
                      }),
                    })
                  }
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
                        min: 0,
                        max: 99,
                        truncate: true,
                      }),
                    )
                  }
                />
              </Input>
            </div>
            <EqualIcon className="h-9" />
            <div className="bg-mirage-100 flex h-9 min-w-12 items-center justify-center self-end rounded-lg">
              {newMalice}
            </div>
          </div>
          <PopoverClose asChild>
            <Button
              className="w-full"
              onClick={() => {
                updateTrackerMetadata({
                  ...trackerMetadata,
                  malice: newMalice,
                });
                setMaliceSpent({ target: featureId, value: configuredCost });
              }}
            >
              Spend
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
