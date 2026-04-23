import definitions from "../../rulesReference/definitions.json";

export const potencyRegex = /([MAIRP][ ][<][ ][-]?[\d])+/g;

export const characteristicTestRegex =
  /((?:Might|Agility|Intuition|Reason|Presence)(?: test)(?!s))+/g;

export const rollRegex = /((?:\d+)?(?:d\d+)(?:\s*\+\s*\d+)?)+/g;

const buildDefinitionsRegex = (tags: string[]) => {
  let regex = "";
  definitions
    .filter((definition) => definition.tags.some((val) => tags.includes(val)))
    .forEach((definition) => {
      if (definition.regex) regex += definition.regex + "|";
      else definition.match.forEach((val) => (regex += val + "|"));
    });
  regex = regex.substring(0, regex.length - 1);
  return new RegExp(`(${regex})`, "gi");
};

export const generalDefinitionsRegex = buildDefinitionsRegex([
  "condition",
  "combat",
  "area",
]);
export const abilityKeywordsRegex = buildDefinitionsRegex(["ability_keywords"]);
export const distancesRegex = buildDefinitionsRegex(["area", "distance"]);
