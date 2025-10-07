import type { AppointmentPassState } from "./store";

// ---------- ITEMS ----------

export const selectAppointmentPassesById = (state: AppointmentPassState) =>
  state.byId;

export const selectAppointmentPass = (
  state: AppointmentPassState,
  id: number,
) => state.byId[id];

export const selectAppointmentPasses = (state: AppointmentPassState) => {
  const {
    list: { ids },
    byId,
  } = state;
  return ids.map((id) => byId[id]);
};

export const selectAppointmentPassesCount = (state: AppointmentPassState) =>
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

// ---------- CATEGORIES ----------

export const selectAppointmentPassCategoriesById = (
  state: AppointmentPassState,
) => state.categories.byId;

export const selectAppointmentPassCategory = (
  state: AppointmentPassState,
  id: number,
) => state.categories.byId[id];

export const selectAppointmentPassCategories = (
  state: AppointmentPassState,
) => {
  const { ids, byId } = state.categories;
  return ids.map((id) => byId[id]);
};

export const selectAppointmentPassCategoriesCount = (
  state: AppointmentPassState,
) => state.categories.count;
