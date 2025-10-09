import React, { useState } from "react";
import { Label } from "./Label";
import FreeWheelInput from "../../components/logic/FreeWheelInput";
import type { InputColor } from "./InputColorTypes";
import InputBackground from "./InputBackground";
import { cn } from "../../helpers/utils";

export default function ValueButtonTrackerInput({
  parentValue,
  color = "DEFAULT",
  updateHandler,
  buttonProps,
  inputProps,
  label,
  labelTitle,
}: {
  parentValue: number | string;
  color?: InputColor;
  updateHandler: (target: HTMLInputElement) => void;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  label: string;
  labelTitle?: string;
}): React.JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);

  const button = (
    <button
      {...buttonProps}
      className={cn(
        "hover:bg-foreground/7 focus-visible:bg-foreground/7 flex size-9 shrink-0 items-center justify-center outline-hidden transition-colors",
        buttonProps?.className,
      )}
    />
  );

  return (
    <div className="group text-foreground w-full">
      <div title={labelTitle}>
        <Label
          name={label}
          value={parentValue.toString()}
          showValue={
            typeof parentValue !== "string" && hasFocus && parentValue !== 0
          }
        />
      </div>

      <InputBackground className="w-full overflow-clip" color={color}>
        <div className="flex w-full">
          <FreeWheelInput
            {...inputProps}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            value={parentValue.toString()}
            onUpdate={updateHandler}
            clearContentOnFocus
            className={cn(
              "w-full bg-transparent text-center outline-hidden",
              inputProps?.className,
            )}
          />
          {buttonProps && button}
        </div>
      </InputBackground>
    </div>
  );
}
