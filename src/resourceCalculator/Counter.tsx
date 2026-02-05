import { ChevronLeft, ChevronRight } from "lucide-react";
import z from "zod";
import FreeWheelInput from "../components/logic/FreeWheelInput";
import Button from "../components/ui/Button";
import parseNumber from "../helpers/parseNumber";

export function Counter({
  value,
  setValue,
  min,
  label,
}: {
  value: number;
  setValue: (value: number) => void;
  min: number;
  label: string;
}) {
  return (
    <div className="flex w-fit gap-1">
      <Button
        variant={"secondary"}
        size={"sm"}
        className="flex w-8 items-center justify-center"
        aria-label={"decrement " + label}
        onClick={() => (value > min ? setValue(value - 1) : setValue(min))}
      >
        <ChevronLeft />
      </Button>
      <FreeWheelInput
        className="h-8 w-10 rounded-md text-center transition-colors outline-none hover:bg-black/5 focus:bg-black/10 dark:hover:bg-white/5 dark:focus:bg-white/10"
        aria-label={label}
        value={value.toString()}
        onUpdate={(target) => {
          const bonus = z.int().parse(
            parseNumber(target.value, {
              min: min,
              max: 99,
              truncate: true,
            }),
          );
          setValue(bonus);
        }}
        clearContentOnFocus
      />
      <Button
        size={"sm"}
        variant={"secondary"}
        className="flex w-8 items-center justify-center"
        aria-label={"increment " + label}
        onClick={() => setValue(value + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
