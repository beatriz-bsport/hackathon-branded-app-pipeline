import type { SessionListState } from "./store";

export const selectCalendarView = (state: SessionListState) =>
  state.calendarView;

export const selectSelectedDate = (state: SessionListState) =>
  state.selectedDate;

export const selectFilters = (state: SessionListState) => state.filters;
