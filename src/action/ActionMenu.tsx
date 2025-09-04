import { Settings2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

function ActionMenu() {
  return (
    <div className="flex h-screen flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Button>Accent</Button>
      <Button variant={"secondary"}>Secondary</Button>
      <Button variant={"ghost"}>Ghost</Button>
      <Button size={"icon"} variant={"ghost"}>
        <Settings2 className="shrink-0" />
      </Button>
      <Button variant={"outline"}>Outline</Button>
      <Input placeholder="Search" hasFocusHighlight />
    </div>
  );
}

export default ActionMenu;
