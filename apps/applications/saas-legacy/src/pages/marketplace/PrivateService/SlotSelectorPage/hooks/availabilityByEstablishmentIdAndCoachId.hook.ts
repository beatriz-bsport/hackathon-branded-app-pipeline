import { useCallback, useMemo } from 'react';
import { findIntervalsIntersections } from '#src/libs/private-service/interval-utils';
import useAvailableIntervalsByResourceId from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks/availableIntervalsByResourceId.hook';
import { Interval } from 'luxon';
import type {
  AvailabilityByEstablishmentAndCoach,
  AvailableIntervalByCoachId,
} from '#src/libs/private-service/types';

/**
 * Custom hook to compute intersecting availabilities between establishments and coaches.
 *
 * This hook uses available intervals by establishment and coach to find overlapping availabilities.
 * It organizes these by establishment, providing both establishment-wide availability and
 * the intersecting availability of each coach per establishment.
 *
 * @returns {AvailabilityByEstablishmentAndCoach} - An object that maps each establishment ID to:
 *   - `establishmentAvailabilities`: Array of available intervals for the establishment.
 *   - `coachAvailabilities`: Object mapping each coach ID to their intersecting available intervals.
 */
const useAvailabilityByEstablishmentIdAndCoachId = () => {
  const { availableIntervalByCoachId, availableIntervalByEstablishmentId } =
    useAvailableIntervalsByResourceId();
  const getIntersectingCoachAvailabilities = useCallback(
    (
      coachesAvailableInterval: AvailableIntervalByCoachId,
      establishmentAvailabilities: Interval[],
    ) => {
      return Object.entries(coachesAvailableInterval).reduce(
        (intersectingCoachAvailabilities, [coachId, coachIntervals]) => {
          const intersectedIntervals = findIntervalsIntersections(
            establishmentAvailabilities,
            coachIntervals,
          );
          intersectingCoachAvailabilities[coachId] = intersectedIntervals;

          return intersectingCoachAvailabilities;
        },
        {} as AvailableIntervalByCoachId,
      );
    },
    [],
  );
  const availabilityByEstablishmentAndCoach: AvailabilityByEstablishmentAndCoach =
    useMemo(() => {
      return Object.entries(availableIntervalByEstablishmentId).reduce<
        Record<
          string,
          {
            establishmentAvailabilities: Interval[];
            coachAvailabilities: AvailableIntervalByCoachId;
          }
        >
      >((acc, [establishmentId, establishmentAvailabilities]) => {
        acc[establishmentId] = {
          establishmentAvailabilities: establishmentAvailabilities,
          coachAvailabilities: getIntersectingCoachAvailabilities(
            availableIntervalByCoachId,
            establishmentAvailabilities,
          ),
        };
        return acc;
      }, {} as AvailabilityByEstablishmentAndCoach);
    }, [
      availableIntervalByCoachId,
      availableIntervalByEstablishmentId,
      getIntersectingCoachAvailabilities,
    ]);

  return availabilityByEstablishmentAndCoach;
};

export default useAvailabilityByEstablishmentIdAndCoachId;
