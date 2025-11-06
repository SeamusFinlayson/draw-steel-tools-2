import { Sparkles, XIcon } from "lucide-react";
import ValueButtonTrackerInput from "../trackerInputs/ValueButtonTrackerInput";

export default function NameInput({
  value,
  placeHolder,
  updateName,
}: {
  value: string;
  placeHolder: string;
  updateName: (name: string) => void;
}) {
  return (
    <ValueButtonTrackerInput
      label="Name"
      parentValue={value}
      updateHandler={(target) => updateName(target.value)}
      inputProps={{
        className: "text-start pl-2",
        placeholder: placeHolder,
      }}
      clearInputOnFocus={false}
      buttonProps={
        value.length === 0
          ? {
              children: <Sparkles />,
              onClick: () => updateName(placeHolder.trim()),
            }
          : { children: <XIcon />, onClick: () => updateName("") }
      }
    />
  );
}
