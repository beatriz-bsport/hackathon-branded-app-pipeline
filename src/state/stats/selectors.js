// @flow

import moment from 'moment';
import { createSelector } from 'reselect';

export const dateRangeSelector = (state) => ({
  start: moment(state.stats.dateRange.start),
  end: moment(state.stats.dateRange.end),
});

function statSelector(identifier) {
  return createSelector(
    dateRangeSelector,
    (state) => {
      const stat = state.stats.stats[identifier];
      return (stat && stat.data) || [];
    },
    (dateRange, data) => {
      const table = data.filter(
        (x) => x.d >= dateRange.start && x.d <= dateRange.end,
      );
      const total = table.reduce((sum, x) => sum + x.v, 0);
      return { table, total };
    },
  );
}

export const bookingStatSelector = statSelector('bookings');
export const newMembersStatSelector = statSelector('newMembers');
export const turnoverStatSelector = statSelector('turnover');
