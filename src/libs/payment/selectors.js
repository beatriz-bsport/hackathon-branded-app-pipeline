// @flow
import Immutable from 'seamless-immutable';
import type { State } from '../../state/types.ts';

const EMPTY_LIST = Immutable([]);

export const getSavedPaymentMethodList = (state: State): any => {
  if (state.paymentBackend.paymentMethod.loading) {
    return EMPTY_LIST;
  }
  return state.paymentBackend.paymentMethod.items;
};
