"use client";

import * as React from "react";
import { cn } from "../../helpers/utils";
import * as SwitchPrimitive from "@radix-ui/react-switch";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group data-[state=checked]:bg-accent data-[state=unchecked]:border-foreground/20 relative flex h-[28px] w-[48px] cursor-default items-center rounded-full border border-transparent bg-black/7 duration-150 dark:bg-black/20",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-foreground-secondary data-[state=checked]:bg-accent-foreground grid size-[16px] translate-x-[5px] place-items-center rounded-full transition-all duration-150 ease-out will-change-transform data-[state=checked]:translate-x-[25px] data-[state=checked]:scale-125 data-[state=checked]:ease-in"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
