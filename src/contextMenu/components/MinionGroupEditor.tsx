import { CirclePlus, XIcon } from "lucide-react";
import { type MinionGroup } from "../../types/minionGroup";
import ValueButtonTrackerInput from "../trackerInputs/ValueButtonTrackerInput";
import parseNumber from "../../helpers/parseNumber";
import OBR from "@owlbear-rodeo/sdk";
import { Label } from "../trackerInputs/Label";
import { useMinionGroupItems } from "../../helpers/useMinionGroupItems";
import NameInput from "./NameInput";
import StatblockControls from "./StatblockControls";

export default function MinionGroupEditor({
  minionGroup,
  setMinionGroup,
}: {
  minionGroup: MinionGroup;
  setMinionGroup: (minionGroup: MinionGroup) => void;
}) {
  const groupItems = useMinionGroupItems(minionGroup.id);

  return (
    <div className="space-y-2">
      <NameInput
        value={minionGroup.name}
        updateName={(name) => setMinionGroup({ ...minionGroup, name })}
        placeHolder=""
      />
      <div className="grid grid-cols-2 gap-2">
        <ValueButtonTrackerInput
          color="RED"
          label="Squad Stamina"
          parentValue={minionGroup.currentStamina}
          updateHandler={(target) => {
            setMinionGroup({
              ...minionGroup,
              currentStamina: parseNumber(target.value, {
                min: -9999,
                max: 9999,
                inlineMath: { previousValue: minionGroup.currentStamina },
                truncate: true,
              }),
            });
          }}
          buttonProps={{
            inert: true,
            className: "w-fit",
            children: (
              <div className="text-foreground-secondary flex gap-1 pr-2 text-nowrap">
                <div>/</div>
                <div>
                  {`${groupItems.length * minionGroup.individualStamina}`}
                </div>
              </div>
            ),
          }}
        />
        <ValueButtonTrackerInput
          label="Individual Stamina"
          parentValue={minionGroup.individualStamina}
          updateHandler={(target) => {
            setMinionGroup({
              ...minionGroup,
              individualStamina: parseNumber(target.value, {
                min: -9999,
                max: 9999,
                inlineMath: { previousValue: minionGroup.individualStamina },
                truncate: true,
              }),
            });
          }}
        />
      </div>
      <div className="mb-0.5">
        <Label name="Tokens" />
      </div>
      <button
        className="bg-foreground/7 hover:bg-foreground/14 grid w-full justify-between gap-2 rounded-lg p-1.5 transition-all"
        onClick={() => OBR.player.select(groupItems.map((item) => item.id))}
      >
        <div className="flex w-full flex-wrap content-center justify-start gap-1">
          {groupItems.map((item, index) => {
            const dropped =
              index * minionGroup.individualStamina >=
              minionGroup.currentStamina;
            return (
              <div key={item.id} className="grid basis-6 place-items-center">
                <img
                  src={item.image.url}
                  data-dropped={dropped}
                  className="pointer-events-none col-start-1 row-start-1 data-[dropped=true]:opacity-40"
                />
                {dropped && (
                  <XIcon className="z-50 col-start-1 row-start-1 size-full" />
                )}
              </div>
            );
          })}
          {(() => {
            const extraItems = [];
            for (
              let i = 0;
              i <
              Math.ceil(
                minionGroup.currentStamina / minionGroup.individualStamina,
              ) -
                groupItems.length;
              i++
            ) {
              extraItems.push(
                <div key={`extra-${i}`} className="basis-6">
                  <CirclePlus className="size-full" key={i} />
                </div>,
              );
            }
            return extraItems;
          })()}
        </div>
      </button>

      <StatblockControls
        statblockName={!minionGroup.statblock ? "" : minionGroup.statblock}
        setStatblockName={(statblockName) =>
          setMinionGroup({ ...minionGroup, statblock: statblockName })
        }
        groupId={minionGroup.id}
      />
    </div>
  );
}
