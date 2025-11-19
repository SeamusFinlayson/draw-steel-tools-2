import { CheckIcon } from "lucide-react";
import type { IndexBundle } from "../../types/monsterDataBundlesZod";
import type React from "react";

export function MonsterPreviewCard({
  indexBundle,
  onCardClick,
  onActionClick,
  icon = <CheckIcon />,
}: {
  indexBundle: IndexBundle;
  onCardClick?: () => void;
  onActionClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex w-full gap-1 overflow-clip rounded-2xl">
      <button
        className="bg-mirage-100 hover:bg-mirage-200 focus-visible:bg-mirage-200 dark:focus-visible:bg-mirage-800 dark:hover:bg-mirage-800 text-foreground-secondary dark:bg-mirage-900 block grow rounded-r-sm px-4 py-2 text-start text-sm font-normal duration-150 outline-none"
        onClick={onCardClick}
      >
        <div className="text-foreground text-base font-semibold">
          {indexBundle.name}
        </div>
        <div>{indexBundle.ancestry.join(", ")}</div>
        <div>{`Level ${indexBundle.level} ${indexBundle.roles.join(" ")}`}</div>
        <div>{`EV ${indexBundle.ev}`}</div>
      </button>
      {onActionClick && (
        <button
          onClick={onActionClick}
          className="bg-mirage-100 hover:bg-mirage-200 dark:hover:bg-mirage-800 focus-visible:bg-mirage-200 dark:focus-visible:bg-mirage-800 dark:bg-mirage-900 grid place-items-center rounded-l-sm p-4 text-start text-sm font-normal duration-150 outline-none"
        >
          {icon}
        </button>
      )}
    </div>
  );
}
