export type DocsThemePreference = "light" | "dark" | "system";

export type DocsColorScheme = "light" | "dark";

export const DOCS_THEME_STORAGE_KEY = "kaizen-docs-theme";

export function getStoredDocsThemePreference(): DocsThemePreference {
  try {
    const value = localStorage.getItem(DOCS_THEME_STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "system") {
      return value;
    }
  } catch {
    // Ignore storage failures (private mode, etc.)
  }
  return "system";
}

export function getSystemDocsColorScheme(): DocsColorScheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveDocsColorScheme(
  preference: DocsThemePreference,
): DocsColorScheme {
  if (preference === "system") return getSystemDocsColorScheme();
  return preference;
}

export function applyDocsColorScheme(scheme: DocsColorScheme): void {
  document.documentElement.classList.toggle("dark", scheme === "dark");
  document.documentElement.style.colorScheme = scheme;
}

export function persistDocsThemePreference(
  preference: DocsThemePreference,
): void {
  try {
    localStorage.setItem(DOCS_THEME_STORAGE_KEY, preference);
  } catch {
    // Ignore storage failures (private mode, etc.)
  }
}

const THEME_CYCLE: DocsThemePreference[] = ["system", "light", "dark"];

export function getNextDocsThemePreference(
  current: DocsThemePreference,
): DocsThemePreference {
  const index = THEME_CYCLE.indexOf(current);
  return THEME_CYCLE[(index + 1) % THEME_CYCLE.length] ?? "system";
}

export function getDocsThemePreferenceLabel(
  preference: DocsThemePreference,
): string {
  switch (preference) {
    case "light":
      return "Light theme";
    case "dark":
      return "Dark theme";
    default:
      return "System theme";
  }
}
