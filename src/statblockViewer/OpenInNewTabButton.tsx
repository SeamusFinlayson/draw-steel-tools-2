import { ExternalLinkIcon } from "lucide-react";
import Button from "../components/ui/Button";

export function OpenInNewTab({ resourceId }: { resourceId?: string }) {
  if (!resourceId) return <></>;

  const url = new URL("/statblockViewer", window.location.origin);
  url.searchParams.set("resourceId", resourceId);
  url.searchParams.delete("obrref");

  return (
    <Button variant={"secondary"} size={"icon"} className="grow" asChild>
      <a href={url.toString()} target="_blank" rel="noopener noreferrer">
        <ExternalLinkIcon />
      </a>
    </Button>
  );
}
