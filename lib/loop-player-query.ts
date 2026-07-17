const enabledFullscreenValues = new Set(["1", "true", "yes"]);
const disabledFullscreenValues = new Set(["0", "false", "no", "off"]);
const shortLoopPlayerPaths = new Set([
  "/s290",
  "/socam",
  "/px",
  "/proxi",
  "/ab",
  "/abbot",
  "/cm",
  "/carmin",
  "/rn",
  "/ranch",
  "/hl",
  "/hannah",
  "/br",
  "/brooks",
  "/48w",
  "/48west",
]);

function normalizeQueryValue(value: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function isPublicLoopPlayerPath(pathname: string) {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  return (
    normalizedPath.endsWith("-loop-player") ||
    shortLoopPlayerPaths.has(normalizedPath)
  );
}

export function shouldOpenImmersiveMode(search: string, pathname = "") {
  const searchParams = new URLSearchParams(search);
  const fullscreenValue = normalizeQueryValue(searchParams.get("fullscreen"));
  const controlsValue = normalizeQueryValue(searchParams.get("controls"));

  if (enabledFullscreenValues.has(controlsValue)) {
    return false;
  }

  if (fullscreenValue) {
    if (disabledFullscreenValues.has(fullscreenValue)) {
      return false;
    }

    return enabledFullscreenValues.has(fullscreenValue);
  }

  return isPublicLoopPlayerPath(pathname);
}
