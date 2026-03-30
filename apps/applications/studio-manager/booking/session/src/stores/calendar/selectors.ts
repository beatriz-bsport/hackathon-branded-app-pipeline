import { AppointmentModalType, ModalType } from "#src/types";

import { type CalendarState } from "./store";

// Shared selectors

export const selectCalendarView = (state: CalendarState) => state.calendarView;

export const selectSelectedDate = (state: CalendarState) => state.selectedDate;

export const selectModalState = (state: CalendarState) => state.modalState;

// Session tab selectors

export const selectSessionFilters = (state: CalendarState) =>
  state.sessions.filters;

export const selectSessionShowCancelled = (state: CalendarState) =>
  state.sessions.showCancelled;

export const selectSessionDisplayedColumns = (state: CalendarState) =>
  state.sessions.displayedColumns;

export const selectIsCancelModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "sessions" &&
  state.modalState?.type === ModalType.CANCEL;

export const selectIsRestoreModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "sessions" &&
  state.modalState?.type === ModalType.RESTORE;

export const selectIsDeleteModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "sessions" &&
  state.modalState?.type === ModalType.DELETE;

export const selectIsDuplicateModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "sessions" &&
  state.modalState?.type === ModalType.DUPLICATE;

// Appointment tab selectors

export const selectAppointmentFilters = (state: CalendarState) =>
  state.appointments.filters;

export const selectAppointmentShowCancelled = (state: CalendarState) =>
  state.appointments.showCancelled;

export const selectAppointmentDisplayedColumns = (state: CalendarState) =>
  state.appointments.displayedColumns;

export const selectIsCancelAppointmentModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "appointments" &&
  state.modalState?.type === AppointmentModalType.CANCEL;
