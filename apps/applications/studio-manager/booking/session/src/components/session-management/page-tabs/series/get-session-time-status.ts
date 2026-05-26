import { fromIsoString, modifyTime } from "@bsport/datetime-manipulation";

export type SessionTimeStatus = "upcoming" | "ongoing" | "past" | "cancelled";

export const getSessionTimeStatus = ({
  dateStart,
  durationMinute,
  available,
  timeZone,
  now = new Date(),
}: {
  dateStart: string;
  durationMinute: number;
  available: boolean;
  timeZone?: string;
  now?: Date;
}): SessionTimeStatus => {
  if (!available) return "cancelled";

  const start = fromIsoString(dateStart, { zone: timeZone });
  const end = modifyTime({
    datetime: start,
    duration: { minute: durationMinute },
    operator: "plus",
  });

  const nowMs = now.getTime();
  if (nowMs < start.toMillis()) return "upcoming";
  if (nowMs < end.toMillis()) return "ongoing";
  return "past";
};
