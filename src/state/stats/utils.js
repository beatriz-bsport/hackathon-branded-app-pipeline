import moment from 'moment-timezone';
import memoize from 'memoize-one';
import groupBy from 'lodash/groupBy';
import {
  DAILY_DURATION_DISPLAY_LIMIT,
  WEEKLY_DURATION_DISPLAY_LIMIT,
  MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS,
} from '#libs/statistics/utils';

export const discretizeByAndFillMissing = memoize(
  (
    table,
    start,
    end,
    aggregationFunctionName?: 'count' | 'sum' | 'avg' | 'min' | 'max',
  ) => {
    const duration = moment.duration(moment(end).diff(moment(start)));

    let unitOfTime = 'month';
    let format = 'YYYY-MM';

    if (duration.asDays() > MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS) {
      unitOfTime = 'month';
      format = 'YYYY-MM';
    } else if (duration.asDays() > WEEKLY_DURATION_DISPLAY_LIMIT) {
      unitOfTime = 'week';
      format = 'YYYY-MM-DD';
    } else if (duration.asDays() > DAILY_DURATION_DISPLAY_LIMIT) {
      unitOfTime = 'day';
      format = 'YYYY-MM-DD';
    } else {
      unitOfTime = 'hour';
      format = 'YYYY-MM-DD LT';
    }

    const grouped = groupBy(table, (u) => {
      return moment(u.d).startOf(unitOfTime).format(format);
    });

    for (
      let m = moment(start);
      m.isBefore(moment(end).endOf(unitOfTime)) ||
      m.isSame(moment(end).endOf(unitOfTime));
      m.add(1, `${unitOfTime}s`)
    ) {
      if (!grouped[m.startOf(unitOfTime).format(format)]) {
        grouped[m.startOf(unitOfTime).format(format)] = [{ v: 0, count: 0 }];
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
        if (moment(a.d).isBefore(moment(b.d))) {
          return -1;
        }
        return 1;
      });

    // Prevent from having a single data point
    if (finalTable.length === 1) {
      finalTable.unshift({
        d: moment(finalTable[0].d).subtract(1, 'hours').format('YYYY-MM-DD LT'),
        v: 0,
      });
    }
    return finalTable;
  },
);
