import { branchName } from "./branchName";

export default function getStatblockUrl(path: string) {
  return `https://raw.githubusercontent.com/SeamusFinlayson/data-bestiary-json/${branchName}/${path}`;
}
