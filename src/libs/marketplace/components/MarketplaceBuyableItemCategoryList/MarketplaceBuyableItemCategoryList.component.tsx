import React, { useCallback } from 'react';
import { compose } from 'recompose';
import isEqual from 'lodash/isEqual';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import './MarketplaceBuyableItemCategoryList.css';
import {
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
} from '#libs/marketplace/constants';
import MarketplacePaymentPackCard from '../MarketplacePaymentPackCard';
import MarketplacePaymentComboCard from '../MarketplacePaymentComboCard';
import type {
  BuyableItem,
  BuyableItemCategory,
} from '#libs/booker-module/types';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type { ContractWithPaymentPack } from '#libs/subscription/types';
import type { CompanyTheme } from '#libs/theme/types';
import MarketplaceContractCard from '../MarketplaceContractCard';

type CardProps = {
  categoryIdentifier: number;
  buyableItem: BuyableItem;
  selectItem: (buyableItem: BuyableItem, identifier: number) => void;
  isExcludingTax: boolean;
  selectedBuyableItem: BuyableItem;
  theme: CompanyTheme;
};

const MarketplaceBuyableItemCard: React.FC<CardProps> = (props) => {
  const { selectItem, buyableItem, categoryIdentifier } = props;

  const onClick = useCallback(
    () => selectItem(buyableItem, categoryIdentifier),
    [selectItem, buyableItem, categoryIdentifier],
  );

  switch (props.categoryIdentifier) {
    case PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER: {
      return (
        <div
          aria-hidden="true"
          className="bs-marketplace-buyable-item-category__card"
          onClick={onClick}
        >
          <MarketplacePaymentPackCard
            hideCredits={props.theme.hide_credits_for_customers}
            isExcludingTax={props.isExcludingTax}
            isSelected={isEqual(props.selectedBuyableItem, buyableItem)}
            paymentPack={buyableItem as PaymentPack}
            variant="pricing_page"
          />
        </div>
      );
    }
    case PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER: {
      return (
        <div
          aria-hidden="true"
          className="bs-marketplace-buyable-item-category__card"
          onClick={onClick}
        >
          <MarketplacePaymentComboCard
            isExcludingTax={props.isExcludingTax}
            isSelected={isEqual(props.selectedBuyableItem, buyableItem)}
            paymentCombo={buyableItem as PaymentCombo}
            variant="pricing_page"
          />
        </div>
      );
    }
    case CONTRACT_BOOKING_FUNNEL_IDENTIFIER: {
      return (
        <div
          aria-hidden="true"
          className="bs-marketplace-buyable-item-category__card"
          onClick={onClick}
        >
          <MarketplaceContractCard
            contract={buyableItem as ContractWithPaymentPack}
            isExcludingTax={props.isExcludingTax}
            isSelected={isEqual(props.selectedBuyableItem, buyableItem)}
            variant="pricing_page"
          />
        </div>
      );
    }
    default:
      return <div />;
  }
};

type Props = {
  buyableItemCategory: BuyableItemCategory;
  isExcludingTax: boolean;
  selectedBuyableItem: BuyableItem;
  theme: CompanyTheme;
  selectBuyableItem: (buyableItem: BuyableItem, identifier: number) => void;
};

const MarketplaceBuyableItemCategoryList: React.FC<Props> = (props) => {
  return (
    <div className="bs-marketplace-buyable-item-category">
      <div className="bs-marketplace-buyable-item-category__title">
        {props.buyableItemCategory.name}
      </div>
      {props.buyableItemCategory.values.map((buyableItem) => {
        return (
          <MarketplaceBuyableItemCard
            key={`${props.buyableItemCategory.identifier}${buyableItem.id}`}
            buyableItem={buyableItem}
            categoryIdentifier={props.buyableItemCategory.identifier}
            isExcludingTax={props.isExcludingTax}
            selectedBuyableItem={props.selectedBuyableItem}
            selectItem={props.selectBuyableItem}
            theme={props.theme}
          />
        );
      })}
    </div>
  );
};

export default compose<Props, Props>(
  React.memo,
  marketplaceCssHoc(),
)(MarketplaceBuyableItemCategoryList);
