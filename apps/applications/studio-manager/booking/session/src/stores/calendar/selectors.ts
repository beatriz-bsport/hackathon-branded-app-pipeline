import { AppointmentModalType, ModalType } from "#src/types";

import { type CalendarState } from "./store";

// Shared selectors

export const selectCalendarView = (state: CalendarState) => state.calendarView;

export const selectSelectedDate = (state: CalendarState) => state.selectedDate;

export const selectModalState = (state: CalendarState) => state.modalState;

// Sessions tab selectors

export const selectSessionFilters = (state: CalendarState) =>
  state.classes.filters;

export const selectSessionShowCancelled = (state: CalendarState) =>
  state.classes.showCancelled;

export const selectSessionDisplayedColumns = (state: CalendarState) =>
  state.classes.displayedColumns;

export const selectIsCancelModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "classes" &&
  state.modalState?.type === ModalType.CANCEL;

export const selectIsRestoreModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "classes" &&
  state.modalState?.type === ModalType.RESTORE;

export const selectIsDeleteModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "classes" &&
  state.modalState?.type === ModalType.DELETE;

export const selectIsDuplicateModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "classes" &&
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

export const selectIsRescheduleAppointmentModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "appointments" &&
  state.modalState?.type === AppointmentModalType.RESCHEDULE;

export const selectIsSwapPassModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "appointments" &&
  state.modalState?.type === AppointmentModalType.SWAP_PASS;

export const selectIsSwapTeacherModalOpen = (state: CalendarState) =>
  state.modalState?.tab === "appointments" &&
  state.modalState?.type === AppointmentModalType.SWAP_TEACHER;
