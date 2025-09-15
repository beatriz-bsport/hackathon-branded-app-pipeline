import type { AppointmentPassState } from "./store";

export const selectAppointmentPassById = (
  state: AppointmentPassState,
  id: number,
) => state.byId[id];

export const selectAppointmentPassesList = (state: AppointmentPassState) => {
  const {
    list: { ids },
    byId,
  } = state;
  return ids.map((id) => byId[id]);
};

export const selectAppointmentPassListCount = (state: AppointmentPassState) =>
  state.list.count;

export const selectAppointmentPassesSearched = (
  state: AppointmentPassState,
) => {
  const {
    search: { ids },
    byId,
  } = state;
  return ids.map((id) => byId[id]);
};

export const selectAppointmentPassSearchedCount = (
  state: AppointmentPassState,
) => state.search.count;
