import moment from 'moment-timezone';
import groupBy from 'lodash/groupBy';

export function discretizeByAndFillMissing(table, start, end) {
  const duration = moment.duration(moment(end).diff(moment(start)));
  let grouped = {};

  if (duration.asDays() > 100) {
    grouped = groupBy(table, (u) => moment(u.d).format('YYYY-MM'));
    for (
      let m = moment(start);
      m.isBefore(end) || m.isSame(end);
      m.add(1, 'months')
    ) {
      if (!grouped[m.format('YYYY-MM')]) {
        grouped[m.format('YYYY-MM')] = [{ v: 0 }];
      }
    }
  } else if (duration.asDays() > 15) {
    // ugly AF sorry
    grouped = groupBy(table, (u) => {
      return moment(u.d)
        .clone()
        .startOf('week')
        .format('YYYY-MM-DD');
    });
    for (
      let m = moment(start);
      m.isBefore(end) || m.isSame(end);
      m.add(7, 'days')
    ) {
      if (
        !grouped[
          m
            .clone()
            .startOf('week')
            .format('YYYY-MM-DD')
        ]
      ) {
        grouped[
          m
            .clone()
            .startOf('week')
            .format('YYYY-MM-DD')
        ] = [{ v: 0 }];
      }
    }
  } else if (duration.asDays() > 1) {
    grouped = groupBy(table, (u) => moment(u.d).format('YYYY-MM-DD'));
    for (
      let m = moment(start);
      m.isBefore(end) || m.isSame(end);
      m.add(1, 'days')
    ) {
      if (!grouped[m.format('YYYY-MM-DD')]) {
        grouped[m.format('YYYY-MM-DD')] = [{ v: 0 }];
      }
    }
  } else {
    grouped = groupBy(table, (u) => moment(u.d).format('YYYY-MM-DD LT'));
    for (
      let m = moment(start);
      m.isBefore(end) || m.isSame(end);
      m.add(1, 'hours')
    ) {
      if (!grouped[m.format('YYYY-MM-DD LT')]) {
        grouped[m.format('YYYY-MM-DD LT')] = [{ v: 0 }];
      }
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
      d: moment(finalTable[0].d)
        .subtract(1, 'hours')
        .format('YYYY-MM-DD LT'),
      v: 0,
    });
  }
  return finalTable;
}

export const dateFormatter = (domain) => {
  const duration = moment.duration(moment(domain[1]).diff(moment(domain[0])));
  if (duration.asDays() > 100) {
    return (d) => moment(d).format('MMM YYYY');
  }
  if (duration.asDays() > 15) {
    return (d) => moment(d).format('DD MMM');
  }
  if (duration.asDays() > 1) {
    return (d) => moment(d).format('ddd DD MMM');
  }
  return (d) => moment(d).format('LT');
};
