import { DrawSteelStatblockZod } from "../../types/DrawSteelZod";
import type { PathBundle } from "../../types/monsterDataBundlesZod";
import getStatblockUrl from "../helpers/getStatblockUrl";

export async function validateStatblocks(pathBundles: PathBundle[]) {
  const badStatblocks: { file: string; errors: unknown }[] = [];
  await Promise.all(
    pathBundles.map(async (bundle) => {
      // Get
      const response = await fetch(getStatblockUrl(bundle.statblock));
      const json = await response.json();

      // Validate
      const result = DrawSteelStatblockZod.safeParse(json);
      if (!result.success) {
        badStatblocks.push({
          file: bundle.statblock,
          errors: result.error,
        });
      }
    }),
  );

  if (badStatblocks.length > 0) console.error(badStatblocks);
  else console.log("All statblock pass validation");

  alert("Check console for audit details");
}
