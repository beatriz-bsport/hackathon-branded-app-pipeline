import { createSelector } from 'reselect';
import { CheckoutState } from './types';
import { RootState } from '../../reducers';
import { getEventState } from '../event/selectors';

import {
  _getOfferData,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '../offer/selectors';

export const getCheckoutState = (state: RootState): CheckoutState =>
  state.checkout;

export const getCurrentBasket = (state: RootState) =>
  getCheckoutState(state).basket.current.data;

export const getBasket = (state: RootState, basketId: string) => {
  return getCheckoutState(state).basket.byId[basketId];
};

export const getBasketGeneratedObjects = (state: RootState) => {
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

export const getBasketEventState = (state: RootState) =>
  getEventState(state.event, 'basket');

export const getBasketHistoryList = createSelector(
  [getCheckoutState, (state: RootState, id: number) => id],
  (checkoutState, id) =>
    checkoutState.basket.history.items.filter((b) => b.member === id),
);
