import { useState } from "react";
import type { IndexBundle } from "../types/monsterDataBundlesZod";
import { BrushCleaningIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import Button from "../components/ui/Button";
import Toggle from "../components/ui/Toggle";
import { ScrollArea } from "../components/ui/scrollArea";
import {
  defaultSearchData,
  type SearchData,
} from "../types/statblockSearchData";
import { FiltersDropdown } from "./FiltersDropdown";
import { DevActionButtons } from "./DevActionButtons";
import { StatblockSearchList } from "./StatblockSearchList";
import DebounceInput from "../components/logic/DebounceInput";
import type { AppState } from "../types/statblockLookupAppState";

const params = new URLSearchParams(document.location.search);
const devMode = params.get("dev");

export default function SearchView({
  monsterIndex,
  setAppState,
}: {
  monsterIndex: IndexBundle[];
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) {
  const [search, setSearch] = useState<SearchData>(defaultSearchData);

  const updateSearchValue = (value: string) =>
    setSearch({ ...search, value: value });

  return (
    <div className="flex grow flex-col">
      <div className="border-mirage-300 dark:border-mirage-700 flex h-14 shrink-0 items-center border-b">
        <div className="text-foreground grid aspect-square h-full shrink-0 place-items-center">
          <SearchIcon />
        </div>
        <DebounceInput
          className="h-full w-full outline-none"
          placeholder="Statblock"
          duration={300}
          value={search.value}
          onChange={(e) => updateSearchValue(e)}
        />
        <Toggle
          pressed={search.filtersOpen}
          onClick={() =>
            setSearch({ ...search, filtersOpen: !search.filtersOpen })
          }
          size={"icon"}
          variant={"default"}
          className="shrink-0 pointer-fine:w-8"
        >
          <div
            data-visible={
              search.organizations.length > 0 ||
              search.roles.length > 0 ||
              search.keywords.length > 0 ||
              !(
                search.levelRange.includes(1) && search.levelRange.includes(11)
              ) ||
              !(search.evRange.includes(0) && search.evRange.includes(156))
            }
            className="bg-accent pointer-events-none absolute size-3.5 translate-x-[15px] -translate-y-[15px] scale-0 rounded-full duration-100 ease-in data-[visible=true]:scale-100 pointer-fine:translate-x-[13px]"
          />
          <ListFilterIcon />
        </Toggle>
        <Button
          size={"icon"}
          className="mx-2 sm:w-20"
          variant={"secondary"}
          onClick={() => setSearch(defaultSearchData)}
        >
          <BrushCleaningIcon />
        </Button>
      </div>

      <ScrollArea className="grow basis-50">
        <div className="flex grow flex-col">
          {devMode === "true" && (
            <div className="p-4 sm:p-6">
              <DevActionButtons monsterIndex={monsterIndex} />
            </div>
          )}

          <>
            <FiltersDropdown
              search={search}
              setSearch={setSearch}
              monsterIndex={monsterIndex}
            />

            <StatblockSearchList
              search={search}
              setAppState={setAppState}
              monsterIndex={monsterIndex}
            />
          </>
        </div>
      </ScrollArea>
    </div>
  );
}
