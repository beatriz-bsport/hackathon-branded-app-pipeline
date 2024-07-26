import { DateTime } from 'luxon';

import type {
  DateFilterEnum,
  DateFilterRangeEnum,
} from '#src/libs/datatype-filtering/types';

export const SINGLE_RAPID_SELECTIONS: {
  timePeriod: DateFilterEnum;
  getTimeStamp: () => number;
}[] = [
  {
    timePeriod: 'today',
    getTimeStamp: () => DateTime.now().toUnixInteger(),
  },
];

export const RANGED_RAPID_SELECTIONS: {
  timePeriod: DateFilterRangeEnum;
  getStartEndTimestamps: () => { dateStart: number; dateEnd: number };
  displayPast?: boolean;
  futureOnly?: boolean;
}[] = [
  {
    timePeriod: 'week',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ days: 7 })
        .startOf('day')
        .toUnixInteger(),
      dateEnd: DateTime.now().endOf('day').toUnixInteger(),
    }),
  },
  {
    timePeriod: 'month',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ months: 1 })
        .startOf('day')
        .toUnixInteger(),
      dateEnd: DateTime.now().endOf('day').toUnixInteger(),
    }),
  },
  {
    timePeriod: 'trimester',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ months: 3 })
        .startOf('day')
        .toUnixInteger(),
      dateEnd: DateTime.now().endOf('day').toUnixInteger(),
    }),
  },
  {
    timePeriod: 'year',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ years: 1 })
        .startOf('day')
        .toUnixInteger(),
      dateEnd: DateTime.now().endOf('day').toUnixInteger(),
    }),
  },
  {
    timePeriod: 'next_week',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now().startOf('day').toUnixInteger(),
      dateEnd: DateTime.now().plus({ days: 7 }).endOf('day').toUnixInteger(),
    }),
    futureOnly: true,
  },
  {
    timePeriod: 'next_month',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now().startOf('day').toUnixInteger(),
      dateEnd: DateTime.now().plus({ months: 1 }).endOf('day').toUnixInteger(),
    }),
    futureOnly: true,
  },
  {
    timePeriod: 'next_trimester',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now().startOf('day').toUnixInteger(),
      dateEnd: DateTime.now().plus({ months: 3 }).endOf('day').toUnixInteger(),
    }),
    futureOnly: true,
  },
  {
    timePeriod: 'next_year',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now().startOf('day').toUnixInteger(),
      dateEnd: DateTime.now().plus({ years: 1 }).endOf('day').toUnixInteger(),
    }),
    futureOnly: true,
  },
];
