export function NameValueLabel({
  name,
  value,
  showValue,
}: {
  name: string;
  value: string;
  showValue: boolean;
}) {
  return (
    <div className="pointer-events-none grid pb-0.5">
      <div
        data-show-value={showValue}
        className="text-foreground col-start-1 row-start-1 block overflow-clip text-xs font-normal text-nowrap text-ellipsis transition-all duration-150 data-[show-value=true]:opacity-0"
      >
        {name}
      </div>
      <div
        data-show-value={showValue}
        className="text-foreground col-start-1 row-start-1 block text-center text-xs font-normal opacity-0 transition-all duration-150 data-[show-value=true]:opacity-100"
      >
        {value}
      </div>
    </div>
  );
}
