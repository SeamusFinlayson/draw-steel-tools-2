export type SearchData = {
  value: string;
  filtersOpen: boolean;
  organizations: string[];
  roles: string[];
  keywords: string[];
  levelRange: number[];
  evRange: number[];
};

export const defaultSearchData = {
  value: "",
  filtersOpen: false,
  organizations: [],
  roles: [],
  keywords: [],
  levelRange: [1, 11],
  evRange: [0, 156],
};
