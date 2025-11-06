import { BookLockIcon, BookOpenIcon } from "lucide-react";
import Toggle from "../../components/ui/Toggle";

export default function VisibilityToggle({
  value,
  onClick,
}: {
  value: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex w-full justify-center">
      <Toggle
        variant="ghost"
        className="w-full gap-x-2 bg-none font-normal data-[state=pressed]:bg-none"
        pressed={value}
        onClick={onClick}
      >
        <span>
          {value ? (
            <BookLockIcon className="size-5.5" />
          ) : (
            <BookOpenIcon className="size-5.5" />
          )}
        </span>
        <span>{value ? "Director Only" : "Shared"}</span>
      </Toggle>
    </div>
  );
}
