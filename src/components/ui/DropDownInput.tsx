import { useState } from "react";
import FreeWheelInput from "../logic/FreeWheelInput";
import Input from "./Input";
import Label from "./Label";
import GroupDropDown from "./UnderlineDropDown";
import { cn } from "../../helpers/utils";

export function DropDownInput({
  label,
  value,
  disabled,
  onUpdate,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onUpdate: (target: HTMLInputElement) => void;
}) {
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <div>
      <Label className={cn({ "opacity-50": disabled })} variant="small">
        {label}
      </Label>
      <Input>
        <FreeWheelInput
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          disabled={disabled}
          value={value}
          onUpdate={onUpdate}
          clearContentOnFocus
        />
      </Input>
      <GroupDropDown
        className="mt-1 border-l border-transparent px-3"
        content={value}
        hasFocus={hasFocus}
      />
    </div>
  );
}
