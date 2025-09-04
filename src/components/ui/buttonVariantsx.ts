import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium transition-all ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-foreground focus-visible:ring-[2px]",
  {
    variants: {
      variant: {
        outline:
          "border hover:bg-mirage-100/80 dark:hover:bg-mirage-900/80 text-mirage-950 dark:text-mirage-50 border-mirage-950/30 dark:border-mirage-50/30",
        primary: "bg-accent text-accent-foreground  hover:bg-accent/90",
        secondary:
          "bg-mirage-100 text-mirage-950 hover:bg-mirage-100/80 dark:bg-mirage-900 dark:text-mirage-50 dark:hover:bg-mirage-900/80",
        ghost:
          "hover:bg-mirage-100/80 dark:hover:bg-mirage-900/80 text-mirage-950 dark:text-mirage-50",
      },
      size: {
        base: "h-9 px-4 py-2 rounded-[18px] active:rounded-[8px]",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 px-8 rounded-[20px] active:rounded-[8px]",
        icon: "h-10 w-10 rounded-[20px] active:rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
    },
  },
);
