import { getWeekBounds } from "@bsport/datetime-manipulation";

import { CalendarView, sessionListStore } from "./store";

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

export const setSelectedDate = (date: Date | [Date | null, Date | null]) => {
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

export const setUniqueDate = (date: Date) => {
  sessionListStore.setState({
    calendarView: CalendarView.DAILY,
    selectedDate: { type: "single", date },
  });
};

export const setLocale = (locale: string) => {
  sessionListStore.setState({ locale });
};
