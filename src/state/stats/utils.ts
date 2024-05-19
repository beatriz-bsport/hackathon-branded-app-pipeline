import memoize from 'memoize-one';
import groupBy from 'lodash/groupBy';
import { DateTime } from 'luxon';
import {
  DAILY_DURATION_DISPLAY_LIMIT,
  WEEKLY_DURATION_DISPLAY_LIMIT,
  MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS,
  // @ts-expect-error
} from '#libs/statistics/utils';

export const discretizeByAndFillMissing = memoize(
  (
    table,
    start,
    end,
    aggregationFunctionName?: 'count' | 'sum' | 'avg' | 'min' | 'max',
  ) => {
    const duration = DateTime.fromISO(end).diff(
      DateTime.fromISO(start),
      'days',
    );
    let unitOfTime = 'month' as 'month' | 'week' | 'day' | 'hour';
    let format = 'yyyy-MM' as 'yyyy-MM' | 'yyyy-MM-dd' | 'yyyy-MM-dd t';

    if (duration.as('days') > MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS) {
      unitOfTime = 'month';
      format = 'yyyy-MM';
    } else if (duration.as('days') > WEEKLY_DURATION_DISPLAY_LIMIT) {
      unitOfTime = 'week';
      format = 'yyyy-MM-dd';
    } else if (duration.as('days') > DAILY_DURATION_DISPLAY_LIMIT) {
      unitOfTime = 'day';
      format = 'yyyy-MM-dd';
    } else {
      unitOfTime = 'hour';
      format = 'yyyy-MM-dd t';
    }

    const grouped = groupBy(table, (u) =>
      DateTime.fromISO(u.d).startOf(unitOfTime).toFormat(format),
    );

    for (
      let m = DateTime.fromISO(start);
      m < DateTime.fromISO(end).endOf(unitOfTime) ||
      m === DateTime.fromISO(end).endOf(unitOfTime);
      m = m.plus({
        ...(unitOfTime === 'month' ? { months: 1 } : {}),
        ...(unitOfTime === 'day' ? { days: 1 } : {}),
        ...(unitOfTime === 'week' ? { weeks: 1 } : {}),
        ...(unitOfTime === 'hour' ? { hours: 1 } : {}),
      })
    ) {
      if (!grouped[m.startOf(unitOfTime).toFormat(format)]) {
        grouped[m.startOf(unitOfTime).toFormat(format)] = [{ v: 0, count: 0 }];
      }
    }

    const finalTable = Object.keys(grouped)
      .map((k) => {
        const group = grouped[k];
        let totalSum;
        let totalCount;
        switch (aggregationFunctionName) {
          case 'min':
            return {
              d: k,
              v: group.reduce((u, v) => Math.min(u, v.v), Infinity),
            };
          case 'max':
            return {
              d: k,
              v: group.reduce((u, v) => Math.max(u, v.v), -Infinity),
            };
          case 'avg':
            totalSum = group.reduce((u, v) => u + v.v * v.count, 0);
            totalCount = group.reduce((u, v) => u + v.count, 0);
            return {
              d: k,
              v: totalSum / (totalCount || 1),
            };
          default:
            return {
              d: k,
              v: group.reduce((u, v) => u + v.v, 0),
            };
        }
      })
      .sort((a, b) => {
        if (DateTime.fromISO(a.d) < DateTime.fromISO(b.d)) {
          return -1;
        }
        return 1;
      });

    // Prevent from having a single data point
    if (finalTable.length === 1) {
      finalTable.unshift({
        d: DateTime.fromISO(finalTable[0].d)
          .minus({ hours: 1 })
          .toFormat('yyyy-MM-dd t'),
        v: 0,
      });
    }
    return finalTable;
  },
);
