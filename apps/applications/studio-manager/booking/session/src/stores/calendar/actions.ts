import { type DateTime, getWeekBounds } from "@bsport/datetime-manipulation";
import { FilterElementState } from "@bsport/kaizen-primitive-core";

import {
  AppointmentColumn,
  AppointmentModalType,
  CalendarTab,
  CalendarView,
  EnrichedAppointment,
  EnrichedSession,
  ModalType,
  SessionColumns,
} from "#src/types";

import { calendarStore } from "./store";

// Shared actions (affect both tabs)

export const setCalendarView = (calendarView: CalendarView) => {
  calendarStore.setState((state) => {
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
    calendarStore.setState({
      selectedDate: { type: "range", minDate: date[0], maxDate: date[1] },
    });
  } else {
    calendarStore.setState({
      selectedDate: { type: "single", date },
    });
  }
};

export const setUniqueDate = (date: DateTime) => {
  calendarStore.setState({
    calendarView: CalendarView.DAILY,
    selectedDate: { type: "single", date },
  });
};

export const setLocale = (locale: string) => {
  calendarStore.setState({ locale });
};

// Tab-aware actions

export const setFilters = (tab: CalendarTab, filters: FilterElementState[]) => {
  calendarStore.setState((state) => ({
    [tab]: { ...state[tab], filters },
  }));
};

export const setShowCancelled = (tab: CalendarTab, show: boolean) => {
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
  tab: CalendarTab,
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
