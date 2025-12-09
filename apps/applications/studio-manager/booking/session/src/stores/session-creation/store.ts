import { createStore } from "zustand/vanilla";

import { getTodayJSDate } from "@bsport/datetime-manipulation";
import { bindStore } from "@bsport/store-base";
import type { MetaActivity } from "@bsport/store-booking-group-activity";

import type { SessionCreate, SessionCreationFormData } from "./types";

export enum SESSION_CREATION_STEPS {
  CHOOSE_GROUP_ACTIVITY = 0,
  CONFIGURE_SESSION = 1,
  ADVANCED_OPTIONS = 2,
}

export const MAX_STEP = SESSION_CREATION_STEPS.ADVANCED_OPTIONS;

export interface SessionCreationState {
  currentStep: number;
  stepValidations: Record<number, boolean>;
  selectedGroupActivity: MetaActivity | null;
  formData: {
    [SESSION_CREATION_STEPS.CONFIGURE_SESSION]: SessionCreationFormData;
    [SESSION_CREATION_STEPS.ADVANCED_OPTIONS]: Partial<SessionCreate>;
  };
}

export const DEFAULT_CONFIGURE_SESSION_FORM_DATA = {
  allowCustomNameAndDescription: false,
  name_override: "",
  description_override: "",
  manager_only: false,
  credits: 1,
  waiting_list_max_size: 0,
  effectif: 0,
  available_on_partnership: false,
  partner_max_booking_count: 0,
  startDateTime: getTodayJSDate(),
};

export const DEFAULT_ADVANCED_OPTIONS_FORM_DATA = {};

export const getInitialState = (): SessionCreationState => ({
  currentStep: SESSION_CREATION_STEPS.CHOOSE_GROUP_ACTIVITY,
  stepValidations: {
    [SESSION_CREATION_STEPS.CHOOSE_GROUP_ACTIVITY]: false,
    [SESSION_CREATION_STEPS.CONFIGURE_SESSION]: false,
    [SESSION_CREATION_STEPS.ADVANCED_OPTIONS]: false,
  },
  selectedGroupActivity: null,
  formData: {
    [SESSION_CREATION_STEPS.CONFIGURE_SESSION]:
      DEFAULT_CONFIGURE_SESSION_FORM_DATA,
    [SESSION_CREATION_STEPS.ADVANCED_OPTIONS]:
      DEFAULT_ADVANCED_OPTIONS_FORM_DATA,
  },
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
