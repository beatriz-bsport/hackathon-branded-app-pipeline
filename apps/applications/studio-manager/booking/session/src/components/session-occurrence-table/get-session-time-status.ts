import { getSessionStartEnd } from "#src/utils/session-time-range";

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

  const { start, end } = getSessionStartEnd({
    dateStart,
    durationMinute,
    zone: timeZone,
  });

  const nowMs = now.getTime();
  if (nowMs < start.toMillis()) return "upcoming";
  if (nowMs < end.toMillis()) return "ongoing";
  return "past";
};
