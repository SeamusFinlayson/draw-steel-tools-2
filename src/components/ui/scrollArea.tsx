import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "../../helpers/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    noDarkMode?: boolean;
  }
>(({ className, children, noDarkMode = false, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar noDarkMode={noDarkMode} />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > & { noDarkMode?: boolean }
>(
  (
    { className, orientation = "vertical", noDarkMode = false, ...props },
    ref,
  ) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn("bg-mirage-200 relative flex-1 rounded-full", {
          "dark:bg-mirage-800": !noDarkMode,
        })}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  ),
);
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
