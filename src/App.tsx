import { Settings2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
  return (
    <div className="">
      <div className="bg-mirage-50 dark:bg-mirage-950 grid h-screen gap-2 p-4">
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
    </div>
  );
}

export default App;
