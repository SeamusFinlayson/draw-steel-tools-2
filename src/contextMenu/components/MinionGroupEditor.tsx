import { CirclePlus, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { type MinionGroup } from "../../types/minionGroup";
import ValueButtonTrackerInput from "../trackerInputs/ValueButtonTrackerInput";
import parseNumber from "../../helpers/parseNumber";
import OBR from "@owlbear-rodeo/sdk";
import { Label } from "../trackerInputs/Label";
import { useMinionGroupItems } from "../../helpers/useMinionGroupItems";
import NameInput from "./NameInput";
import StatblockControls from "./StatblockControls";
import InputBackground from "../trackerInputs/InputBackground";
import type { DefinedSettings } from "../../types/settingsZod";
import usePlayerRole from "../../helpers/usePlayerRole";

export default function MinionGroupEditor({
  minionGroup,
  setMinionGroup,
  settings,
}: {
  minionGroup: MinionGroup;
  setMinionGroup: (minionGroup: MinionGroup) => void;
  settings: DefinedSettings;
}) {
  const groupItems = useMinionGroupItems(minionGroup.id);
  const playerRole = usePlayerRole();

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-x-0.5">
        <NameInput
          label="Group Name"
          value={minionGroup.name}
          updateName={(name) => setMinionGroup({ ...minionGroup, name })}
          placeHolder=""
          hideButton
        />
        {settings.nameTagsEnabled && (
          <InputBackground
            color="DEFAULT"
            className="grid size-9 shrink-0 place-items-center overflow-clip rounded-l-[18px] rounded-r-[18px]"
          >
            <button
              className="hover:bg-foreground/7 focus-visible:bg-foreground/7 flex size-9 shrink-0 items-center justify-center outline-hidden transition-colors"
              onClick={() => {
                setMinionGroup({
                  ...minionGroup,
                  nameTagsEnabled: !minionGroup.nameTagsEnabled,
                });
              }}
            >
              {minionGroup.nameTagsEnabled ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </InputBackground>
        )}
      </div>
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
                min: 1,
                max: 9999,
                inlineMath: { previousValue: minionGroup.individualStamina },
                truncate: true,
              }),
            });
          }}
        />
      </div>
      <div className="mb-0">
        <Label name="Tokens" />
      </div>
      <InputBackground color="DEFAULT">
        <button
          className="hover:bg-foreground/7 focus-visible:bg-foreground/7 w-full rounded-lg p-1.5 transition-all outline-none"
          onClick={() => OBR.player.select(groupItems.map((item) => item.id))}
        >
          <div className="flex h-6 w-full justify-start gap-1.5">
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
      </InputBackground>

      <StatblockControls
        statblockName={!minionGroup.statblock ? "" : minionGroup.statblock}
        setStatblockName={(statblockName) =>
          setMinionGroup({ ...minionGroup, statblock: statblockName })
        }
        groupId={minionGroup.id}
        playerRole={playerRole}
      />
    </div>
  );
}
