import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items.js';
import { getBuyableItem } from '#src/libs/invoice/selectors';
import {
  getAllShopItemData,
  getStandaloneAndBaseShopItemList,
} from '#src/libs/shop/selectors';
import { getAvailableContractList } from '#src/libs/subscription/selectors';
import type { Contract } from '#src/libs/subscription/types';
import {
  getPaymentPackById,
  groupByCategory,
} from '#src/libs/payment-packs/selectors';
import { getPrivatePassByCategoryWithPasses } from '#src/libs/private-service/selectors/private-pass-category';
import { getPrivatePassById } from '#src/libs/private-service/selectors/private-pass';
import { getPaymentComboDataDict } from '#src/libs/payment-combo/selectors';
import { getGiftcardData } from '#src/libs/giftcard/selectors';
import {
  QuicksaleObjectsByItemIdentifierByCategory,
  QuicksaleObjectsByItemIdentifierById,
} from './types';
import { RootState } from '#src/reducers';

export const getLoading = (state: RootState) => state.quicksale.loading;

export const getUpdateLoading = (state: RootState) =>
  state.quicksale.updateLoading;

const _getSectionIds = (state: RootState) => state.quicksale.sections.allIds;

export const getSectionsById = (state: RootState) =>
  state.quicksale.sections.byId;

export const getSectionList = createSelector(
  [_getSectionIds, getSectionsById],
  (ids, data) => ids.map((id) => data[id]),
);

export const getActiveSectionList = createSelector(
  [getSectionList],
  (sections) => sections.filter((section) => !section.disabled),
);

const _getId = (state: RootState, sectionId: string) => sectionId;

export const getSection = createSelector(
  [getSectionsById, _getId],
  (sectionsById, sectionId) => sectionsById[sectionId],
);

const _getItemIds = (state: RootState) =>
  state.quicksale.items.allIdsAndItemIdentifiers;

const _getItemByItemIdentifierById = (state: RootState) =>
  state.quicksale.items.byItemIdentifierById;

export const getQuicksaleItems = createSelector(
  [_getItemIds, _getItemByItemIdentifierById],
  (itemIdentifiersAndIds, data) =>
    itemIdentifiersAndIds.map(
      ([itemIdentifier, itemId]) => data[itemIdentifier][itemId],
    ),
);

export const getItemsInQuicksaleConfig = createSelector(
  [
    _getItemByItemIdentifierById,
    getPaymentPackById,
    getPrivatePassById,
    getPaymentComboDataDict,
    getAllShopItemData,
    getGiftcardData,
    // @ts-expect-error
    getAvailableContractList as () => Contract[],
  ],
  (
    itemsByItemIdentifierById,
    paymentPackList,
    privatePassList,
    paymentComboList,
    shopItemList,
    giftcardList,
    contractList,
  ): QuicksaleObjectsByItemIdentifierById => ({
    [QuicksaleBasketItem.PaymentPackIdentifier]: Object.values(
      itemsByItemIdentifierById[QuicksaleBasketItem.PaymentPackIdentifier],
    ).reduce(
      (acc, quicksaleItem) =>
        paymentPackList[quicksaleItem.object_id].is_usable_by_staff
          ? {
              ...acc,
              [quicksaleItem.object_id]:
                paymentPackList[quicksaleItem.object_id],
            }
          : acc,
      {},
    ),
    [QuicksaleBasketItem.PrivatePassIdentifier]: Object.values(
      itemsByItemIdentifierById[QuicksaleBasketItem.PrivatePassIdentifier],
    ).reduce(
      (acc, quicksaleItem) =>
        privatePassList[quicksaleItem.object_id].is_usable_by_staff
          ? {
              ...acc,
              [quicksaleItem.object_id]:
                privatePassList[quicksaleItem.object_id],
            }
          : acc,
      {},
    ),
    [QuicksaleBasketItem.PaymentComboIdentifier]: Object.values(
      itemsByItemIdentifierById[QuicksaleBasketItem.PaymentComboIdentifier],
    ).reduce(
      (acc, quicksaleItem) =>
        paymentComboList[quicksaleItem.object_id].is_usable_by_staff
          ? {
              ...acc,
              [quicksaleItem.object_id]:
                paymentComboList[quicksaleItem.object_id],
            }
          : acc,
      {},
    ),
    [QuicksaleBasketItem.ShopItemIdentifier]: Object.values(
      itemsByItemIdentifierById[QuicksaleBasketItem.ShopItemIdentifier],
    ).reduce(
      (acc, quicksaleItem) => ({
        ...acc,
        [quicksaleItem.object_id]: shopItemList[quicksaleItem.object_id],
      }),
      {},
    ),
    [QuicksaleBasketItem.GiftcardIdentifier]: Object.values(
      itemsByItemIdentifierById[QuicksaleBasketItem.GiftcardIdentifier],
    ).reduce(
      (acc, quicksaleItem) => ({
        ...acc,
        [quicksaleItem.object_id]: giftcardList[quicksaleItem.object_id],
      }),
      {},
    ),
    [QuicksaleBasketItem.SubscriptionIdentifier]: Object.values(
      itemsByItemIdentifierById[QuicksaleBasketItem.SubscriptionIdentifier],
    ).reduce(
      (acc, quicksaleItem) =>
        contractList[quicksaleItem.object_id].is_usable_by_staff
          ? {
              ...acc,
              [quicksaleItem.object_id]: contractList[quicksaleItem.object_id],
            }
          : acc,
      {},
    ),
  }),
);

export const getAvailableItemsByItemIdentifierByCategory = createSelector(
  [
    groupByCategory(
      (state) =>
        // @ts-expect-error because getBuyableItem is not typed correctly and
        // expects a state of type State instead of RootState
        getBuyableItem(state)[QuicksaleBasketItem.PaymentPackIdentifier],
    ),
    getPrivatePassByCategoryWithPasses(
      (state) =>
        // @ts-expect-error for the same reason
        getBuyableItem(state)[QuicksaleBasketItem.PrivatePassIdentifier],
    ),
    getBuyableItem,
    getStandaloneAndBaseShopItemList,
    // @ts-expect-error
    getAvailableContractList as () => Contract[],
  ],
  (
    paymentPacksByCategory,
    privatePassByCategory,
    buyableItems,
    shopItems,
    contractList,
  ): QuicksaleObjectsByItemIdentifierByCategory => ({
    [QuicksaleBasketItem.PaymentPackIdentifier]: {
      hasCategories: true,
      itemsByCategory: Immutable.asMutable(paymentPacksByCategory).map(
        (category) => ({
          id: category.id,
          name: category.name,
          items: category.packs,
        }),
      ),
    },
    [QuicksaleBasketItem.PrivatePassIdentifier]: {
      hasCategories: true,
      itemsByCategory: Immutable.asMutable(privatePassByCategory).map(
        (category) => ({
          id: category.id,
          name: category.name,
          items: category.passes,
        }),
      ),
    },
    [QuicksaleBasketItem.PaymentComboIdentifier]: {
      hasCategories: false,
      itemsByCategory: [
        {
          id: null,
          name: '',
          items: buyableItems[QuicksaleBasketItem.PaymentComboIdentifier],
        },
      ],
    },
    [QuicksaleBasketItem.ShopItemIdentifier]: {
      hasCategories: true,
      itemsByCategory: [
        {
          id: null,
          name: '',
          items: shopItems,
        },
      ],
    },
    [QuicksaleBasketItem.SubscriptionIdentifier]: {
      hasCategories: false,
      itemsByCategory: [
        {
          id: null,
          name: '',
          items: contractList,
        },
      ],
    },
    [QuicksaleBasketItem.GiftcardIdentifier]: {
      hasCategories: false,
      itemsByCategory: [
        {
          id: null,
          name: '',
          items: buyableItems[QuicksaleBasketItem.GiftcardIdentifier],
        },
      ],
    },
  }),
);
