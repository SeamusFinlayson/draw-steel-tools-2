import { DrawSteelDynamicTerrainZod } from "../../types/DrawSteelZod";
import { githubTreeZod } from "../../types/githubZod";
import getGitTreeUrl from "../helpers/getGitTreeUrl";
import getBestiaryUrl from "../helpers/getBestiaryUrl";
import { DynamicTerrainIndexBundleZod } from "../../types/monsterDataBundlesZod";

export async function generateDynamicTerrainIndex() {
  // Get File structure
  const getGithubTree = async (url: string, recursive = false) => {
    const request = await fetch(url + (recursive ? "?recursive=1" : ""));
    const json = await request.json();
    const tree = githubTreeZod.parse(json.tree);
    return tree;
  };
  const rootTree = await getGithubTree(getGitTreeUrl());

  // Get immediate subdirectories of the monster folder
  const groups = rootTree.filter(
    (item) =>
      item.path.startsWith("Dynamic Terrain/") &&
      item.path.match(/\//g)?.length === 1,
  );

  // In the order of the subdirectories create bundles of monster statblocks and relevant features
  const pathBundles: {
    dynamicTerrain: string;
  }[] = [];
  for (let i = 0; i < groups.length; i++) {
    pathBundles.push(
      ...rootTree
        .filter(
          (val) =>
            val.path.startsWith(groups[i].path) && val.path.endsWith(".json"),
        )
        .map((val) => ({
          dynamicTerrain: val.path,
        })),
    );
  }

  // Add data from each monster statblock to index
  const indexBundles = await Promise.all(
    pathBundles.map(async (pathBundle) => {
      // Get
      const response = await fetch(getBestiaryUrl(pathBundle.dynamicTerrain));
      const unvalidatedJson = await response.json();
      const parseResult = DrawSteelDynamicTerrainZod.safeParse(unvalidatedJson); // (await response.json()) as DrawSteelStatblock;

      if (!parseResult.success) {
        console.error(parseResult.error, "Retrieved data", unvalidatedJson);
        throw new Error("Parsing error. See above for details.");
        return;
      }

      const json = parseResult.data;

      // Format
      const indexBundle = {
        ...pathBundle,
        name: json.name,
        ev: json.ev,
        level: json.level,
      };

      // Validate
      return DynamicTerrainIndexBundleZod.parse(indexBundle);
    }),
  );

  console.log(indexBundles);

  // Convert the JSON data to a string
  const json = JSON.stringify(indexBundles);

  // Create a new Blob object with the JSON data and set its type
  const blob = new Blob([json], { type: "application/json" });

  // Create a temporary URL for the file
  const url = URL.createObjectURL(blob);

  console.log("Index Generation Done");

  return { href: url, download: "terrainIndex" };
}
