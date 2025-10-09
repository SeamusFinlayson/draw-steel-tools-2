import { type Metadata } from "@owlbear-rodeo/sdk";
import { parseMetadata } from "./parseMetadata";
import { getPluginId } from "./getPluginId";
import {
  CharacterTokenDataZod,
  type DefinedCharacterTokenData,
  type DefinedHeroTokenData,
  type DefinedMonsterTokenData,
} from "../types/tokenDataZod";

export const TOKEN_METADATA_KEY = getPluginId("metadata");

export const defaultMonsterTokenData: DefinedMonsterTokenData = {
  type: "MONSTER",
  name: "",
  gmOnly: true,
  stamina: 0,
  staminaMaximum: 0,
  temporaryStamina: 0,
  statblockName: "",
};

export const defaultHeroTokenData: DefinedHeroTokenData = {
  type: "HERO",
  name: "",
  gmOnly: false,
  stamina: 0,
  staminaMaximum: 0,
  temporaryStamina: 0,
  heroicResource: 0,
  recoveries: 0,
  surges: 0,
};

export function parseTokenData(metadata: Metadata): DefinedCharacterTokenData {
  const characterData = parseMetadata(
    metadata,
    TOKEN_METADATA_KEY,
    CharacterTokenDataZod.parse,
  );
  if (characterData?.type === "MONSTER") {
    return { ...defaultMonsterTokenData, ...characterData };
  }
  return { ...defaultHeroTokenData, ...characterData };
}
