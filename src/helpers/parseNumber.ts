export default function parseNumber(
  string: string,
  options?: {
    fallback?: number;
    min?: number;
    max?: number;
    truncate?: boolean;
    inlineMath?: { previousValue: number };
  },
) {
  let doInlineMath = options?.inlineMath !== undefined;
  if (doInlineMath) {
    string = string.trim();
    if (string.startsWith("=")) {
      string = string.substring(1).trim();
      doInlineMath = false;
    }
  }

  let newValue = parseFloat(string);
  if (Number.isNaN(newValue)) return options?.fallback ? options.fallback : 0;

  if (
    doInlineMath &&
    options?.inlineMath &&
    (string.startsWith("+") || string.startsWith("-"))
  ) {
    newValue = options.inlineMath.previousValue + newValue;
  }

  if (options?.min && newValue < options?.min) newValue = options.min;
  if (options?.max && newValue > options?.max) newValue = options.max;
  if (options?.truncate) newValue = Math.trunc(newValue);

  return newValue;
}
