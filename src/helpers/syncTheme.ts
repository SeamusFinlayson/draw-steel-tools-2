import OBR from "@owlbear-rodeo/sdk";

/** Keep tailwind theme up to date by applying the "dark" class to the document body. */
export function syncTheme() {
  const setBodyTheme = (string: string) => {
    if (string === "DARK") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  };

  // Add theme early if provided in url
  const themeMode = new URLSearchParams(document.location.search).get(
    "themeMode",
  );
  if (themeMode !== null) setBodyTheme(themeMode);

  // Keep up to date with owlbear rodeo theme when is is available
  OBR.onReady(() => {
    OBR.theme.getTheme().then((theme) => setBodyTheme(theme.mode));
    OBR.theme.onChange((theme) => setBodyTheme(theme.mode));
  });
}
