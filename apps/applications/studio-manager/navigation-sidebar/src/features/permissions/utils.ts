export function removeTrailingSlash(url?: string) {
  if (!url || typeof url !== "string") return undefined;
  return url.replace(/\/$/, "");
}
