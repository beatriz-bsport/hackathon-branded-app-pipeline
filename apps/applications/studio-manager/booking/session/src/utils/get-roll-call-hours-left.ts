import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";

export type RollCallTimeLeft = {
  hours: number;
  minutes: number;
  totalMinutes: number;
};

export const getRollCallTimeLeft = (
  dateRollCallLastModified: string,
  noShowValidatedNumberOfHours: number,
): RollCallTimeLeft => {
  const rollCallDate = fromIsoString(dateRollCallLastModified);
  const now = getLocalNow({});
  const diff = now.diff(rollCallDate, ["hours", "minutes"]);
  const totalMinutesElapsed = diff.hours * 60 + diff.minutes;
  const totalMinutesLeft =
    noShowValidatedNumberOfHours * 60 - totalMinutesElapsed;

  if (totalMinutesLeft <= 0) {
    return { hours: 0, minutes: 0, totalMinutes: 0 };
  }

  return {
    hours: Math.floor(totalMinutesLeft / 60),
    minutes: Math.round(totalMinutesLeft % 60),
    totalMinutes: Math.round(totalMinutesLeft),
  };
};
