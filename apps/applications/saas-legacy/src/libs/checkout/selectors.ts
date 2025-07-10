import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import { getEventState } from '#src/libs/event/selectors';

import {
  _getOfferData,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '#src/libs/offer/selectors';

import type { RootState } from '../../reducers';
import type { Basket } from './types';

export const getCheckoutState = (state: RootState) => state.checkout;

const _getAllBasketIds = (state: RootState) =>
  getCheckoutState(state).basket.allIds;

const _getBasketById = (state: RootState) =>
  getCheckoutState(state).basket.byId;

export const getBasketList = createSelector(
  [_getAllBasketIds, _getBasketById],
  (allIds, byId) => Immutable<Basket[]>(allIds.map((id) => byId[id])),
);

export const getOpenBasketList = createSelector([getBasketList], (basketList) =>
  basketList.filter((basket) => !basket.is_finalized),
);

export const getCurrentBasket = (state: RootState) =>
  getCheckoutState(state).basket.current.data;

export const getCurrentBasketLoadingStatus = (state: RootState) =>
  getCheckoutState(state).basket.current.loading;

export const getCurrentBasketItemRemovalStatusLoading = (state: RootState) =>
  state.checkout.basket.current.expiredItemRemovalStatusLoading;

export const getBasket = (state: RootState, basketId: string) => {
  return getCheckoutState(state).basket.byId[basketId];
};

export const getBasketGeneratedObjects = (state: RootState) => {
  return {
    offerList: withMetaActivity(
      withCoach(
        withEstablishment((state_) =>
          (getCheckoutState(state_).basket.generatedObjects.data ?? [])
            .filter(
              (object) => object.extra_data && object.extra_data.offer_next,
            )
            .map((object) => object.extra_data.offer_next)
            .map((object) => _getOfferData(state_)[object]),
        ),
      ),
    )(state),
  };
};

export const getBasketEventState = (state: RootState) =>
  getEventState(Immutable(state.event), 'basket');

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

export const getOffersListFromBasket = createSelector(
  [getBasket, _getOfferData],
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
