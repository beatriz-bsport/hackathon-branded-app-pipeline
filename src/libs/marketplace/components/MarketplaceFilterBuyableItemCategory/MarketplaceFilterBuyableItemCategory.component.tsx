import React, { useCallback } from 'react';
import './MarketplaceFilterBuyableItemCategory.css';
import classNames from 'classnames';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import type { BuyableItemCategory } from '#libs/booker-module/types';

type ButtonProps = {
  onClickCategory: (item: BuyableItemCategory) => void;
  buyableItemCategory: BuyableItemCategory;
  selectedBuyableItemCategory: BuyableItemCategory | null;
};

const MarketplaceFilterBuyableItemCategoryButton: React.FC<ButtonProps> = (
  props,
) => {
  const { onClickCategory, buyableItemCategory } = props;

  const onClick = useCallback(() => {
    onClickCategory(buyableItemCategory);
  }, [onClickCategory, buyableItemCategory]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'bs-marketplace-filter-buyable-item-category__button',
        {
          'bs-marketplace-filter-buyable-item-category__button--selected':
            buyableItemCategory?.index ===
            props.selectedBuyableItemCategory?.index,
        },
      )}
    >
      {buyableItemCategory.name}
    </button>
  );
};

type Props = {
  onClickCategory: (item: BuyableItemCategory) => void;
  buyableItemCategories: BuyableItemCategory[];
  selectedBuyableItemCategory: BuyableItemCategory | null;
};

const MarketplaceFilterBuyableItemCategory: React.FC<Props> = (props) => {
  const { onClickCategory } = props;
  const { t } = useTranslation('booking');

  const onClickAll = useCallback(() => {
    onClickCategory(null);
  }, [onClickCategory]);

  return (
    <div className="bs-marketplace-filter-buyable-item-category">
      <button
        type="button"
        className={classNames(
          'bs-marketplace-filter-buyable-item-category__button',
          {
            'bs-marketplace-filter-buyable-item-category__button--selected':
              props.selectedBuyableItemCategory === null,
          },
        )}
        onClick={onClickAll}
      >
        {t('newBookingModule.filterAll')}
      </button>
      {props.buyableItemCategories.map((buyableItemCategory) => {
        return (
          <MarketplaceFilterBuyableItemCategoryButton
            buyableItemCategory={buyableItemCategory}
            selectedBuyableItemCategory={props.selectedBuyableItemCategory}
            onClickCategory={props.onClickCategory}
            key={buyableItemCategory.id}
          />
        );
      })}
    </div>
  );
};

export default compose<Props, Props>(
  React.memo,
  marketplaceCssHoc(),
)(MarketplaceFilterBuyableItemCategory);
