import type { SessionListState } from "./store";

export const selectCalendarView = (state: SessionListState) =>
  state.calendarView;

export const selectSelectedDate = (state: SessionListState) =>
  state.selectedDate;

export const selectFilters = (state: SessionListState) => state.filters;

export const selectShowCancelledSessions = (state: SessionListState) =>
  state.showCancelledSessions;

export const selectModalState = (state: SessionListState) => state.modalState;

export const selectIsCancelModalOpen = (state: SessionListState) =>
  state.modalState?.type === "cancel";
