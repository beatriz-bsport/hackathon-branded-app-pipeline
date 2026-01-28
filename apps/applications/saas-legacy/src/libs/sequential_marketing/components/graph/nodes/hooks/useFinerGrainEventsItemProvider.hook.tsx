import React from 'react';

// Redux utils
/* eslint-disable-next-line bsport/no-redux-in-component */
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

// Redux Selectors
import { getPaymentPackById } from '#src/libs/payment-packs/selectors';
import { _getPrivatePassData as getPrivatePassById } from '#src/libs/private-service/selectors/private-pass';
import { getGiftcardData as getGiftcardDataById } from '#src/libs/giftcard/selectors';
import { getContractsById } from '#src/libs/subscription/selectors';
import { getShopItemBaseById } from '#src/libs/shop/selectors';

// Redux Actions
import { fetchGiftcardBulk } from '#src/libs/giftcard/actions';
import { fetchPaymentPackBulk } from '#src/libs/payment-packs/actions';
import { fetchPrivatePassBulk } from '#src/libs/private-service/actions';
import { fetchContractList } from '#src/libs/subscription/actions';
import { fetchShopItemBaseList } from '#src/libs/shop/actions/shopItemReworked';

// bsport-common constants
import {
  CONSUMER_PAYMENT_PACK_EVENTS,
  EVENT_BILLING_PLAN_CREATE,
  GIFTCARD_EVENTS,
  PRIVATE_CONSUMER_PACK_EVENTS,
  SHOP_ITEMS_EVENTS,
} from '@bsport/common/lib/master-data/events.js';

/***
 * @description Generic provider for finer-grain events item data in Audience
 * This hook can be used to fetch the items through their IDs by the eventType that you pass to the function
 * so that you can rely on it to fetch and get the desired item from the finer-grain events.
 * ***/
export const useFinerGrainEventsItemProvider = () => {
  const dispatch = useDispatch();
  const paymentPacks = useSelector(
    createSelector([getPaymentPackById], (data) => data),
  );
  const appointmentPacks = useSelector(
    createSelector([getPrivatePassById], (data) => data),
  );
  const shopItems = useSelector(
    createSelector([getShopItemBaseById], (data) => data),
  );
  const giftCards = useSelector(
    createSelector([getGiftcardDataById], (data) => {
      return data;
    }),
  );
  const subscriptions = useSelector(
    createSelector([getContractsById], (data) => {
      return data;
    }),
  );

  const handleFetchFinerGrainEventsItem = React.useCallback(
    (eventType: string, itemIds: number[]) => {
      if (eventType === GIFTCARD_EVENTS.CREATE) {
        const filteredIds = itemIds?.filter((id) => !(id in giftCards));
        if (filteredIds?.length > 0) dispatch(fetchGiftcardBulk(filteredIds));
      } else if (eventType === CONSUMER_PAYMENT_PACK_EVENTS.CREATE) {
        const filteredIds = itemIds?.filter((id) => !(id in paymentPacks));
        if (filteredIds?.length > 0)
          dispatch(fetchPaymentPackBulk(filteredIds));
      } else if (eventType === PRIVATE_CONSUMER_PACK_EVENTS.CREATE) {
        const filteredIds = itemIds?.filter((id) => !(id in appointmentPacks));
        if (filteredIds?.length > 0)
          dispatch(fetchPrivatePassBulk(filteredIds));
      } else if (eventType === SHOP_ITEMS_EVENTS.CREATE) {
        const filteredIds = itemIds?.filter((id) => !(id in shopItems));
        if (filteredIds?.length > 0)
          dispatch(
            fetchShopItemBaseList({
              is_variant: false,
              is_standalone_item: true,
              is_base_item: false,
              id__in: filteredIds,
            }),
          );
      } else if (eventType === EVENT_BILLING_PLAN_CREATE) {
        const filteredIds = itemIds?.filter((id) => !(id in subscriptions));
        if (filteredIds?.length > 0)
          dispatch(fetchContractList({ id__in: filteredIds }));
      }
    },
    [
      dispatch,
      giftCards,
      paymentPacks,
      appointmentPacks,
      subscriptions,
      shopItems,
    ],
  );

  const getFinerGrainEventsItem = React.useCallback(
    (eventType: string, itemIds: number[]) => {
      if (eventType === GIFTCARD_EVENTS.CREATE) {
        return itemIds?.map((id) => giftCards[id]).filter((item) => item);
      } else if (eventType === CONSUMER_PAYMENT_PACK_EVENTS.CREATE) {
        return itemIds?.map((id) => paymentPacks[id]).filter((item) => item);
      } else if (eventType === PRIVATE_CONSUMER_PACK_EVENTS.CREATE) {
        return itemIds
          ?.map((id) => appointmentPacks[id])
          .filter((item) => item);
      } else if (eventType === SHOP_ITEMS_EVENTS.CREATE) {
        return itemIds?.map((id) => shopItems[id]).filter((item) => item);
      } else if (eventType === EVENT_BILLING_PLAN_CREATE) {
        return itemIds?.map((id) => subscriptions[id]).filter((item) => item);
      }
    },
    [giftCards, paymentPacks, appointmentPacks, subscriptions, shopItems],
  );

  return { handleFetchFinerGrainEventsItem, getFinerGrainEventsItem };
};

export default useFinerGrainEventsItemProvider;
