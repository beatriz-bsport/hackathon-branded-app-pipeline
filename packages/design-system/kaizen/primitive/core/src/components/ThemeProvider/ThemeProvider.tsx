import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const themes = {
  light: "light",
  dark: "dark",
} as const;

type Theme = (typeof themes)[keyof typeof themes];

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: keyof typeof themes) => void;
  availableThemes: typeof themes;
}>({
  theme: themes.light,
  setTheme: () => {},
  availableThemes: themes,
});

/**
 * React Provider allowing to set and control color theme within your application.
 * @description
 * At the root of your project:
 * ```jsx
 * import { ThemeProvider } from "@bsport/kaizen-primitive-core";
 * import type { AppProps } from "next/app";
 *
 * export default function App({ Component, pageProps }: AppProps) {
 *   return (
 *     <ThemeProvider>
 *       <Component {...pageProps} />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * This will add a className `"kz-${theme}"` to the page body
 * that you can then control with the React hook `useTheme`.
 */
export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(themes.light);
  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      // Remove className of previous theme
      const previousTheme = theme === themes.light ? themes.dark : themes.light;
      body.classList.remove(`kz-${previousTheme}`);
      // Add new className
      body.classList.add(`kz-${theme}`);
    }
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * React hook allowing any Component inside `ThemeProvider` to control themes.
 * @description
 * First make sure, that the component using `useTheme` is within `ThemeProvider` tags.
 *
 * ```jsx
 * import { useTheme } from '@bsport/kaizen-primitive-core';
 *
 * export default MyComponent () {
 *   const { theme, setTheme, availableThemes } = useTheme();
 *
 *   return (
 *     // Your cool Component here.
 *   )
 * }
 * ```
 */
export const useTheme = () => {
  const { theme, setTheme, availableThemes } = useContext(ThemeContext);
  return { theme, setTheme, availableThemes };
};
