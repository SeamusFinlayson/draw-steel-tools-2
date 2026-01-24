import React, { useState, type Ref } from "react";
import { Label } from "./Label";
import FreeWheelInput from "../../components/logic/FreeWheelInput";
import type { InputColor } from "./InputColorTypes";
import InputBackground from "./InputBackground";
import { cn } from "../../helpers/utils";

export default function ValueButtonTrackerInput({
  ref,
  parentValue,
  color = "DEFAULT",
  updateHandler,
  buttonProps,
  inputProps,
  label,
  labelTitle,
  clearInputOnFocus = true,
  backgroundProps,
}: {
  ref?: Ref<HTMLInputElement>;
  parentValue: number | string;
  color?: InputColor;
  updateHandler: (target: HTMLInputElement) => void;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  label: string;
  labelTitle?: string;
  clearInputOnFocus?: boolean;
  backgroundProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
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
        <div
          {...backgroundProps}
          className={cn("flex w-full", backgroundProps?.className)}
        >
          <FreeWheelInput
            {...inputProps}
            ref={ref}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            value={parentValue.toString()}
            onUpdate={updateHandler}
            clearContentOnFocus={clearInputOnFocus}
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
