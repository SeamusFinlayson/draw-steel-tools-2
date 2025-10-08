import z from "zod";

export const githubTreeEntryZod = z.strictObject({
  path: z.string(),
  mode: z.string(),
  type: z.string(),
  sha: z.string(),
  url: z.string(),
  size: z.number().optional(),
});
export const githubTreeZod = z.array(githubTreeEntryZod);
