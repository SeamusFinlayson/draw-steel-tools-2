import fuzzysort from "fuzzysort";
import type { SearchData } from "../../types/statblockSearchData";
import type { IndexBundle } from "../../types/monsterDataBundlesZod";
import { MonsterPreviewCard } from "./MonsterPreviewCard";
import { getMonsterDataBundle } from "../helpers/getMonsterDataBundle";
import type { AppState } from "../../types/statblockLookupAppState";
import parseNumber from "../../helpers/parseNumber";
import { NoMonsterCard } from "./NoMonsterCard";

const params = new URLSearchParams(document.location.search);
const showNone = params.get("showNone");

export function StatblockSearchList({
  search,
  setAppState,
  monsterIndex,
}: {
  search: SearchData;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  monsterIndex: IndexBundle[];
}) {
  const sortedMonsterIndex = fuzzysort
    .go(
      search.value,
      monsterIndex
        .filter((item) => {
          if (item.level < Math.min(...search.levelRange)) return false;
          if (item.level > Math.max(...search.levelRange)) return false;
          return true;
        })
        .filter((item) => {
          let ev = parseFloat(item.ev);
          if (Number.isNaN(ev)) ev = 0;
          if (ev < Math.min(...search.evRange)) return false;
          if (ev > Math.max(...search.evRange)) return false;
          return true;
        })
        .filter((item) => {
          if (search.organizations.length <= 0) return true;
          for (const str of item.roles) {
            if (search.organizations.includes(str)) return true;
          }
          return false;
        })
        .filter((item) => {
          if (search.roles.length <= 0) return true;
          for (const str of item.roles) {
            if (search.roles.includes(str)) return true;
          }
          return false;
        })
        .filter((item) => {
          if (search.keywords.length <= 0) return true;
          for (const str of item.ancestry) {
            if (search.keywords.includes(str)) return true;
          }
          return false;
        }),
      {
        keys: [
          "name",
          (obj) => obj.ancestry.join(" "),
          (obj) => obj.roles.join(" "),
        ],
        all: true,
        threshold: 0.3,
      },
    )
    .map((val) => val.obj);

  if (sortedMonsterIndex.length <= 0)
    return <div className="w-full items-center p-4 sm:p-6">No Results</div>;

  return (
    <div className="grid h-full gap-3 p-4 sm:p-6 lg:grid-cols-2">
      {search.value === "" && showNone === "true" && (
        <NoMonsterCard
          onActionClick={() =>
            setAppState((prev) => ({
              ...prev,
              selectedIndexBundle: "NONE",
              tokenOptions: {
                name: {
                  overwriteTokens: false,
                  value: "Monster",
                  nameTag: false,
                },
                stamina: { overwriteTokens: false, value: 0 },
                removeExistingStatblock: { showOption: true, value: false },
              },
            }))
          }
        />
      )}
      {sortedMonsterIndex.map((indexBundle) => (
        <MonsterPreviewCard
          key={indexBundle.statblock}
          indexBundle={indexBundle}
          onCardClick={async () => {
            setAppState((prev) => ({
              ...prev,
              monsterViewerOpen: true,
              monsterViewerData: undefined,
            }));
            const monsterViewerData = await getMonsterDataBundle(indexBundle);
            setAppState((prev) => ({ ...prev, monsterViewerData }));
          }}
          onActionClick={async () => {
            setAppState((prev) => ({
              ...prev,
              selectedIndexBundle: indexBundle,
            }));
            const monsterData = await getMonsterDataBundle(indexBundle);
            const stamina = parseNumber(monsterData.statblock.stamina, {
              truncate: true,
            });
            setAppState((prev) => ({
              ...prev,
              monsterViewerData: monsterData,
              tokenOptions: {
                name: {
                  overwriteTokens: true,
                  value: monsterData.statblock.name,
                  nameTag: false,
                },
                stamina: { overwriteTokens: true, value: stamina },
                removeExistingStatblock: { showOption: false, value: false },
              },
            }));
          }}
        />
      ))}
    </div>
  );
}
