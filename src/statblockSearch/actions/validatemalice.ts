import { DrawSteelFeatureBlockZod } from "../../types/DrawSteelZod";
import type { PathBundle } from "../../types/monsterDataBundlesZod";
import fetchTypedData from "../helpers/getTypedData";
import getUrl from "../helpers/getUrl";

export async function validateMalice(
  pathBundles: PathBundle[],
  handleBadStatblocks?: (urls: string[]) => void,
) {
  const badStatblocks: {
    file: string;
    errors: unknown;
  }[] = [];
  await Promise.all(
    pathBundles
      .map((val) => val.features)
      .map(async (features) => {
        const maliceUrls = features.map((item) => getUrl(item));
        await Promise.all(
          maliceUrls.map(async (url) => {
            await fetchTypedData(url, (value) => {
              const result = DrawSteelFeatureBlockZod.safeParse(value);
              if (!result.success) {
                badStatblocks.push({
                  file: url,
                  errors: result.error,
                });
              }
            });
          }),
        );
      }),
  );

  const noRepeats = [...new Set(badStatblocks)];
  if (noRepeats.length > 0) console.error(noRepeats);
  else console.log("All malice pass validation");
  if (handleBadStatblocks) {
    handleBadStatblocks([...noRepeats].map((val) => val.file));
  }

  alert("Check console for audit details");
}
