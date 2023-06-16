// @ts-nocheck
import Immutable from 'seamless-immutable';
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

export const getBasketOfferList = createSelector(
  [getCurrentBasket, _getOfferData],
  (currentBasket, offerDataById) => {
    return Immutable(
      currentBasket?.checkout_items
        ?.filter(
          (checkoutItem) =>
            checkoutItem.extra_data?.offers_data &&
            checkoutItem.extra_data?.offers_data.length,
        )
        .map((checkoutItem) =>
          checkoutItem.extra_data.offers_data.map(
            (offerData) => offerDataById[offerData.offer_id],
          ),
        )
        .flat(),
    );
  },
);
