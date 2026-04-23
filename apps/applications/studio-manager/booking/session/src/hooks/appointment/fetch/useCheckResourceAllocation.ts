import { useCallback, useState } from "react";

import { checkResourceAllocationAPI } from "@bsport/api-book";

import type { EnrichedAppointment } from "#src/types";
import { fetch } from "#src/utils/fetch";

import {
  getDurationMinutes,
  isResourceUnavailable,
} from "./resource-allocation.utils";

const checkAllocation = checkResourceAllocationAPI.bind(null, fetch);

type ResourceAvailability = {
  coach: boolean;
  establishment: boolean;
};

type UseCheckResourceAllocationResult = {
  unavailable: ResourceAvailability;
  isChecking: boolean;
  checkAvailability: (
    dateStart: string,
    overrides?: { coachId?: number },
  ) => Promise<boolean>;
  resetAvailability: () => void;
};

export const useCheckResourceAllocation = (
  appointment: EnrichedAppointment,
): UseCheckResourceAllocationResult => {
  const [unavailable, setUnavailable] = useState<ResourceAvailability>({
    coach: false,
    establishment: false,
  });
  const [isChecking, setIsChecking] = useState(false);

  const durationMinutes = getDurationMinutes(appointment);

  const checkAvailability = useCallback(
    async (
      dateStart: string,
      overrides?: { coachId?: number },
    ): Promise<boolean> => {
      setIsChecking(true);
      setUnavailable({ coach: false, establishment: false });

      const coachId = overrides?.coachId ?? appointment.coach;
      const isReschedule = !overrides?.coachId;

      // When rescheduling, exclude the appointment's own slot from the busy
      const currentSlot = isReschedule
        ? {
            dateStart: appointment.date_start,
            dateEnd: appointment.date_end,
          }
        : undefined;

      const coachRequest = checkAllocation(appointment.private_slot, {
        resource_type: "coach",
        resource_id: coachId,
        date: dateStart,
        restrict_on_establishment: appointment.establishment,
      }).catch(() => null);

      const establishmentRequest = isReschedule
        ? checkAllocation(appointment.private_slot, {
            resource_type: "establishment",
            resource_id: appointment.establishment,
            date: dateStart,
          }).catch(() => null)
        : Promise.resolve(null);

      try {
        const [coachIntervals, establishmentIntervals] = await Promise.all([
          coachRequest,
          establishmentRequest,
        ]);

        // null intervals: fetch failed → fail open (treat as available).
        // empty intervals: resource has no windows → unavailable.
        const isUnavailable = (intervals: string[][] | null) =>
          intervals !== null &&
          isResourceUnavailable(
            intervals,
            dateStart,
            durationMinutes,
            currentSlot,
          );

        const coachUnavailable = isUnavailable(coachIntervals);
        const establishmentUnavailable = isUnavailable(establishmentIntervals);

        setUnavailable({
          coach: coachUnavailable,
          establishment: establishmentUnavailable,
        });

        return !coachUnavailable && !establishmentUnavailable;
      } finally {
        setIsChecking(false);
      }
    },
    [
      appointment.coach,
      appointment.establishment,
      appointment.private_slot,
      appointment.date_start,
      appointment.date_end,
      durationMinutes,
    ],
  );

  const resetAvailability = useCallback(() => {
    setUnavailable({ coach: false, establishment: false });
  }, []);

  return { unavailable, isChecking, checkAvailability, resetAvailability };
};
