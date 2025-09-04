import { useEffect, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onUpdate: (target: HTMLInputElement) => void;
  ref?: React.Ref<HTMLInputElement> | undefined;
  clearContentOnFocus?: boolean;
}

/** Input with on confirm method that encapsulates the logic for stat inputs in the context menu */
export default function FreeWheelInput({
  value,
  onUpdate,
  className,
  ref,
  clearContentOnFocus = false,
  ...inputProps
}: InputProps): React.JSX.Element {
  const [inputContent, setInputContent] = useState<string>(value);

  // Update inputContent when the value state changes in parent
  const [inputContentUpdateFlag, setInputContentUpdateFlag] = useState(false);
  if (inputContentUpdateFlag) {
    setInputContent(value);
    setInputContentUpdateFlag(false);
  }
  useEffect(() => setInputContentUpdateFlag(true), [value]);

  const resetInputContent = () => setInputContent(value);

  // Blur but ignore user changes
  let ignoreBlur = false;
  const blurWithoutUpdate = (
    e:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    ignoreBlur = true;
    (e.target as HTMLInputElement).blur();
    ignoreBlur = false;
  };

  // Run on user confirm handler
  const runOnConfirm = (
    e:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    onUpdate(e.target as HTMLInputElement);
    setInputContentUpdateFlag(true);
  };

  return (
    <input
      {...inputProps}
      ref={ref}
      value={inputContent}
      onChange={(e) => {
        if (inputProps.onChange) inputProps.onChange(e);
        setInputContent(e.target.value);
      }}
      onBlur={(e) => {
        if (inputProps.onBlur) inputProps.onBlur(e);
        if (!ignoreBlur) {
          if (clearContentOnFocus && inputContent === "") resetInputContent();
          else runOnConfirm(e);
        }
      }}
      onKeyDown={(e) => {
        if (inputProps.onKeyDown) inputProps.onKeyDown(e);
        if (e.key === "Enter") {
          blurWithoutUpdate(e);
          runOnConfirm(e);
        } else if (e.key === "Escape") {
          blurWithoutUpdate(e);
          resetInputContent();
        }
      }}
      onFocus={(e) => {
        if (inputProps.onFocus) inputProps.onFocus(e);
        if (clearContentOnFocus) setInputContent("");
      }}
      className={className}
      autoComplete="off"
      spellCheck="false"
    />
  );
}
