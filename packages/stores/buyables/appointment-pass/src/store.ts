import { createStore } from "zustand/vanilla";

import { type PaginatedState, bindStore } from "@bsport/store-base";

import type { AppointmentPass, AppointmentPassCategory } from "#src/types";

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
  categories: PaginatedState<AppointmentPassCategory>;
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
  categories: {
    byId: {},
    count: 0,
    page: 1,
    ids: [],
  },
}));

export const useAppointmentPassStore = bindStore(appointmentPassStore);
