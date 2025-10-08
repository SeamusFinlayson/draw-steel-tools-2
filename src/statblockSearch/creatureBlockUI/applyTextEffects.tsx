export function applyTextEffects(string: string) {
  const potencyRegex = /([MAIRP][ ][<][ ][-]?[\d])+/g;
  const characteristicTestRegex =
    /((?:Might|Agility|Intuition|Reason|Presence)(?: test))+/g;

  return string
    .replaceAll("*", "")
    .split(potencyRegex)
    .map((val, index) =>
      index % 2 ? (
        <span
          key={index}
          className="bg-zinc-950 rounded-sm font-semibold whitespace-nowrap px-0.5  text-xs text-white"
        >
          {val}
        </span>
      ) : (
        val.split(characteristicTestRegex).map((val, index) =>
          index % 2 ? (
            <span key={index} className="font-semibold">
              {val}
            </span>
          ) : (
            <span key={index}>{val}</span>
          )
        )
      )
    );
}
