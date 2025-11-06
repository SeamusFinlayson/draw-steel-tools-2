import type { Item } from "@owlbear-rodeo/sdk";
import type { DefinedCharacterTokenData } from "./tokenDataZod";

export type Token = DefinedCharacterTokenData & { item: Item };
