import { DateTime } from 'luxon';
import {
  RANGED_RAPID_SELECTIONS,
  SINGLE_RAPID_SELECTIONS,
  QUICK_DATE_SELECTIONS,
} from '#src/components/date/constants';

import type {
  DateFilterEnum,
  DateFilterRangeEnum,
} from '#src/libs/datatype-filtering/types';
import { ReportDateType } from '#src/libs/reporting/common/constants';

export const mapTimePeriodToDateValues = (
  dateStart: string,
  dateEnd: string,
  dateType: ReportDateType,
): DateFilterRangeEnum | DateFilterEnum => {
  if (dateType === 'range') {
    const timePeriodMapping = RANGED_RAPID_SELECTIONS.find((selection) => {
      const { dateStart: startTimeStamp, dateEnd: endTimestamp } =
        selection.getStartEndTimestamps();

      if (
        DateTime.fromSeconds(startTimeStamp).toISODate() === dateStart &&
        DateTime.fromSeconds(endTimestamp).toISODate() === dateEnd
      )
        return selection;
      return null;
    });

    /**
     * Filtering out dates defined in RANGED_RAPID_SELECTIONS but not in
     * QUICK_DATE_SELECTIONS
     */
    if (
      timePeriodMapping &&
      !QUICK_DATE_SELECTIONS.find(
        (quickDateSelection) =>
          quickDateSelection.timePeriod == timePeriodMapping.timePeriod,
      )
    )
      return 'custom';
    return timePeriodMapping?.timePeriod || 'custom';
  }
  if (dateType === 'single') {
    const timePeriodMapping = SINGLE_RAPID_SELECTIONS.find((selection) => {
      const timeStamp = selection.getTimeStamp();

      if (DateTime.fromSeconds(timeStamp).toISODate() === dateStart)
        return selection;
      return null;
    });
    return timePeriodMapping?.timePeriod || 'custom';
  }
  return 'custom';
};
