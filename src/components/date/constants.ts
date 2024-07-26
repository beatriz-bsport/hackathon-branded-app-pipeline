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
  {
    timePeriod: 'yesterday',
    getTimeStamp: () => DateTime.now().minus({ days: 1 }).toUnixInteger(),
  },
];

export const RANGED_RAPID_SELECTIONS: {
  timePeriod: DateFilterRangeEnum;
  getStartEndTimestamps: () => { dateStart: number; dateEnd: number };
  isPastDisplayed?: boolean;
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
    timePeriod: 'last_week',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ days: 7 })
        .startOf('week', { useLocaleWeeks: true })
        .toUnixInteger(),
      dateEnd: DateTime.now()
        .minus({ days: 7 })
        .endOf('week', { useLocaleWeeks: true })
        .toUnixInteger(),
    }),
    isPastDisplayed: true,
  },
  {
    timePeriod: 'last_month',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ month: 1 })
        .startOf('month')
        .toUnixInteger(),
      dateEnd: DateTime.now()
        .minus({ month: 1 })
        .endOf('month')
        .toUnixInteger(),
    }),
    isPastDisplayed: true,
  },
  {
    timePeriod: 'last_year',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ year: 1 })
        .startOf('year')
        .toUnixInteger(),
      dateEnd: DateTime.now().minus({ year: 1 }).endOf('year').toUnixInteger(),
    }),
    isPastDisplayed: true,
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

export const QUICK_DATE_SELECTIONS: {
  timePeriod: DateFilterRangeEnum | DateFilterEnum;
  withBottomDivider?: boolean;
  type: 'single' | 'range';
}[] = [
  {
    timePeriod: 'week',
    type: 'range',
  },
  {
    timePeriod: 'month',
    type: 'range',
  },
  {
    timePeriod: 'year',
    withBottomDivider: true,
    type: 'range',
  },
  {
    timePeriod: 'last_week',
    type: 'range',
  },
  {
    timePeriod: 'last_month',
    type: 'range',
  },
  {
    timePeriod: 'last_year',
    withBottomDivider: true,
    type: 'range',
  },
  {
    timePeriod: 'custom',
    type: 'range',
  },
  {
    timePeriod: 'today',
    type: 'single',
  },
  {
    timePeriod: 'yesterday',
    type: 'single',
  },
];
