import { useState } from "react";
import { Label } from "./Label";
import InputBackground from "./InputBackground";
import type { InputColor } from "./InputColorTypes";
import { MinusIcon, PlusIcon } from "lucide-react";
import FreeWheelInput from "../../components/logic/FreeWheelInput";
import { cn } from "../../helpers/utils";

export default function CounterTracker({
  parentValue,
  color = "DEFAULT",
  updateHandler,
  incrementHandler,
  decrementHandler,
  label,
}: {
  parentValue: number;
  color?: InputColor;
  updateHandler: (target: HTMLInputElement) => void;
  incrementHandler: () => void;
  decrementHandler: () => void;
  label: string;
}): React.JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <div className="group text-foreground w-full">
      <Label
        name={label}
        value={parentValue.toString()}
        showValue={hasFocus && parentValue !== 0}
      />

      <InputBackground className="overflow-clip" color={color}>
        <div className="flex">
          <button
            className="hover:bg-foreground/7 focus-visible:bg-foreground/7 flex h-full w-9 shrink-0 items-center justify-center outline-hidden transition-colors"
            onClick={decrementHandler}
          >
            <MinusIcon />
          </button>
          <FreeWheelInput
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            value={parentValue.toString()}
            onUpdate={updateHandler}
            clearContentOnFocus
            className={cn("w-full bg-transparent text-center outline-hidden")}
          />
          <button
            className="hover:bg-foreground/7 focus-visible:bg-foreground/7 flex h-full w-9 shrink-0 items-center justify-center outline-hidden transition-colors"
            onClick={incrementHandler}
          >
            <PlusIcon />
          </button>
        </div>
      </InputBackground>
    </div>
  );
}
