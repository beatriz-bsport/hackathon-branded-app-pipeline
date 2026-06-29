import type { EnrichedSession } from "../../types";

type OccupancyInput = Pick<
  EnrichedSession,
  "available" | "effectif" | "nb_bookings"
>;

/**
 * Computes the enrolled/occupancy percentage for a day's sessions.
 *
 * Cancelled sessions (`available === false`) are excluded from both the
 * booking count and the capacity, so they no longer drag the rate down with
 * empty capacity. See BOO-2949.
 */
export const computeDayOccupancyRate = (sessions: OccupancyInput[]): number => {
  const activeSessions = sessions.filter((session) => session.available);

  const totalEffectif = activeSessions.reduce(
    (acc, session) => acc + session.effectif,
    0,
  );
  const totalOccupancy = activeSessions.reduce(
    (acc, session) => acc + session.nb_bookings,
    0,
  );

  return totalEffectif ? Math.round((totalOccupancy / totalEffectif) * 100) : 0;
};
