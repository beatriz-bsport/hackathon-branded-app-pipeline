import { type DateTime, getWeekBounds } from "@bsport/datetime-manipulation";
import { FilterElementState } from "@bsport/kaizen-primitive-core";

import type { Columns, EnrichedSession } from "#src/types";

import { CalendarView, ModalType, sessionListStore } from "./store";

export const setCalendarView = (calendarView: CalendarView) => {
  sessionListStore.setState((state) => {
    const currentSelectedDate = state.selectedDate;
    if (
      calendarView === CalendarView.DAILY &&
      currentSelectedDate.type === "range" &&
      currentSelectedDate.minDate
    ) {
      return {
        ...state,
        calendarView,
        selectedDate: {
          type: "single",
          date: currentSelectedDate.minDate,
        },
      };
    }

    if (
      calendarView === CalendarView.RANGE &&
      currentSelectedDate.type === "single"
    ) {
      const weekBounds = getWeekBounds(currentSelectedDate.date, state.locale);
      return {
        ...state,
        calendarView,
        selectedDate: {
          type: "range",
          minDate: weekBounds.start,
          maxDate: weekBounds.end,
        },
      };
    }

    return {
      ...state,
      calendarView,
    };
  });
};

export const setSelectedDate = (
  date: DateTime | [DateTime | null, DateTime | null],
) => {
  if (Array.isArray(date)) {
    sessionListStore.setState({
      selectedDate: { type: "range", minDate: date[0], maxDate: date[1] },
    });
  } else {
    sessionListStore.setState({
      selectedDate: { type: "single", date },
    });
  }
};

export const setUniqueDate = (date: DateTime) => {
  sessionListStore.setState({
    calendarView: CalendarView.DAILY,
    selectedDate: { type: "single", date },
  });
};

export const setLocale = (locale: string) => {
  sessionListStore.setState({ locale });
};

export const setFilters = (filters: FilterElementState[]) => {
  sessionListStore.setState({ filters });
};

// Modal actions
export const openCancelModal = (session: EnrichedSession) => {
  sessionListStore.setState({
    modalState: { type: ModalType.CANCEL, session },
  });
};

export const openRestoreModal = (session: EnrichedSession) => {
  sessionListStore.setState({
    modalState: { type: ModalType.RESTORE, session },
  });
};

export const openDeleteModal = (session: EnrichedSession) => {
  sessionListStore.setState({
    modalState: { type: ModalType.DELETE, session },
  });
};

export const openDuplicateModal = (session: EnrichedSession) => {
  sessionListStore.setState({
    modalState: { type: ModalType.DUPLICATE, session },
  });
};

export const closeModal = () => {
  sessionListStore.setState({ modalState: null });
};

export const setShowCancelledSessions = (show: boolean) => {
  sessionListStore.setState({ showCancelledSessions: show });
};

export const toggleColumn = (column: Columns) => {
  sessionListStore.setState((state) => ({
    displayedColumns: state.displayedColumns.includes(column)
      ? state.displayedColumns.filter((col) => col !== column)
      : [...state.displayedColumns, column],
  }));
};
