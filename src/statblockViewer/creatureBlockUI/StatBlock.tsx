import { cn } from "../../helpers/utils";
import type { DrawSteelStatblock } from "../../types/DrawSteelZod";
import { Feature } from "./Feature";

export function StatBlock({ statblock }: { statblock: DrawSteelStatblock }) {
  return (
    <div className="w-full max-w-lg space-y-2">
      <div
        className={cn(
          "rounded-md border-zinc-950 bg-gradient-to-b from-neutral-400/60 to-neutral-300/50 p-2",
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
        <div className="flex flex-wrap items-baseline justify-between text-nowrap">
          <div className="text-base font-black">{statblock.name}</div>
          <div className="text-right font-black">{`Level ${statblock.level} ${statblock.roles}`}</div>
        </div>
        <div className="flex flex-wrap justify-between text-nowrap">
          <div>{statblock.ancestry.join(", ")}</div>
          <div className="text-right">{`EV ${statblock.ev}`}</div>
        </div>
      </div>

      <div className="space-y-2 px-2">
        <div className="flex flex-wrap justify-between gap-1.5">
          {[
            { label: "Size", value: statblock.size },
            { label: "Speed", value: statblock.speed },
            { label: "Stamina", value: statblock.stamina },
            { label: "Stability", value: statblock.stability },
            { label: "Free Strike", value: statblock.free_strike },
          ].map((item) => (
            <div className="min-w-16 flex-1 text-center" key={item.label}>
              <div className="text-lg">{item.value}</div>
              <div className="-mt-1 font-bold text-nowrap">{item.label}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="flex flex-wrap justify-between">
            <div>
              <span className="font-bold">{"Immunity: "}</span>
              {statblock.immunities ? statblock.immunities.join(", ") : "—"}
            </div>
            <div>
              <span className="font-bold">{"Weakness: "}</span>
              {statblock.weaknesses ? statblock.weaknesses.join(", ") : "—"}
            </div>
          </div>
          <div className="flex flex-wrap justify-between">
            <div>
              <span className="font-bold">{"Movement: "}</span>
              <span>{statblock.movement ? statblock.movement : "—"}</span>
            </div>
            {statblock?.with_captain && (
              <div>
                <span className="font-bold">{"With Captain: "}</span>
                <span>
                  {statblock.with_captain ? statblock.with_captain : "—"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-0.5 w-full border-b border-zinc-950" />

      <div className="flex flex-wrap justify-between gap-1.5 px-2 text-sm">
        {[
          { label: "Might", value: statblock.might },
          { label: "Agility", value: statblock.agility },
          { label: "Reason", value: statblock.reason },
          { label: "Intuition", value: statblock.intuition },
          { label: "Presence", value: statblock.presence },
        ].map((item) => (
          <div className="min-w-16 flex-1 text-center" key={item.label}>
            <div className="text-lg">{`${item.value > 1 ? "+" : ""}${item.value}`}</div>
            <div className="-mt-0.5 rounded-sm bg-black font-bold text-white">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-0 w-full border-b border-zinc-950" />

      <div className="mb-0">
        {statblock.features?.map((feature) => (
          <div key={feature.name} className="border-b border-zinc-950 p-2 pl-0">
            <Feature feature={feature} />
          </div>
        ))}
      </div>
    </div>
  );
}
