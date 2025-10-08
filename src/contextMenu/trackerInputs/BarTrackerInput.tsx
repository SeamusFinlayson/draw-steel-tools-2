import { useState } from "react";
import InputBackground from "./InputBackground";
import type { InputColor } from "./InputColorTypes";
import FreeWheelInput from "../../components/logic/FreeWheelInput";
import { cn } from "../../helpers/utils";

export default function BarTrackerInput({
  parentValue,
  valueUpdateHandler,
  parentMax,
  maxUpdateHandler,
  color = "DEFAULT",
  label,
  labelTitle,
}: {
  parentValue: string;
  valueUpdateHandler: (target: HTMLInputElement) => void;
  parentMax: string;
  maxUpdateHandler: (target: HTMLInputElement) => void;
  color?: InputColor;
  label: string;
  labelTitle?: string;
}): React.JSX.Element {
  const [valueHasFocus, setValueHasFocus] = useState(false);
  const [maxHasFocus, setMaxHasFocus] = useState(false);

  return (
    <div className="group text-foreground w-full">
      <div title={labelTitle} className="grid grid-cols-2 pb-0.5">
        <div
          data-visible={
            !(valueHasFocus && parentValue !== "0") &&
            !(maxHasFocus && parentMax !== "0")
          }
          className="text-foreground col-span-2 col-start-1 row-start-1 block overflow-clip text-xs font-normal text-nowrap text-ellipsis opacity-0 transition-all duration-150 data-[visible=true]:opacity-100"
        >
          {label}
        </div>
        <div
          data-visible={valueHasFocus && parentValue !== "0"}
          className="text-foreground col-start-1 row-start-1 block text-center text-xs font-normal opacity-0 transition-all duration-150 data-[visible=true]:opacity-100"
        >
          {parentValue}
        </div>
        <div
          data-visible={maxHasFocus && parentMax !== "0"}
          className="text-foreground col-start-2 row-start-1 block text-center text-xs font-normal opacity-0 transition-all duration-150 data-[visible=true]:opacity-100"
        >
          {parentMax}
        </div>
      </div>

      <InputBackground color={color}>
        <div className="grid grid-cols-2 items-center">
          <FreeWheelInput
            onFocus={() => setValueHasFocus(true)}
            onBlur={() => setValueHasFocus(false)}
            value={parentValue}
            onUpdate={valueUpdateHandler}
            className={cn(
              "col-start-1 row-start-1 h-full w-full bg-transparent text-center outline-hidden",
            )}
            clearContentOnFocus
          />
          <div className="dark:text-text-secondary-dark pointer-events-none col-span-2 col-start-1 row-start-1 w-full text-center">
            /
          </div>
          <FreeWheelInput
            onFocus={() => setMaxHasFocus(true)}
            onBlur={() => setMaxHasFocus(false)}
            value={parentMax}
            onUpdate={maxUpdateHandler}
            className={cn(
              "col-start-2 row-start-1 h-full w-full bg-transparent text-center outline-hidden",
            )}
            clearContentOnFocus
          />
        </div>
      </InputBackground>
    </div>
  );
}
