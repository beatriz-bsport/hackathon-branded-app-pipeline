const ABSOLUTE_URL_RE = /^[a-z][a-z0-9+.-]*:/i;

export function resolveAssetUrl(src: string): string {
  const value = src.trim();
  if (!value || ABSOLUTE_URL_RE.test(value) || value.startsWith("//")) {
    return value;
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = value.startsWith("/") ? value : `/${value}`;

  return `${base}${path}`;
}
