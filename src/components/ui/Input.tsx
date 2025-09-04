import * as React from "react";
import { cn } from "../../helpers/utils";

export default function Input({
  className,
  type,
  hasFocusHighlight,
  ...props
}: { hasFocusHighlight?: boolean } & React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-foreground/50 selection:bg-primary selection:text-foreground ring-mirage-950/20 dark:ring-mirage-50/20 text-foreground flex h-9 w-full min-w-0 rounded-[8px] bg-transparent px-3 py-1 text-base shadow-xs ring transition-[color,box-shadow] duration-75 outline-none file:inline-flex file:h-7 file:bg-transparent file:text-sm file:font-medium file:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        { "focus:ring-accent focus:ring-2": hasFocusHighlight },
        className,
      )}
      {...props}
    />
  );
}
