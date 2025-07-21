import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items.js';

import type {
  AddItemToBasketParams,
  Basket,
  CheckoutItemData,
} from '#src/libs/checkout/types';
import {
  getBuyableItemFromIdentifierAndId,
  getIdsFromQuicksaleCardInfoId,
  getMemberRestrictionModalSubTexts,
  getQuicksaleCardInfoIdFromIds,
} from '#src/libs/quicksale/utils';
import type { QuicksaleCardInfo } from '#src/libs/quicksale/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { ShopItem } from '#src/libs/shop/types';
import type { Giftcard } from '#src/libs/giftcard/types';
import type { Member } from '#src/libs/member/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { TranslationProps } from '#src/components/DialogWithBigIcon/DialogWithBigIcon.component';
import type { Tag } from '#src/libs/tag/types';

import type { OptionCallback } from '../../../../state/types';

const useAdditionToBasketHelpers = (
  setCurrentBasket: (basket: Basket | null) => void,
  setPendingItemToAdd: (item: QuicksaleCardInfo | null) => void,
  // setShowGiftcardFormModal: (show: boolean) => void,
  setShowAuthenticatedMemberRestrictionModal: (show: boolean) => void,
  setShowUnauthenticatedMemberRestrictionModal: (show: boolean) => void,
  setMemberRestrictionSubTexts: (subTexts: TranslationProps[][]) => void,
  addItemToBasket: (
    basketId: string,
    data: CheckoutItemData,
    options?: OptionCallback<Basket>,
    params?: AddItemToBasketParams,
  ) => void,
  currentBasket?: Basket,
  paymentPackById?: any,
  privatePassById?: {
    [id: string]: PrivatePass<number>;
  },
  paymentComboById?: {
    [id: number]: PaymentCombo;
  },
  shopItemById?: {
    [key: number]: ShopItem;
  },
  contractById?: any,
  giftcardById?: {
    [id: number]: Giftcard;
  },
  memberById?: {
    [id: number]: Member;
  },
  tagsById?: {
    [key: string]: Tag<number>;
  },
) => {
  // (Quicksale MVP): Following block is not working as Giftcard have been removed from the MVP
  // The giftcard form is not handled in onItemClick like the subscriptions
  // since we still want the form to be opened when clicking on the "+" button
  // in the basket panel (and the "+" button triggers addToBasket directly)
  const addItemToBasketOrOpenGiftcardForm = React.useCallback(
    (
      basket: Basket,
      checkoutItem: CheckoutItemData,
      options?: OptionCallback<Basket>,
    ) => {
      if (!currentBasket) setCurrentBasket(basket);
      if (
        checkoutItem.buyable_item_identifier ===
        QuicksaleBasketItem.GiftcardIdentifier
      ) {
        setPendingItemToAdd({
          id: getQuicksaleCardInfoIdFromIds(
            checkoutItem.buyable_item_identifier,
            checkoutItem.buyable_item_id,
          ),
          sectionId: '',
        });
        // setShowGiftcardFormModal(true);
      } else {
        addItemToBasket(
          basket.id,
          {
            ...checkoutItem,
            extra_data: { ...checkoutItem.extra_data, force: true },
          },
          options,
        );
      }
    },
    [
      addItemToBasket,
      currentBasket,
      setCurrentBasket,
      setPendingItemToAdd,
      // setShowGiftcardFormModal,
    ],
  );

  // This function is used to add an item to the current basket while
  // skipping all the checks done on the items, which is useful when
  // clicking on the "+" button in the basket panel
  const addToBasket = React.useCallback(
    (checkoutItemData: CheckoutItemData) => {
      if (currentBasket) {
        addItemToBasketOrOpenGiftcardForm(
          currentBasket,
          {
            ...checkoutItemData,
            extra_data: { ...checkoutItemData.extra_data, force: true },
          },
          {
            onSuccess: (basket) => setCurrentBasket(basket),
          },
        );
      }
    },
    [currentBasket, addItemToBasketOrOpenGiftcardForm, setCurrentBasket],
  );

  const { t } = useTranslation('quicksale');

  const openModalWhenItemIsRestricted = React.useCallback(
    (item: QuicksaleCardInfo, newBasket?: Basket) => {
      if (newBasket) setCurrentBasket(newBasket);

      const [buyable_item_identifier, buyable_item_id] =
        getIdsFromQuicksaleCardInfoId(item);
      setPendingItemToAdd(item);
      const buyableItem = getBuyableItemFromIdentifierAndId(
        Number(buyable_item_identifier),
        Number(buyable_item_id),
        paymentPackById,
        privatePassById,
        paymentComboById,
        shopItemById,
        contractById,
        giftcardById,
      ) as PaymentPack | PrivatePass | PaymentCombo;

      if (newBasket && !memberById[newBasket.member]?.is_pos)
        setShowAuthenticatedMemberRestrictionModal(true);
      else setShowUnauthenticatedMemberRestrictionModal(true);
      setMemberRestrictionSubTexts(
        getMemberRestrictionModalSubTexts(
          Number(buyable_item_identifier),
          t,
          newBasket,
          memberById[newBasket?.member],
          buyableItem,
          tagsById,
        ),
      );
    },
    [
      contractById,
      giftcardById,
      memberById,
      paymentComboById,
      paymentPackById,
      privatePassById,
      setCurrentBasket,
      setMemberRestrictionSubTexts,
      setPendingItemToAdd,
      setShowAuthenticatedMemberRestrictionModal,
      setShowUnauthenticatedMemberRestrictionModal,
      shopItemById,
      t,
      tagsById,
    ],
  );

  return {
    addToBasket,
    addItemToBasketOrOpenGiftcardForm,
    openModalWhenItemIsRestricted,
  };
};

export default useAdditionToBasketHelpers;
