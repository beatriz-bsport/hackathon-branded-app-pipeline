import { DateTime } from 'luxon';
import { RANGED_RAPID_SELECTIONS } from '#src/components/date/constants';
import type {
  DateFilterEnum,
  DateFilterRangeEnum,
} from '#src/libs/datatype-filtering/types';

export const mapTimePeriodToDateValues = (
  dateStart: string,
  dateEnd: string,
): DateFilterRangeEnum | DateFilterEnum => {
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
  return timePeriodMapping?.timePeriod || 'custom';
};
