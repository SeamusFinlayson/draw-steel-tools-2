import parseNumber from "./parseNumber";
import { type localStorageKey } from "../types/localStorageKey";

export const getLocalStorageNumber = (
  keyName: localStorageKey,
  fallback = 0,
): number => {
  let value = localStorage.getItem(keyName);
  if (value === null) return fallback;
  return parseNumber(value, { fallback });
};
