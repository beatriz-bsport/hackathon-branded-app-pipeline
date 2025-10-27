import type { AppointmentState } from "./store";

export const selectAllAppointments = (state: AppointmentState) => {
  const { byId } = state;
  return Object.values(byId);
};

export const selectAllAppointmentMappedById = (state: AppointmentState) =>
  state.byId;

export const selectAppointmentList = (state: AppointmentState) => {
  const { list, byId } = state;
  return list.ids.map((id) => byId[id]);
};

export const selectAppointmentById = (state: AppointmentState, id: number) =>
  state.byId[id];

export const selectAppointmentListCount = (state: AppointmentState) =>
  state.list.count;

export const selectSearchedAppointment = (state: AppointmentState) => {
  const { search, byId } = state;
  return search.ids.map((id) => byId[id]);
};

export const selectSearchedAppointmentCount = (state: AppointmentState) =>
  state.search.count;
