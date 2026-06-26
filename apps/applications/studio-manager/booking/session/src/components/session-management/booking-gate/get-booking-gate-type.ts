import {
  fromIsoString,
  getLocalNow,
  modifyTime,
} from "@bsport/datetime-manipulation";

export type BookingGateType = "overbook" | "started" | "ended";

type SessionForGate = {
  date_start: string;
  duration_minute: number;
  timezone_name: string;
  full: boolean;
};

export const getBookingGateType = (
  session: SessionForGate,
): BookingGateType | null => {
  const zone = session.timezone_name;
  const now = getLocalNow({ zone });
  const start = fromIsoString(session.date_start, { zone });
  const end = modifyTime({
    datetime: start,
    duration: { minute: session.duration_minute },
    operator: "plus",
  });

  // This order respects the priority of the gates: if a session is both full and started, we want to show the "overbook" gate first.
  if (now >= end) return "ended";
  if (session.full) return "overbook";
  if (now >= start) return "started";

  return null;
};
