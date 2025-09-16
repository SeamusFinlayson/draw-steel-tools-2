import {
  AlignVerticalJustifyEndIcon,
  AlignVerticalJustifyStartIcon,
  DramaIcon,
  MoveVerticalIcon,
  TagIcon,
} from "lucide-react";
import { cn } from "../helpers/utils";
import { Switch } from "../components/ui/Switch";
import Input from "../components/ui/Input";
import FreeWheelInput from "../components/logic/FreeWheelInput";
import parseNumber from "../helpers/parseNumber";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggleGroup";
import type { Settings } from "../types/settingsZod";
import { defaultSettings } from "../helpers/settingsHelpers";

export default function SettingsList({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}) {
  const definedSettings = { ...defaultSettings, ...settings };

  return (
    <div className="space-y-2">
      <SettingsRow
        icon={<TagIcon />}
        label="Name Tags"
        description="Custom name tags that never overlap with stat bubbles"
        action={
          <Switch
            aria-label="Enable Name Tags"
            checked={definedSettings.nameTagsEnabled}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, nameTagsEnabled: checked })
            }
          />
        }
      />
      <SettingsRow
        icon={<MoveVerticalIcon />}
        label="Offset"
        description="Move stat bubbles up or down"
        action={
          <Input
            hasFocusHighlight
            className="w-20 bg-black/7 text-center dark:bg-black/20"
          >
            <FreeWheelInput
              aria-label="Vertical Offset"
              value={definedSettings.verticalOffset.toString()}
              onUpdate={(target) =>
                setSettings({
                  ...definedSettings,
                  verticalOffset: parseNumber(target.value),
                })
              }
              clearContentOnFocus
            />
          </Input>
        }
      />
      <SettingsRow
        icon={
          definedSettings.justifyHealthBarsTop ? (
            <AlignVerticalJustifyStartIcon />
          ) : (
            <AlignVerticalJustifyEndIcon />
          )
        }
        label="Justification"
        description="Snap stat bubbles to the top or bottom of tokens"
        action={
          <ToggleGroup
            aria-label="Vertical Justification"
            value={definedSettings.justifyHealthBarsTop ? "top" : "bottom"}
            onValueChange={(value) => {
              if (value === "") return;
              setSettings({
                ...settings,
                justifyHealthBarsTop: value === "top",
              });
            }}
            type="single"
            variant="outline"
          >
            <ToggleGroupItem
              className="bg-black/7 dark:bg-black/20"
              value="bottom"
            >
              {"Bottom"}
            </ToggleGroupItem>
            <ToggleGroupItem
              className="bg-black/7 dark:bg-black/20"
              value="top"
            >
              {"Top"}
            </ToggleGroupItem>
          </ToggleGroup>
        }
      />
      <SettingsRow
        icon={<DramaIcon />}
        label="Show Health Bars"
        description="Show dungeon master only health bars, but not the text, to players "
        action={
          <Switch
            aria-label="Show health bars to players"
            checked={definedSettings.showHealthBars}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, showHealthBars: checked })
            }
          />
        }
        last={!definedSettings.showHealthBars}
      >
        <SubSettingsRow
          label="Segments"
          description="Only show when creatures drop to certain fractions of their health"
          action={
            <Input
              hasFocusHighlight
              className="w-20 bg-black/7 text-center dark:bg-black/20"
            >
              <FreeWheelInput
                aria-label="Health bar segments count"
                clearContentOnFocus
                value={definedSettings.segmentsCount.toString()}
                onUpdate={(target) =>
                  setSettings({
                    ...settings,
                    segmentsCount: parseNumber(target.value),
                  })
                }
              />
            </Input>
          }
          collapseElement={!definedSettings.showHealthBars}
          last
        />
      </SettingsRow>
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  description,
  action,
  children,
  last,
}: {
  icon?: React.JSX.Element;
  label: string;
  description: string;
  action: React.JSX.Element;
  children?: React.JSX.Element | React.JSX.Element[];
  last?: boolean;
}): React.JSX.Element {
  return (
    <div>
      <div
        className={cn(
          "bg-mirage-100 dark:bg-mirage-900 flex gap-2 rounded-lg p-2",
          { "rounded-b-none": last === false },
        )}
      >
        <div className="stroke-foreground size-10 shrink-0 p-2">{icon}</div>
        <div className="flex grow flex-wrap justify-between gap-2">
          <div className="min-w-36 grow basis-0">
            <h1>{label}</h1>
            <div className="text-foreground-secondary text-xs">
              {description}
            </div>
          </div>
          <div className="p-2 pl-0">{action}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function SubSettingsRow({
  label,
  description,
  action,
  last,
  collapseElement,
}: {
  label: string;
  description?: string;
  action: React.ReactElement;
  last?: boolean;
  collapseElement: boolean;
}): React.JSX.Element {
  return (
    <div
      className={cn("transition-max-height overflow-clip duration-300", {
        "max-h-60 ease-in": !collapseElement,
        "max-h-0 ease-out": collapseElement,
      })}
      inert={collapseElement}
    >
      <div className="pt-0.5">
        <div
          className={cn(
            "bg-mirage-100 dark:bg-mirage-900 flex gap-2 rounded-b-lg p-2",
            { "rounded-b-none": last === false },
          )}
        >
          <div className="stroke-foreground size-10 shrink-0 p-2"></div>
          <div className="flex grow flex-wrap justify-between gap-2">
            <div className="min-w-36 grow basis-0">
              <h1>{label}</h1>
              <div className="text-foreground-secondary text-xs">
                {description}
              </div>
            </div>
            <div className="p-2 pl-0">{action}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
