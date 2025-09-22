import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { AppointmentPass } from "#src/types";

export interface AppointmentPassState {
  byId: { [key: number]: AppointmentPass };
  list: {
    ids: number[];
    count: number;
    page: number;
  };
  search: {
    ids: number[];
    count: number;
    page: number;
  };
}

export const appointmentPassStore = createStore<AppointmentPassState>()(() => ({
  byId: {},
  list: {
    ids: [],
    count: 0,
    page: 1,
  },
  search: {
    ids: [],
    count: 0,
    page: 1,
  },
}));

export const useAppointmentPassStore = bindStore(appointmentPassStore);
