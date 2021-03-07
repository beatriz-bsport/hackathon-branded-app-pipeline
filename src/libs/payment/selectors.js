// @flow
import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import type { State } from '../../state/types';

const EMPTY_LIST = Immutable([]);

export const getSavedPaymentMethodList = (state: State): any => {
  if (state.paymentBackend.paymentMethod.loading) {
    return EMPTY_LIST;
  }
  return state.paymentBackend.paymentMethod.items;
};

export const getPaymentGroupData = (state: State): any => {
  return state.paymentBackend.paymentGroup.byId;
};

export const getPaymentGroupListIds = (state: State): any => {
  return state.paymentBackend.paymentGroup.allIds;
};

export const getPaymentGroupList = createSelector(
  [getPaymentGroupData, getPaymentGroupListIds],
  (data, ids) => ids.map((id) => data[id]),
);

const secondParam = (state, params) => params;

export const getPaymentGroupRequiringActionList = createSelector(
  [getPaymentGroupList, secondParam],
  (groupList, uuid) =>
    groupList.filter((pg) => pg.status === 150 && pg.invoice === uuid),
);

const _getPayoutListIds = (state) => state.paymentBackend.payout.allIds;
const _getPayoutData = (state) => state.paymentBackend.payout.byId;

export const getPayoutList = createSelector(
  [_getPayoutListIds, _getPayoutData],
  (ids, data) => ids.map((id) => data[id]),
);
