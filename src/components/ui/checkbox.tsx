"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

function Checkbox({
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const [hasHover, setHasHover] = React.useState(false);

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-has-hover={hasHover}
      onMouseEnter={() => setHasHover(true)}
      onMouseLeave={() => setHasHover(false)}
      className={
        "peer group focus-visible:bg-foreground/7 pointer-fine:data-[has-hover=true]:bg-foreground/7 aspect-square shrink-0 rounded-full p-[11px] duration-150 outline-none"
      }
      {...props}
    >
      <div className="border-foreground group-data-[state=checked]:border-accent group-data-[state=checked]:bg-accent grid aspect-square size-[20px] shrink-0 place-items-center rounded-[4px] border-2">
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="bg-foreground/20 relative flex size-0 items-center justify-center duration-150"
        >
          <CheckIcon className="text-mirage-99 dark:text-mirage-901 size-4 shrink-0 stroke-3" />
        </CheckboxPrimitive.Indicator>
      </div>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
