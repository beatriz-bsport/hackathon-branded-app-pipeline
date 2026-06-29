import { type DateTime } from "@bsport/datetime-manipulation";
import { FilterElementState } from "@bsport/kaizen-primitive-core";

import { DEFAULT_SERIES_COLUMNS } from "#src/constants";
import {
  AppointmentColumn,
  AppointmentModalType,
  CalendarDataTab,
  CalendarTab,
  CalendarView,
  EnrichedAppointment,
  EnrichedSession,
  ModalType,
  SeriesColumn,
  SeriesOrdering,
  SessionColumns,
} from "#src/types";

import {
  deriveSelection,
  getAnchorDate,
  reSnapSelectionToLocale,
} from "./selection";
import { calendarStore } from "./store";

// Shared actions (affect both tabs)

export const setCalendarView = (calendarView: CalendarView) => {
  calendarStore.setState((state) => ({
    calendarView,
    selectedDate: deriveSelection(
      calendarView,
      getAnchorDate(state.selectedDate),
      state.locale,
    ),
  }));
};

export const setAnchorDate = (date: DateTime) => {
  calendarStore.setState((state) => ({
    selectedDate: deriveSelection(state.calendarView, date, state.locale),
  }));
};

export const setLocale = (locale: string) => {
  calendarStore.setState((state) =>
    state.locale === locale
      ? { locale }
      : {
          locale,
          selectedDate: reSnapSelectionToLocale(
            state.calendarView,
            state.selectedDate,
            locale,
          ),
        },
  );
};

// Tab-aware actions

export const setFilters = (tab: CalendarTab, filters: FilterElementState[]) => {
  calendarStore.setState((state) => ({
    [tab]: { ...state[tab], filters },
  }));
};

export const setSeriesOrdering = (ordering: SeriesOrdering) => {
  calendarStore.setState((state) => ({
    series: { ...state.series, ordering },
  }));
};

export const setSeriesShowCancelled = (showCancelled: boolean) => {
  calendarStore.setState((state) => ({
    series: { ...state.series, showCancelled },
  }));
};

export const toggleSeriesColumn = (column: SeriesColumn) => {
  calendarStore.setState((state) => {
    const displayedColumns =
      state.series.displayedColumns ?? DEFAULT_SERIES_COLUMNS;

    return {
      series: {
        ...state.series,
        displayedColumns: displayedColumns.includes(column)
          ? displayedColumns.filter(
              (displayedColumn) => displayedColumn !== column,
            )
          : [...displayedColumns, column],
      },
    };
  });
};

export const setShowCancelled = (tab: CalendarDataTab, show: boolean) => {
  calendarStore.setState((state) => ({
    [tab]: { ...state[tab], showCancelled: show },
  }));
};

// Overloads to ensure each tab can only be used with its matching column type.
export function toggleColumn(tab: "classes", column: SessionColumns): void;
export function toggleColumn(
  tab: "appointments",
  column: AppointmentColumn,
): void;
export function toggleColumn(
  tab: CalendarDataTab,
  column: SessionColumns | AppointmentColumn,
): void {
  calendarStore.setState((state) => {
    const tabState = state[tab];
    const cols = tabState.displayedColumns as (
      | SessionColumns
      | AppointmentColumn
    )[];
    return {
      [tab]: {
        ...tabState,
        displayedColumns: cols.includes(column)
          ? cols.filter((col) => col !== column)
          : [...cols, column],
      },
    };
  });
}

// Session modal actions

export const openCancelModal = (session: EnrichedSession) => {
  calendarStore.setState({
    modalState: { tab: "classes", type: ModalType.CANCEL, session },
  });
};

export const openRestoreModal = (session: EnrichedSession) => {
  calendarStore.setState({
    modalState: { tab: "classes", type: ModalType.RESTORE, session },
  });
};

export const openDeleteModal = (session: EnrichedSession) => {
  calendarStore.setState({
    modalState: { tab: "classes", type: ModalType.DELETE, session },
  });
};

export const openDuplicateModal = (session: EnrichedSession) => {
  calendarStore.setState({
    modalState: { tab: "classes", type: ModalType.DUPLICATE, session },
  });
};

// Appointment modal actions

export const openCancelAppointmentModal = (
  appointment: EnrichedAppointment,
) => {
  calendarStore.setState({
    modalState: {
      tab: "appointments",
      type: AppointmentModalType.CANCEL,
      appointment,
    },
  });
};

export const openRescheduleAppointmentModal = (
  appointment: EnrichedAppointment,
) => {
  calendarStore.setState({
    modalState: {
      tab: "appointments",
      type: AppointmentModalType.RESCHEDULE,
      appointment,
    },
  });
};

export const openSwapPassModal = (appointment: EnrichedAppointment) => {
  calendarStore.setState({
    modalState: {
      tab: "appointments",
      type: AppointmentModalType.SWAP_PASS,
      appointment,
    },
  });
};

export const openSwapTeacherModal = (appointment: EnrichedAppointment) => {
  calendarStore.setState({
    modalState: {
      tab: "appointments",
      type: AppointmentModalType.SWAP_TEACHER,
      appointment,
    },
  });
};

export const closeModal = () => {
  calendarStore.setState({ modalState: null });
};
