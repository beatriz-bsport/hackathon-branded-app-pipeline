// @flow

import type { State } from '../../state/types';
import type { Basket } from './types';

export const getCheckoutState = (state: State): Array<CheckoutState> =>
  state.checkout;

export const getCurrentBasket = (state: State): Basket =>
  getCheckoutState(state).basket.current.data;
