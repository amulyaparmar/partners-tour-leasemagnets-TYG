const enabledFullscreenValues = new Set(["1", "true", "yes"]);

export function shouldOpenImmersiveMode(search: string) {
  const fullscreenValue = new URLSearchParams(search)
    .get("fullscreen")
    ?.trim()
    .toLowerCase();

  return fullscreenValue ? enabledFullscreenValues.has(fullscreenValue) : false;
}
