import { cn } from "../../helpers/utils";

export function Badge({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-mirage-950/95 text-foreground-inverse dark:bg-mirage-50/95 dark:text-text-primary shrink-0 rounded-2xl px-2.5 py-0.5 text-sm font-semibold duration-200",
        className,
      )}
    >
      {text}
    </div>
  );
}
