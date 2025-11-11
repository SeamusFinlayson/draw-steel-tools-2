import { Sparkles, XIcon } from "lucide-react";
import ValueButtonTrackerInput from "../trackerInputs/ValueButtonTrackerInput";

export default function NameInput({
  label = "Name",
  value,
  placeHolder,
  updateName,
  hideButton = false,
}: {
  label?: string;
  value: string;
  placeHolder: string;
  updateName: (name: string) => void;
  hideButton?: boolean;
}) {
  return (
    <ValueButtonTrackerInput
      label={label}
      parentValue={value}
      updateHandler={(target) => updateName(target.value)}
      inputProps={{
        className: "text-start pl-2",
        placeholder: placeHolder,
      }}
      clearInputOnFocus={false}
      {...(hideButton
        ? {}
        : {
            buttonProps:
              value.length === 0
                ? {
                    children: <Sparkles />,
                    onClick: () => updateName(placeHolder.trim()),
                  }
                : { children: <XIcon />, onClick: () => updateName("") },
          })}
    />
  );
}
