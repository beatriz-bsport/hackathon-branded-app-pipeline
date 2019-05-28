// @flow

import type { State } from '../../state/types';

const getUnsorted = (state: State) => state.alerting.items || [];

const countAlerting = (state: State) => getUnsorted(state).length;

const get = (state: State) =>
  getUnsorted(state)
    .asMutable()
    .sort((a, b) => {
      const aDate = a.date;
      const bDate = b.date;
      if (aDate < bDate) {
        return -1;
      }
      if (aDate > bDate) {
        return 1;
      }
      return 0;
    });

export default { get, countAlerting };
