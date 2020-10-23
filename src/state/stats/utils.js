import moment from 'moment-timezone';
import memoize from 'memoize-one';
import groupBy from 'lodash/groupBy';

export const discretizeByAndFillMissing = memoize((table, start, end) => {
  const duration = moment.duration(moment(end).diff(moment(start)));
  let grouped = {};

  if (duration.asDays() > 100) {
    grouped = groupBy(table, (u) => moment(u.d).format('YYYY-MM'));
    for (
      let m = moment(start);
      m.isBefore(moment(end).endOf('month')) ||
      m.isSame(moment(end).endOf('month'));
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
      m.isBefore(moment(end).endOf('week')) ||
      m.isSame(moment(end).endOf('week'));
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
      m.isBefore(moment(end).endOf('day')) ||
      m.isSame(moment(end).endOf('day'));
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
      m.isBefore(moment(end).endOf('hour')) ||
      m.isSame(moment(end).endOf('hour'));
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
});

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

// add spaces and if float, makes sure that displayd with 2 decimal digits
export const numberFormatter = (isCurrencyFormat) => (x) => {
  const parts = parseInt(x, 10)
    .toString()
    .split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (parts.length === 2 && parts[1].length === 1) parts[1] += '0';
  return `${parts.join('.')}${isCurrencyFormat ? '€' : ''}`;
};
