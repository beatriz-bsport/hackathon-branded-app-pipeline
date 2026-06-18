/**
 * Utils about pauses that can be used for both ContractPause and MembershipPlanPause
 */
import { useMemo } from "react";

import {
  fromIsoString,
  getTodayJSDate,
  isPast,
  isWithinRange,
  toDateTime,
} from "@bsport/datetime-manipulation";

import { useTranslation } from "#src/utils/i18n";

export const PAUSE_STATUSES = {
  ACTIVE: "ACTIVE",
  SCHEDULED: "SCHEDULED",
  ENDED: "ENDED",
} as const;

export type PauseStatus = keyof typeof PAUSE_STATUSES;

export const usePauseStatusesTranslations = () => {
  const { t, i18n } = useTranslation("contract-features");

  return useMemo(
    () => ({
      [PAUSE_STATUSES.ACTIVE]: t("pauseStatus.active"),
      [PAUSE_STATUSES.SCHEDULED]: t("pauseStatus.scheduled"),
      [PAUSE_STATUSES.ENDED]: t("pauseStatus.ended"),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language],
  );
};

export function getPauseStatus({
  fromDate,
  untilDate,
}: {
  fromDate: string;
  untilDate: string;
}): PauseStatus {
  // Safeguard for very old pauses that don't have fromDate or untilDate
  if (!fromDate || !untilDate) {
    return PAUSE_STATUSES.ENDED;
  }

  if (isPast(untilDate)) {
    return PAUSE_STATUSES.ENDED;
  }

  const dateStart = fromIsoString(fromDate);
  const dateEnd = fromIsoString(untilDate);
  if (isWithinRange(toDateTime(getTodayJSDate()), dateStart, dateEnd)) {
    return PAUSE_STATUSES.ACTIVE;
  }

  return PAUSE_STATUSES.SCHEDULED;
}
