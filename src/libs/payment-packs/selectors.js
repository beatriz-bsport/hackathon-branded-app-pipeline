// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';

export const getAll = (state: State) => state.paymentPack.all;

const get = (state: State, id: number) =>
  getAll(state).find((pack) => pack.id === id);

export const getOne = (state: State, id: number) => state.paymentPack.byId[id];

export const getEnabled = createSelector(
  getAll,
  (pps) => pps.filter((pp) => !pp.disabled),
);

export const getPaymentPackById = (state: State): Array<PaymentPack> =>
  state.paymentPack.byId;

export const getActivityCompatiblePaymentPackAllIds = (
  state: State,
): Array<number> => state.paymentPack.byActivity.allIds;

export const getActivityCompatiblePaymentPacks = createSelector(
  [getActivityCompatiblePaymentPackAllIds, getPaymentPackById],
  (idList, paymentPacks) => idList.map((id) => paymentPacks[id]),
);

export default { get, getAll, getEnabled, getActivityCompatiblePaymentPacks };
