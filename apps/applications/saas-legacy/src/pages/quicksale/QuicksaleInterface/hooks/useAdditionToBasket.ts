import React from 'react';

import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items.js';

import type {
  AddItemToBasketParams,
  Basket,
  CheckoutItemData,
} from '#src/libs/checkout/types';
import { getIdsFromQuicksaleCardInfoId } from '#src/libs/quicksale/utils';
import type { QuicksaleCardInfo } from '#src/libs/quicksale/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { ShopItem } from '#src/libs/shop/types';
import type { Giftcard } from '#src/libs/giftcard/types';
import type { Member } from '#src/libs/member/types';
import type { TranslationProps } from '#src/components/DialogWithBigIcon/DialogWithBigIcon.component';
import type { Tag } from '#src/libs/tag/types';
import type { Contract } from '#src/libs/subscription/types';

import type { OptionCallback } from '../../../../state/types';
import useAdditionToBasketHelpers from './useAdditionToBasketHelpers';

const useAdditionToBasket = (
  setCurrentBasket: (basket: Basket | null) => void,
  setPendingItemToAdd: (item: QuicksaleCardInfo | null) => void,
  // setShowGiftcardFormModal: (show: boolean) => void,
  setShowAuthenticatedMemberRestrictionModal: (show: boolean) => void,
  setShowUnauthenticatedMemberRestrictionModal: (show: boolean) => void,
  setMemberRestrictionSubTexts: (subTexts: TranslationProps[][]) => void,
  setMemberToSubscribe: (member: Member | null) => void,
  addItemToBasket: (
    basketId: string,
    data: CheckoutItemData,
    options?: OptionCallback<Basket>,
    params?: AddItemToBasketParams,
  ) => void,
  setContractToSubscribe: (contract: Contract | null) => void,
  setShowSubscriptionContractModal: (show: boolean) => void,
  openMemberAuthenticationModal: () => void,
  setShowOutOfStockModal: (show: boolean) => void,
  createQuicksaleBasket: (options?: OptionCallback<Basket>) => void,
  closeOutOfStockModal: () => void,
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
  pendingItemToAdd?: QuicksaleCardInfo,
) => {
  const {
    addToBasket,
    addItemToBasketOrOpenGiftcardForm,
    openModalWhenItemIsRestricted,
  } = useAdditionToBasketHelpers(
    setCurrentBasket,
    setPendingItemToAdd,
    // setShowGiftcardFormModal,
    setShowAuthenticatedMemberRestrictionModal,
    setShowUnauthenticatedMemberRestrictionModal,
    setMemberRestrictionSubTexts,
    addItemToBasket,
    currentBasket,
    paymentPackById,
    privatePassById,
    paymentComboById,
    shopItemById,
    contractById,
    giftcardById,
    memberById,
    tagsById,
  );

  const onItemClick = React.useCallback(
    (item: QuicksaleCardInfo, customBasket?: Basket) => {
      const [buyable_item_identifier, buyable_item_id] =
        getIdsFromQuicksaleCardInfoId(item);

      const basket = customBasket ?? currentBasket;

      // For subscriptions, the item is not added to the basket but handled
      // independently. The staff will always need to authenticate a member for
      // a subscription, so we open the authentication dialog if no basket is selected
      // or if the selected basket's member is the POS member.
      if (
        Number(buyable_item_identifier) ===
        QuicksaleBasketItem.SubscriptionIdentifier
      ) {
        setContractToSubscribe(contractById[Number(buyable_item_id)] ?? null);
        if (basket && !memberById[basket.member].is_pos) {
          setMemberToSubscribe(memberById[basket.member] ?? null);
          setShowSubscriptionContractModal(true);
        } else openMemberAuthenticationModal();
        return;
      }

      // For shop items that are out of stock, we add a warning modal while still
      // enabling the staff to add the item to the basket anyway
      if (
        Number(buyable_item_identifier) ===
          QuicksaleBasketItem.ShopItemIdentifier &&
        item.outOfStock
      ) {
        setShowOutOfStockModal(true);
        setPendingItemToAdd(item);
        return;
      }

      // For every other item, we add it to the basket (or we create new anonymous
      // basket if no basket is selected)
      if (!basket) {
        createQuicksaleBasket({
          onSuccess: (newBasket) => {
            // If the item is restricted because of new member or tags limitation,
            // we block the addition to the basket and display an information modal
            if (item.restricted) {
              openModalWhenItemIsRestricted(item, newBasket);
            } else
              addItemToBasketOrOpenGiftcardForm(
                newBasket,
                {
                  buyable_item_id: Number(buyable_item_id),
                  buyable_item_identifier: Number(buyable_item_identifier),
                  quantity: 1,
                  extra_data: { force: true },
                },
                {
                  onSuccess: (basketWithItem) =>
                    setCurrentBasket(basketWithItem),
                },
              );
          },
        });
      } else if (item.restricted) openModalWhenItemIsRestricted(item, basket);
      else
        addToBasket({
          buyable_item_id: Number(buyable_item_id),
          buyable_item_identifier: Number(buyable_item_identifier),
          quantity: 1,
          extra_data: null,
        });
    },
    [
      addItemToBasketOrOpenGiftcardForm,
      addToBasket,
      contractById,
      createQuicksaleBasket,
      currentBasket,
      memberById,
      openMemberAuthenticationModal,
      openModalWhenItemIsRestricted,
      setContractToSubscribe,
      setCurrentBasket,
      setMemberToSubscribe,
      setPendingItemToAdd,
      setShowOutOfStockModal,
      setShowSubscriptionContractModal,
    ],
  );

  const addOutOfStockShopItemAnyway = React.useCallback(() => {
    if (
      pendingItemToAdd &&
      Number(getIdsFromQuicksaleCardInfoId(pendingItemToAdd)?.[0]) ===
        QuicksaleBasketItem.ShopItemIdentifier
    ) {
      onItemClick({
        ...pendingItemToAdd,
        outOfStock: false,
      });
    }
    closeOutOfStockModal();
  }, [closeOutOfStockModal, onItemClick, pendingItemToAdd]);

  return {
    onItemClick,
    addOutOfStockShopItemAnyway,
    addToBasket,
  };
};

export default useAdditionToBasket;
