import moment from 'moment-timezone';
import memoize from 'memoize-one';
import groupBy from 'lodash/groupBy';

export const discretizeByAndFillMissing = memoize((table, start, end) => {
  const duration = moment.duration(moment(end).diff(moment(start)));

  let unitOfTime = 'month';
  let format = 'YYYY-MM';

  if (duration.asDays() > 100) {
    unitOfTime = 'month';
    format = 'YYYY-MM';
  } else if (duration.asDays() > 15) {
    unitOfTime = 'week';
    format = 'YYYY-MM-DD';
  } else if (duration.asDays() > 1) {
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
      grouped[m.startOf(unitOfTime).format(format)] = [{ v: 0 }];
    }
  }

  const finalTable = Object.keys(grouped)
    .map((k) => {
      const group = grouped[k];
      const r = {
        d: k,
        v: group.reduce((u, v) => u + v.v, 0),
      };
      return r;
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
});
