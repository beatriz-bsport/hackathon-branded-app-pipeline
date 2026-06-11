import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  type DocsColorScheme,
  type DocsThemePreference,
  applyDocsColorScheme,
  getNextDocsThemePreference,
  getStoredDocsThemePreference,
  persistDocsThemePreference,
  resolveDocsColorScheme,
} from "#src/lib/docs-theme";

type DocsThemeContextValue = {
  preference: DocsThemePreference;
  colorScheme: DocsColorScheme;
  setPreference: (preference: DocsThemePreference) => void;
  cyclePreference: () => void;
};

const DocsThemeContext = createContext<DocsThemeContextValue | null>(null);

export function DocsThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<DocsThemePreference>(() =>
    getStoredDocsThemePreference(),
  );
  const [colorScheme, setColorSchemeState] = useState<DocsColorScheme>(() =>
    resolveDocsColorScheme(getStoredDocsThemePreference()),
  );

  useEffect(() => {
    const applied = resolveDocsColorScheme(preference);
    applyDocsColorScheme(applied);
    persistDocsThemePreference(preference);
    setColorSchemeState(applied);
  }, [preference]);

  useEffect(() => {
    if (preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const applied = resolveDocsColorScheme("system");
      applyDocsColorScheme(applied);
      setColorSchemeState(applied);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  const value = useMemo(
    () => ({
      preference,
      colorScheme,
      setPreference: setPreferenceState,
      cyclePreference: () => {
        setPreferenceState((current) => getNextDocsThemePreference(current));
      },
    }),
    [preference, colorScheme],
  );

  return (
    <DocsThemeContext.Provider value={value}>
      {children}
    </DocsThemeContext.Provider>
  );
}

export function useDocsTheme(): DocsThemeContextValue {
  const context = useContext(DocsThemeContext);
  if (!context) {
    throw new Error("useDocsTheme must be used within DocsThemeProvider");
  }
  return context;
}
