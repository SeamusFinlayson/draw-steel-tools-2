import type { Item } from "@owlbear-rodeo/sdk";
import { AlertTriangleIcon } from "lucide-react";
import type { SetupOptions } from "../../helpers/AppState";

export function InvalidTargetsWarning({
  validTargets,
  invalidTargets,
  setupOptions,
}: {
  validTargets: Item[];
  invalidTargets: Item[];
  setupOptions: SetupOptions;
}) {
  return (
    <div className="bg-mirage-99 dark:bg-mirage-901 rounded-2xl p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangleIcon className="size-5 shrink-0" />
          {validTargets.length > 0 ? (
            <div>{`This data can only be applied to ${validTargets.length} of ${validTargets.length + invalidTargets.length} target items.`}</div>
          ) : (
            <div>This data cannot be applied to any targets.</div>
          )}
        </div>
        <div>
          {invalidTargets.map((item) => (
            <div key={item.id} className="text-foreground-secondary text-sm">
              {`Cannot apply ${setupOptions.type} to ${item.name} because it is a ${item.type} on the ${item.layer} layer.`}
            </div>
          ))}
        </div>
        <div className="text-sm">
          {setupOptions.type === "MINION" && (
            <div>
              MINION can be applied to IMAGE items on the CHARACTER or MOUNT
              layers.
            </div>
          )}
          {setupOptions.type === "MONSTER" && (
            <div>
              MONSTER can be applied to IMAGE items on the CHARACTER or MOUNT
              layers.
            </div>
          )}
          {setupOptions.type === "TERRAIN" && (
            <div>TERRAIN can be applied to IMAGE items on the MAP layer.</div>
          )}
          {setupOptions.type === "TERRAIN" && (
            <div>
              TERRAIN can be applied to SHAPE and CUREVE items on the DRAWING
              layer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
