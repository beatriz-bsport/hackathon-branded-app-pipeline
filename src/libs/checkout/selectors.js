// @flow

import type { State } from '../../state/types.ts';
import type { Basket, CheckoutState } from './types';

import {
  _getOfferData,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '../offer/selectors';

export const getCheckoutState = (state: State): CheckoutState => state.checkout;

export const getCurrentBasket = (state: State): ?Basket =>
  getCheckoutState(state).basket.current.data;

export const getBasketGeneratedObjects = (state: State) => {
  return {
    offerList: withMetaActivity(
      withCoach(
        withEstablishment((state_) =>
          (getCheckoutState(state_).basket.generatedObjects.data || [])
            .filter((o) => o.extra_data && o.extra_data.offer_next)
            .map((o) => o.extra_data.offer_next)
            .map((o) => _getOfferData(state_)[o]),
        ),
      ),
    )(state),
  };
};
