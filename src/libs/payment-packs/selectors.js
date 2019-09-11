// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';

const getAll = (state: State) => state.paymentPack.all;

const get = (state: State, id: number) =>
  getAll(state).find((pack) => pack.id === id);

const getEnabled = createSelector(
  getAll,
  (pps) => pps.filter((pp) => !pp.disabled),
);

export default { get, getAll, getEnabled };
