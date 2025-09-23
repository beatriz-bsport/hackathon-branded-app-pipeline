import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Appointment } from "#src/types";

export interface AppointmentState {
  byId: { [key: number]: Appointment };
  list: {
    count: number;
    ids: number[];
    page: number;
  };
  search: {
    count: number;
    ids: number[];
    page: number;
  };
}

export const appointmentStore = createStore<AppointmentState>()(() => ({
  byId: {},
  list: {
    count: 0,
    ids: [],
    page: 1,
  },
  search: {
    count: 0,
    ids: [],
    page: 1,
  },
}));

export const useAppointmentStore = bindStore(appointmentStore);
