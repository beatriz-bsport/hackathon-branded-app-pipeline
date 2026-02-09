import { ModalType } from "#src/types";

import { type SessionListState } from "./store";

export const selectCalendarView = (state: SessionListState) =>
  state.calendarView;

export const selectSelectedDate = (state: SessionListState) =>
  state.selectedDate;

export const selectFilters = (state: SessionListState) => state.filters;

export const selectShowCancelledSessions = (state: SessionListState) =>
  state.showCancelledSessions;

export const selectModalState = (state: SessionListState) => state.modalState;

export const selectIsCancelModalOpen = (state: SessionListState) =>
  state.modalState?.type === ModalType.CANCEL;

export const selectIsRestoreModalOpen = (state: SessionListState) =>
  state.modalState?.type === ModalType.RESTORE;

export const selectIsDeleteModalOpen = (state: SessionListState) =>
  state.modalState?.type === ModalType.DELETE;

export const selectDisplayedColumns = (state: SessionListState) =>
  state.displayedColumns;

export const selectIsDuplicateModalOpen = (state: SessionListState) =>
  state.modalState?.type === ModalType.DUPLICATE;
