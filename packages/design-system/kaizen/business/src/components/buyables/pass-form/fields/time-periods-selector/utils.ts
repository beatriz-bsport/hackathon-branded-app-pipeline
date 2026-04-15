/**
 * The UI allows the manager to create diverse off peak/time periods.
 * However, from a data standpoint, what we are currently managing is
 * a list of time periods per day, without overlaping: Record<string, string[][]>
 * This means that the backend doesn't exactly store the time periods created in the UI.
 * For instance, if the manager updates a time period that creates overlapping with another,
 * when submitting the update, the time periods (UI) might be reorganized.
 *
 * This means we need to provide utils to:
 * - convert backend data into form data that is explicity manage by this form component
 * - convert form data into backend data
 */
import { getISOWeekday, getLocalNow } from "@bsport/datetime-manipulation";

import type {
  BackendSchedule,
  SelectedWeekDays,
  TimePeriodSchedule,
} from "./types";

export const SLOT_DURATIONS = {
  ALL_DAY: "allDay",
  TIME_SLOT: "timeSlot",
} as const;

const getUniqueIdentifier = () =>
  `time-periods-selector-${Math.random().toString(36).substring(2, 9)}`;

export function createTimeSlot(): string[] {
  return ["06:00", "07:00"];
}

export function createTimePeriodSchedule(): TimePeriodSchedule {
  const now = getLocalNow({});
  const todayWeekday = getISOWeekday(now).toString();

  return {
    slotDurationChoice: SLOT_DURATIONS.TIME_SLOT,
    selectedWeekDays: {
      "1": todayWeekday === "1",
      "2": todayWeekday === "2",
      "3": todayWeekday === "3",
      "4": todayWeekday === "4",
      "5": todayWeekday === "5",
      "6": todayWeekday === "6",
      "7": todayWeekday === "7",
    },
    timeSlots: [createTimeSlot()],
    identifier: getUniqueIdentifier(),
  };
}

const START_OF_DAY = "00:00";
const END_OF_DAY = "23:59";

/**
 * Converts an array of TimePeriodSchedule (form state) to a BackendSchedule record.
 * Each TimePeriodSchedule is processed to generate time slots for the selected days.
 * Overlapping or adjacent time slots are merged for each day.
 * If a schedule is marked as "allDay", it will override all other slots for the selected days.
 *
 * @param {TimePeriodSchedule[]} schedules - Array of TimePeriodSchedule objects from the form state.
 * @returns {BackendSchedule} A record where keys are day numbers (1-7) and values are arrays of time slots.
 *
 * @example
 * // Input:
 * const schedules = [
 *   {
 *     timeSlots: [["06:30", "07:30"], ["16:25", "17:50"]],
 *     selectedWeekDays: { 1: false, 2: true, 3: false, 4: false, 5: false, 6: false, 7: false },
 *     slotDurationChoice: "timeSlot",
 *     identifier: "schedule_1",
 *   },
 *   {
 *     timeSlots: [],
 *     selectedWeekDays: { 1: true, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
 *     slotDurationChoice: "allDay",
 *     identifier: "schedule_2",
 *   },
 * ];
 *
 * // Output:
 * {
 *   "1": [["00:00", "23:59"]],
 *   "2": [["06:30", "07:30"], ["16:25", "17:50"]],
 * }
 */
export function convertFormToBackendTimeRestrictions(
  schedules: TimePeriodSchedule[],
): BackendSchedule {
  const backendSchedule: BackendSchedule = {};

  schedules.forEach((schedule) => {
    const { timeSlots, selectedWeekDays, slotDurationChoice } = schedule;
    const slots =
      slotDurationChoice === SLOT_DURATIONS.ALL_DAY
        ? [[START_OF_DAY, END_OF_DAY]]
        : // Filter out invalid slots where the start time is after the end time
          [...timeSlots.filter((slot) => slot[1].localeCompare(slot[0]) > 0)];

    Object.entries(selectedWeekDays).forEach(([day, isSelected]) => {
      if (isSelected) {
        if (!backendSchedule[day]) {
          backendSchedule[day] = [];
        }
        backendSchedule[day].push(...slots);
      }
    });
  });

  // Merge overlapping slots for each day
  Object.keys(backendSchedule).forEach((day) => {
    const slots = backendSchedule[day];
    slots.sort((a, b) => a[0].localeCompare(b[0]));

    const mergedSlots: string[][] = [];
    let currentSlot = slots[0];

    for (let i = 1; i < slots.length; i++) {
      const [currentStart, currentEnd] = currentSlot;
      const [nextStart, nextEnd] = slots[i];

      if (nextStart <= currentEnd) {
        // Overlapping or adjacent, merge them
        currentSlot = [
          currentStart,
          currentEnd > nextEnd ? currentEnd : nextEnd,
        ];
      } else {
        mergedSlots.push(currentSlot);
        currentSlot = slots[i];
      }
    }
    mergedSlots.push(currentSlot);
    backendSchedule[day] = mergedSlots;
  });

  return backendSchedule;
}

/**
 * Converts a BackendSchedule record back to an array of TimePeriodSchedule objects (form state).
 * Days with identical time slots are grouped together, and "allDay" schedules are detected.
 * Each resulting TimePeriodSchedule will have its selectedWeekDays and slotDurationChoice set accordingly.
 *
 * @param {BackendSchedule} backendSchedule - A record where keys are day numbers (1-7) and values are arrays of time slots.
 * @returns {TimePeriodSchedule[]} Array of TimePeriodSchedule objects, ready for use in the form state.
 *
 * @example
 * // Input:
 * const backendSchedule = {
 *   "1": [["00:00", "23:59"]],
 *   "2": [["06:30", "07:30"], ["16:25", "17:50"]],
 *   "3": [["06:30", "07:30"], ["16:25", "17:50"]],
 * };
 *
 * // Output:
 * [
 *   {
 *     timeSlots: [],
 *     selectedWeekDays: { 1: true, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
 *     slotDurationChoice: "allDay",
 *     identifier: "unique_id_1",
 *   },
 *   {
 *     timeSlots: [["06:30", "07:30"], ["16:25", "17:50"]],
 *     selectedWeekDays: { 1: false, 2: true, 3: true, 4: false, 5: false, 6: false, 7: false },
 *     slotDurationChoice: "timeSlot",
 *     identifier: "unique_id_2",
 *   },
 * ]
 */
export function convertBackendToFormTimeRestrictions(
  backendSchedule: BackendSchedule,
): TimePeriodSchedule[] {
  const formSchedules: TimePeriodSchedule[] = [];
  const timeSlotToDays = new Map<string, number[]>();

  // Group days by identical time slots
  Object.entries(backendSchedule).forEach(([day, slots]) => {
    const slotKey = slots.map((slot) => slot.join(",")).join("|");
    if (!timeSlotToDays.has(slotKey)) {
      timeSlotToDays.set(slotKey, []);
    }
    timeSlotToDays.get(slotKey)!.push(Number(day));
  });

  // Create form schedules
  timeSlotToDays.forEach((days, slotKey) => {
    const slots = slotKey.split("|").map((slot) => slot.split(","));
    const isAllDay =
      slots.length === 1 &&
      slots[0][0] === START_OF_DAY &&
      slots[0][1] === END_OF_DAY;

    const selectedWeekDays: SelectedWeekDays = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
    };
    days.forEach((day) => {
      selectedWeekDays[day as keyof SelectedWeekDays] = true;
    });

    formSchedules.push({
      timeSlots: isAllDay ? [] : slots,
      selectedWeekDays,
      slotDurationChoice: isAllDay
        ? SLOT_DURATIONS.ALL_DAY
        : SLOT_DURATIONS.TIME_SLOT,
      identifier: getUniqueIdentifier(),
    });
  });

  return formSchedules;
}
