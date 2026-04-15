import type { WeekStartDay } from "@bsport/datetime-manipulation";

export type SelectedWeekDays = Record<WeekStartDay, boolean>;

export type TimePeriodSchedule = {
  timeSlots: string[][];
  selectedWeekDays: SelectedWeekDays;
  slotDurationChoice: "timeSlot" | "allDay";
  identifier: string;
};

export type BackendSchedule = Record<string, string[][]>;
