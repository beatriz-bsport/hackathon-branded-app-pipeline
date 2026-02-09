import { type DateTime, getIsoDate } from "@bsport/datetime-manipulation";

export const scrollToDate = (date: DateTime) => {
  const dateString = getIsoDate(date);
  const dateElement = document.querySelector(`[data-date="${dateString}"]`);
  if (dateElement) {
    dateElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const isInRange = (
  date: DateTime,
  minDate: DateTime | null,
  maxDate: DateTime | null,
) => {
  if (minDate && maxDate) {
    return date >= minDate && date <= maxDate;
  }
  return false;
};
