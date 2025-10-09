import { CheckIcon } from "lucide-react";

export function NoMonsterCard({
  onActionClick,
  icon = <CheckIcon />,
}: {
  onActionClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex w-full gap-1 overflow-clip rounded-2xl">
      <div className="bg-mirage-100 text-foreground-secondary dark:bg-mirage-900 flex grow items-center rounded-r-sm px-4 py-2 text-sm font-normal duration-150">
        <div className="text-foreground text-base font-semibold">{"None"}</div>
      </div>
      <button
        className="bg-mirage-100 hover:bg-mirage-200 dark:hover:bg-mirage-800 dark:bg-mirage-900 grid place-items-center rounded-l-sm p-4 text-start text-sm font-normal duration-150"
        onClick={onActionClick}
      >
        {icon}
      </button>
    </div>
  );
}
