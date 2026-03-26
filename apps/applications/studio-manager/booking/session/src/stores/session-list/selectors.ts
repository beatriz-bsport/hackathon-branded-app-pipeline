import { ModalType } from "#src/types";

import { type SessionListState } from "./store";

// Shared selectors

export const selectCalendarView = (state: SessionListState) =>
  state.calendarView;

export const selectSelectedDate = (state: SessionListState) =>
  state.selectedDate;

export const selectModalState = (state: SessionListState) => state.modalState;

// Session tab selectors

export const selectSessionFilters = (state: SessionListState) => state.filters;

export const selectSessionShowCancelled = (state: SessionListState) =>
  state.showCancelledSessions;

export const selectSessionDisplayedColumns = (state: SessionListState) =>
  state.displayedColumns;

export const selectIsCancelModalOpen = (state: SessionListState) =>
  state.modalState?.type === ModalType.CANCEL;

export const selectIsRestoreModalOpen = (state: SessionListState) =>
  state.modalState?.type === ModalType.RESTORE;

export const selectIsDeleteModalOpen = (state: SessionListState) =>
  state.modalState?.type === ModalType.DELETE;

export const selectIsDuplicateModalOpen = (state: SessionListState) =>
  state.modalState?.type === ModalType.DUPLICATE;
