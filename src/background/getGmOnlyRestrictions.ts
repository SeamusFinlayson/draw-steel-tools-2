import type { KeyFilter } from "@owlbear-rodeo/sdk";
import { TOKEN_METADATA_KEY } from "../helpers/tokenHelpers";
import type { MinionGroup } from "../types/minionGroup";

export function getGmOnlyRestrictions(minionGroups: MinionGroup[]) {
  return minionGroups
    .filter((group) => group.gmOnly || group.gmOnly === undefined)
    .map(
      (group) =>
        ({
          key: ["metadata", TOKEN_METADATA_KEY, "groupId"],
          value: group.id,
          operator: "!=",
        }) satisfies KeyFilter,
    );
}
