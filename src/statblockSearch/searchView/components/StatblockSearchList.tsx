import fuzzysort from "fuzzysort";
import type { SearchData } from "../../../types/statblockSearchData";
import type {
  StatblockIndexBundle,
  TerrainIndexBundle,
} from "../../../types/monsterDataBundlesZod";
import { MonsterPreviewCard } from "../../components/MonsterPreviewCard";
import { getMonsterDataBundle } from "../../devScriptButtons/helpers/getMonsterDataBundle";
import type { AppState } from "../../../types/statblockLookupAppState";
import parseNumber from "../../../helpers/parseNumber";
import { NoMonsterCard } from "../../components/NoMonsterCard";

export function StatblockSearchList({
  search,
  setAppState,
  monsterIndex,
  playerRole,
}: {
  search: SearchData;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  monsterIndex: (StatblockIndexBundle | TerrainIndexBundle)[];
  playerRole: "PLAYER" | "GM";
}) {
  const sortedMonsterIndex =
    playerRole === "PLAYER"
      ? []
      : fuzzysort
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
                if (
                  item.type === "terrain" &&
                  search.organizations.includes("Terrain")
                )
                  return true;
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
                if (item.type === "terrain") return false;
                for (const str of item.ancestry) {
                  if (search.keywords.includes(str)) return true;
                }
                return false;
              }),
            {
              keys: [
                "name",
                (obj) =>
                  obj.type === "statblock"
                    ? obj.ancestry.join(" ")
                    : obj.type === "terrain"
                      ? "dynamic terrain"
                      : "",
                (obj) => obj.roles.join(" "),
              ],
              all: true,
              threshold: 0.3,
            },
          )
          .map((val) => val.obj);

  if (sortedMonsterIndex.length <= 0 && search.value !== "")
    return <div className="w-full items-center p-4">No Results</div>;

  return (
    <div className="grid h-full gap-3 p-4 md:grid-cols-2">
      {search.value === "" &&
        (search.organizations.length > 0
          ? search.organizations.some((val) =>
              ["Horde", "Platoon", "Elite", "Leader", "Solo"].includes(val),
            )
          : true) && (
          <NoMonsterCard
            variant="BASIC"
            onActionClick={() =>
              setAppState((prev) => ({
                ...prev,
                selectedIndexBundle: "NONE",
                setupOptions: {
                  type: "BASIC",
                  name: {
                    enabled: false,
                    value: "Monster",
                    nameTag: false,
                  },
                  stamina: { enabled: false, value: 0 },
                },
              }))
            }
          />
        )}
      {search.value === "" &&
        (search.organizations.length > 0
          ? search.organizations.includes("Minion")
          : true) && (
          <NoMonsterCard
            variant="MINION"
            onActionClick={() =>
              setAppState((prev) => ({
                ...prev,
                selectedIndexBundle: "NONE",
                setupOptions: {
                  type: "MINION",
                  groupName: { value: "Minion", nameTags: false },
                  stamina: { value: 1 },
                },
              }))
            }
          />
        )}
      {search.value === "" &&
        (search.organizations.length > 0
          ? search.organizations.includes("Terrain")
          : true) && (
          <NoMonsterCard
            variant="TERRAIN"
            onActionClick={() =>
              setAppState((prev) => ({
                ...prev,
                selectedIndexBundle: "NONE",
                setupOptions: {
                  type: "TERRAIN",
                  name: { enabled: false, value: "Terrain", nameTag: false },
                  stamina: { enabled: false, value: 0 },
                },
              }))
            }
          />
        )}
      {sortedMonsterIndex.map((indexBundle) => (
        <MonsterPreviewCard
          key={indexBundle.id}
          indexBundle={indexBundle}
          onCardClick={async () => {
            setAppState((prev) => ({
              ...prev,
              monsterViewerOpen: true,
              previewIndexBundle: indexBundle,
            }));
          }}
          onActionClick={async () => {
            setAppState((prev) => ({
              ...prev,
              selectedIndexBundle: indexBundle,
            }));
            const resource = (await getMonsterDataBundle(indexBundle)).resource;
            if (resource.type === "featureblock")
              throw new Error("Feature block not implemented.");
            const stamina = parseNumber(resource.stamina, {
              truncate: true,
            });
            const monsterName = resource.name;
            const isMinion =
              resource.type === "statblock" &&
              resource.roles.join().toLowerCase().includes("minion");
            setAppState((prev) => ({
              ...prev,
              previewIndexBundle: indexBundle,
              selectedIndexBundle: indexBundle,
              setupOptions: isMinion
                ? {
                    type: "MINION",
                    groupName: {
                      value: monsterName,
                      nameTags: false,
                    },
                    stamina: { value: stamina },
                  }
                : {
                    type: resource.type === "statblock" ? "BASIC" : "TERRAIN",
                    name: {
                      enabled: true,
                      value: monsterName,
                      nameTag: false,
                    },
                    stamina: { enabled: true, value: stamina },
                  },
            }));
          }}
        />
      ))}
    </div>
  );
}
