import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";
import type { MetaActivity } from "@bsport/store-booking-group-activity";

export const CHOOSE_GROUP_ACTIVITY_STEP = 0;
export const CONFIGURE_SESSION_STEP = 1;
export const ADVANCED_OPTIONS_STEP = 2;
export const MAX_STEP = ADVANCED_OPTIONS_STEP;

export interface SessionCreationState {
  currentStep: number;
  stepValidations: Record<number, boolean>;
  selectedGroupActivity: MetaActivity | null;
}

export const getInitialState = (): SessionCreationState => ({
  currentStep: CHOOSE_GROUP_ACTIVITY_STEP,
  stepValidations: {
    [CHOOSE_GROUP_ACTIVITY_STEP]: false,
    [CONFIGURE_SESSION_STEP]: false,
    [ADVANCED_OPTIONS_STEP]: false,
  },
  selectedGroupActivity: null,
});

export const sessionCreationStore =
  createStore<SessionCreationState>(getInitialState);

/**
 * @description
 * Hook to access the session creation form state.
 * You can:
 * - Retrieve the entire state:
 *   ```tsx
 *   const state = useSessionCreationStore();
 *   ```
 * - Retrieve a specific item from the store by providing a selector:
 *   ```tsx
 *   const currentStep = useSessionCreationStore((state) => state.currentStep);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization:
 *   ```tsx
 *   const step = useSessionCreationStore(selector, (a, b) => a === b);
 *   ```
 */
export const useSessionCreationStore = bindStore(sessionCreationStore);
