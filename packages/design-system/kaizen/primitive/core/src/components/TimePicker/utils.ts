import type { Item } from "#src/components/Menu/types";

const HOURS_IN_DAY = 24;
const HOURS_IN_HALF_DAY = 12;
const MINUTES_IN_HOUR = 60;
const TWO_DIGIT_PAD = 2;

/**
 * Generates an array of time options for the TimePicker.
 * @param interval The interval in minutes between each time option. Must be >= 1.
 * @param meridiem Whether to use 12-hour (AM/PM) format.
 * @param selectedMeridiem The selected meridiem ("AM" or "PM") if using 12-hour format.
 */
export const generateTimeOptions = (
  interval: number,
  meridiem?: boolean,
  selectedMeridiem?: "AM" | "PM",
): Item[] => {
  if (interval < 1) return [];

  let start = 0,
    end = HOURS_IN_DAY * MINUTES_IN_HOUR;
  if (meridiem && selectedMeridiem) {
    if (selectedMeridiem === "AM") end = HOURS_IN_HALF_DAY * MINUTES_IN_HOUR;
    else start = HOURS_IN_HALF_DAY * MINUTES_IN_HOUR;
  }

  const numberOfOptions = Math.ceil((end - start) / interval);

  return Array.from({ length: numberOfOptions }, (_, i) => {
    const totalMinutes = start + i * interval;
    const fullDayHour = Math.floor(totalMinutes / MINUTES_IN_HOUR);
    const minuteOfHour = totalMinutes % MINUTES_IN_HOUR;
    let label: string;

    if (meridiem) {
      const meridiemHour = fullDayHour % HOURS_IN_HALF_DAY || HOURS_IN_HALF_DAY;
      label = `${meridiemHour.toString().padStart(2, "0")}:${minuteOfHour
        .toString()
        .padStart(TWO_DIGIT_PAD, "0")}`;
    } else {
      label = `${fullDayHour.toString().padStart(2, "0")}:${minuteOfHour
        .toString()
        .padStart(TWO_DIGIT_PAD, "0")}`;
    }
    return { id: label, label };
  });
};

/**
 * Converts a selected time and meridiem to a string in "HH:mm" format.
 * If the meridiem is used, it converts to 24-hour format. Otherwise, it returns the time as is.
 *
 * @param selectedTime Time string in "HH:mm" format.
 * @param selectedMeridiem "AM" or "PM" (used if meridiem is true).
 * @param meridiem Whether to use 12-hour (AM/PM) format.
 */
export const formatTimeFromSelection = (
  selectedTime: string | undefined,
  selectedMeridiem: "AM" | "PM",
  meridiem?: boolean,
): string | undefined => {
  if (!selectedTime) return undefined;

  if (!meridiem) {
    return selectedTime;
  }
  const [rawHourStr, minuteStr] = selectedTime.split(":");
  const rawHour = parseInt(rawHourStr, 10);

  if (Number.isNaN(rawHour)) return undefined;

  // Convert to 24-hour format if needed
  const hour = meridiem
    ? (rawHour % HOURS_IN_HALF_DAY) +
      (selectedMeridiem === "PM" ? HOURS_IN_HALF_DAY : 0)
    : rawHour;

  return `${hour.toString().padStart(2, "0")}:${minuteStr}`;
};

/**
 * Converts a 24-hour time string to a 12-hour format string.
 * @param selectedTime Time string in "HH:mm" format.
 * @param meridiem Whether to use 12-hour (AM/PM) format.
 */
export const getMenuValue = (
  selectedTime: string | undefined,
  meridiem?: boolean,
): string | undefined => {
  if (!selectedTime) return undefined;
  if (meridiem) {
    const [hours, minutes] = selectedTime.split(":");
    let hour = parseInt(hours, 10);
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  }
  return selectedTime;
};
