import * as React from "react";
import { cn } from "../../helpers/utils";

function Textarea({
  className,
  hasFocusHighlight,
  ...props
}: React.ComponentProps<"textarea"> & {
  hasFocusHighlight?: boolean;
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-foreground/50 border-foreground/20 text-foreground flex min-h-[50px] min-w-0 rounded-[8px] border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors duration-75 outline-none file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        {
          "focus:border-accent focus-visible:ring-accent/50 focus-visible:ring-2":
            hasFocusHighlight,
        },
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
