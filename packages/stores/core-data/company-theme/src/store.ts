import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { CompanyTheme } from "#src/types";

export interface CompanyThemeState {
  companyTheme: CompanyTheme | undefined;
}

export const companyThemeStore = createStore<CompanyThemeState>()(() => ({
  companyTheme: undefined,
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const companyTheme = useCompanyThemeStore(selectCompanyTheme);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const companyThemes = useCompanyThemeStore(selectCompanyTheme, (a, b) => a.id === b.id);
 *   ```
 */
export const useCompanyThemeStore = bindStore(companyThemeStore);
