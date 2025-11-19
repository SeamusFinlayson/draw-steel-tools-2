import { ExternalLinkIcon } from "lucide-react";
import Button from "../components/ui/Button";

export function OpenInNewTab({ statblockName }: { statblockName?: string }) {
  if (!statblockName) return <></>;

  const url = new URL("/statblockViewer", window.location.origin);
  url.searchParams.set("statblockName", statblockName);
  url.searchParams.delete("obrref");

  return (
    <Button variant={"secondary"} size={"icon"} className="grow" asChild>
      <a href={url.toString()} target="_blank" rel="noopener noreferrer">
        <ExternalLinkIcon />
      </a>
    </Button>
  );
}
