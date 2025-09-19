import React from "react";
import { cn } from "../../helpers/utils";

export default function GroupDropDown({
  content,
  hasFocus,
  className,
}: {
  content: string;
  hasFocus: boolean;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      className={cn(className, "rounded-b-sm text-xs transition-all", {
        "-translate-y-0 opacity-100": true,
        "pointer-events-none -translate-y-2 opacity-0":
          !hasFocus || content === "",
      })}
    >
      {content}
    </div>
  );
}
