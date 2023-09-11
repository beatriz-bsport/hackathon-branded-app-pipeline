import React, { useCallback, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'react-i18next';

import MarketplacePaymentPackBuyableItem from '#marketplacecomponents/@BuyableItem/MarketplacePaymentPackBuyableItem';
import MarketplacePaymentComboBuyableItem from '#marketplacecomponents/@BuyableItem/MarketplacePaymentComboBuyableItem';
import MarketplaceContractBuyableItem from '#marketplacecomponents/@Subscription/MarketplaceContractBuyableItem';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import {
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
  MIXED_ITEMS_BOOKING_FUNNEL_IDENTIFIER,
  RECOMMENDED_BUYABLE_CATEGORY_ID,
} from '#libs/marketplace/constants';

import type {
  BookerModuleBuyableItem,
  BuyableItemCategory,
  RecommendedBuyableItem,
} from '#libs/booker-module/types';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type { ContractWithPaymentPack } from '#libs/subscription/types';

import './styles.css';

type Props = {
  buyableItemCategory: BuyableItemCategory;
  isExcludingTax: boolean;
  selectedBuyableItem: BookerModuleBuyableItem;
  excludeRecommendedItemsFromRegularCategories?: boolean;
  hideCreditsForCustomers: boolean;
  selectBuyableItem: (
    buyableItem: BookerModuleBuyableItem,
    identifier: number,
  ) => void;
  onClickAll?: () => void;
};

type CardProps = Omit<Props, 'buyableItemCategory' | 'selectBuyableItem'> & {
  categoryIdentifier: number;
  buyableItem: BookerModuleBuyableItem;
  selectItem: (
    buyableItem: BookerModuleBuyableItem,
    identifier: number,
  ) => void;
  isExcludingTax: boolean;
  selectedBuyableItem: BookerModuleBuyableItem;
};

const MarketplaceBuyableItemCard: React.FC<CardProps> = ({
  buyableItem,
  categoryIdentifier,
  isExcludingTax,
  selectedBuyableItem,
  hideCreditsForCustomers,
  selectItem,
}) => {
  const onClick = useCallback(
    () => selectItem(buyableItem, categoryIdentifier),
    [selectItem, buyableItem, categoryIdentifier],
  );

  switch (categoryIdentifier) {
    case PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER:
      return (
        <div
          aria-hidden="true"
          className="bs-marketplace-buyable-item-category__card"
          onClick={onClick}
        >
          <MarketplacePaymentPackBuyableItem
            hideCredits={hideCreditsForCustomers}
            isExcludingTax={isExcludingTax}
            isSelected={isEqual(selectedBuyableItem, buyableItem)}
            paymentPack={buyableItem as PaymentPack}
          />
        </div>
      );
    case PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER:
      return (
        <div
          aria-hidden="true"
          className="bs-marketplace-buyable-item-category__card"
          onClick={onClick}
        >
          <MarketplacePaymentComboBuyableItem
            isExcludingTax={isExcludingTax}
            isSelected={isEqual(selectedBuyableItem, buyableItem)}
            paymentCombo={buyableItem as PaymentCombo}
          />
        </div>
      );
    case CONTRACT_BOOKING_FUNNEL_IDENTIFIER:
      return (
        <div
          aria-hidden="true"
          className="bs-marketplace-buyable-item-category__card"
          onClick={onClick}
        >
          <MarketplaceContractBuyableItem
            contract={buyableItem as ContractWithPaymentPack}
            isExcludingTax={isExcludingTax}
            isSelected={isEqual(selectedBuyableItem, buyableItem)}
          />
        </div>
      );
    default:
      return <div />;
  }
};

const MarketplaceBuyableItemCategoryList: React.FC<Props> = ({
  buyableItemCategory,
  isExcludingTax,
  selectedBuyableItem,
  hideCreditsForCustomers,
  selectBuyableItem,
  onClickAll,
  excludeRecommendedItemsFromRegularCategories,
}) => {
  const { t } = useTranslation('booking');

  const isRecommendedCategory =
    buyableItemCategory.id === RECOMMENDED_BUYABLE_CATEGORY_ID;

  const itemsToDisplay = useMemo(() => {
    if (excludeRecommendedItemsFromRegularCategories) {
      // Here we want to filter out products highlighted as recommended
      // for regular categories, i.e. passes, subscriptions and packs.

      // Recommended products are already displayed in the recommended category above.
      return (buyableItemCategory.values as BookerModuleBuyableItem[]).filter(
        (item) => isRecommendedCategory || !item.highlighted_as_recommended,
      );
    }
    return buyableItemCategory.values;
  }, [
    buyableItemCategory,
    isRecommendedCategory,
    excludeRecommendedItemsFromRegularCategories,
  ]);

  if (itemsToDisplay.length === 0) return null;

  return (
    <div className="bs-marketplace-buyable-item-category">
      <div className="bs-marketplace-buyable-item-category__title">
        {buyableItemCategory.name}
      </div>
      {itemsToDisplay.map((buyableItem) => {
        if (
          buyableItemCategory.identifier ===
          MIXED_ITEMS_BOOKING_FUNNEL_IDENTIFIER
        ) {
          const item = buyableItem as RecommendedBuyableItem;
          return (
            <MarketplaceBuyableItemCard
              key={`${buyableItemCategory.identifier}${item.value.id}`}
              buyableItem={item.value}
              categoryIdentifier={item.identifier}
              hideCreditsForCustomers={hideCreditsForCustomers}
              isExcludingTax={isExcludingTax}
              selectedBuyableItem={selectedBuyableItem}
              selectItem={selectBuyableItem}
            />
          );
        }

        const item = buyableItem as BookerModuleBuyableItem;
        return (
          <MarketplaceBuyableItemCard
            key={`${buyableItemCategory.identifier}${item.id}`}
            buyableItem={item}
            categoryIdentifier={buyableItemCategory.identifier}
            hideCreditsForCustomers={hideCreditsForCustomers}
            isExcludingTax={isExcludingTax}
            selectedBuyableItem={selectedBuyableItem}
            selectItem={selectBuyableItem}
          />
        );
      })}

      {isRecommendedCategory && onClickAll && (
        <div className="bs-marketplace-buyable-item-category__button_container">
          <button
            className="bs-marketplace-buyable-item-category__button_container__button"
            onClick={onClickAll}
            type="button"
          >
            {t('newBookingModule.seeAllProducts')}
          </button>
        </div>
      )}
    </div>
  );
};

export const MarketplaceBuyableItemCategoryListForStorybook =
  marketplaceCssHoc()(MarketplaceBuyableItemCategoryList);

export default React.memo(MarketplaceBuyableItemCategoryList);
