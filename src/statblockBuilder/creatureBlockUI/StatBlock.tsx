import { cn } from "../../helpers/utils";
import type { DrawSteelStatblock } from "../../types/DrawSteelZod";
import { Characteristics } from "./Characteristics";
import { Feature } from "./Feature";
import { Input } from "./Input";

export function StatBlock({ statblock }: { statblock: DrawSteelStatblock }) {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <div
        className={cn(
          "space-y-1 rounded-md border-zinc-950 bg-gradient-to-b from-neutral-400/60 to-neutral-300/50 p-2",
          {
            "from-[#e9db7d] to-[#e9db7d]/50":
              statblock.roles[0].includes("Ambusher"),
            "from-[#ccc3d0] to-[#ccc3d0]/50":
              statblock.roles[0].includes("Artillery"),
            "from-[#96b2df] to-[#96b2df]/50":
              statblock.roles[0].includes("Brute"),
            "from-[#f49392] to-[#f49392]/50":
              statblock.roles[0].includes("Controller"),
            "from-[#cac0a3] to-[#cac0a3]/50":
              statblock.roles[0].includes("Defender"),
            "from-[#eac1c0] to-[#eac1c0]/50":
              statblock.roles[0].includes("Harrier"),
            "from-[#d8e0c2] to-[#d8e0c2]/50":
              statblock.roles[0].includes("Hexer"),
            "from-[#b5dae3] to-[#b5dae3]/50":
              statblock.roles[0].includes("Mount"),
            "from-[#f0dacc] to-[#f0dacc]/50":
              statblock.roles[0].includes("Support"),
          },
        )}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-nowrap">
          <Input
            className="grow text-base font-black"
            placeholder="Name"
            value={statblock.name}
          />
          <div className="flex items-center justify-end gap-1 text-right">
            <div>Level</div>
            <Input
              className="w-10 text-center"
              placeholder="#"
              value={statblock.level.toString()}
            />
            <Input
              className="w-26"
              placeholder="Organization"
              value={statblock.roles
                .toString()
                .substring(0, statblock.roles.toString().indexOf(" "))}
            />
            <Input
              className="w-24"
              placeholder="Role"
              value={statblock.roles
                .toString()
                .substring(statblock.roles.toString().indexOf(" "))}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-nowrap">
          <Input
            className="grow"
            placeholder="Ancestry"
            value={statblock.ancestry.join(", ")}
          />

          <div className="flex items-center gap-1">
            <div className="text-right">EV</div>
            <Input
              className="w-12 text-center"
              placeholder="#"
              value={statblock.ev}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 px-2">
        <div className="flex flex-wrap justify-between gap-1.5">
          {[
            { label: "Size", value: statblock.size },
            { label: "Speed", value: statblock.speed },
            { label: "Stamina", value: statblock.stamina },
            { label: "Stability", value: statblock.stability },
            { label: "Free Strike", value: statblock.free_strike },
          ].map((item) => (
            <div
              className="flex min-w-16 flex-1 flex-col items-center gap-0.5"
              key={item.label}
            >
              <Input
                className="w-12 text-center"
                value={item.value.toString()}
              />

              <div className="font-bold text-nowrap">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <div className="font-bold">{"Immunity "}</div>
            <Input
              className="grow"
              value={
                statblock.immunities ? statblock.immunities.join(", ") : ""
              }
            />
          </div>
          <div className="flex items-center gap-1">
            <div className="font-bold">{"Weakness "}</div>
            <Input
              className="grow"
              value={
                statblock.weaknesses ? statblock.weaknesses.join(", ") : ""
              }
            />
          </div>
          <div className="flex items-center gap-1">
            <div className="font-bold">{"Movement "}</div>
            <Input
              className="grow"
              value={statblock.movement ? statblock.movement : ""}
            />
          </div>
          <div className="flex items-center gap-1">
            <div className="font-bold">{"With Captain "}</div>
            <Input
              className="grow"
              value={statblock.with_captain ? statblock.with_captain : ""}
            />
          </div>
        </div>
      </div>

      <div className="w-full border-b border-zinc-950" />

      <Characteristics statblock={statblock} />

      <div className="mb-0 w-full border-b border-zinc-950" />

      <div className="mb-0">
        {statblock.features?.map((feature) => (
          <div key={feature.name} className="border-b border-zinc-950 p-4 pl-0">
            <Feature blockName={statblock.name} feature={feature} />
          </div>
        ))}
      </div>
    </div>
  );
}
