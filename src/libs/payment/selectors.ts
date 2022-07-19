import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import { PaymentMethod, Payout } from './types';
import { PaymentGroup } from '#libs/invoice/types';

const EMPTY_LIST = Immutable([]);

export const getSavedPaymentMethodList = (
  state: RootState,
): Immutable.Immutable<Array<PaymentMethod>> => {
  if (state.paymentBackend.paymentMethod.loading) {
    return EMPTY_LIST;
  }
  return state.paymentBackend.paymentMethod.items;
};

export const getPaymentGroupData = (
  state: RootState,
): Immutable.Immutable<{ [id: string]: PaymentGroup }> => {
  return state.paymentBackend.paymentGroup.byId;
};

export const getPaymentGroupListIds = (
  state: RootState,
): Immutable.Immutable<Array<string>> => {
  return state.paymentBackend.paymentGroup.allIds;
};

export const getPaymentGroupList = createSelector(
  [getPaymentGroupData, getPaymentGroupListIds],
  (data, ids) => ids.map((id) => data[id]),
);

const secondParam = (state: RootState, params: any) => params;

export const getPaymentGroupRequiringActionList = createSelector(
  [getPaymentGroupList, secondParam],
  (groupList, uuid) =>
    groupList.filter((pg) => pg.status === 150 && pg.invoice === uuid),
);

const _getPayoutListIds = (
  state: RootState,
): Immutable.Immutable<Array<number>> => state.paymentBackend.payout.allIds;
const _getPayoutData = (state: RootState) => state.paymentBackend.payout.byId;

export const getPayoutList = createSelector(
  [_getPayoutListIds, _getPayoutData],
  (ids, data) => ids.map((id) => data[id]),
);

const _getIncrementalPayoutListIds = (
  state: RootState,
): Immutable.Immutable<Array<number>> =>
  state.paymentBackend.incrementalPayout.allIds;

const _getIncrementalPayoutData = (
  state: RootState,
): Immutable.Immutable<{ [id: number]: Payout }> =>
  state.paymentBackend.incrementalPayout.byId;

export const getIncrementalPayoutList = createSelector(
  [_getIncrementalPayoutListIds, _getIncrementalPayoutData],
  (ids, data) => ids.map((id) => data[id]),
);
