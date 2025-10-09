import { useEffect, useState } from "react";

import { useDebounceCallback } from "usehooks-ts";

export default function DebounceInput({
  value,
  onChange,
  duration,
  ...props
}: Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
  duration: number;
}) {
  const [internalValue, setInternalValue] = useState("");
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const debouncedOnChange = useDebounceCallback(onChange, duration);

  return (
    <input
      {...props}
      type="text"
      value={internalValue}
      onChange={(event) => {
        setInternalValue(event.target.value);
        debouncedOnChange(event.target.value);
      }}
    />
  );
}
