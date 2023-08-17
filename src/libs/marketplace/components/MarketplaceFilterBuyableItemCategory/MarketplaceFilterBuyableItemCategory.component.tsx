import React, { useCallback } from 'react';
import './MarketplaceFilterBuyableItemCategory.css';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { RECOMMENDED_BUYABLE_CATEGORY_ID } from '#libs/marketplace/constants';
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
      className={classNames(
        'bs-marketplace-filter-buyable-item-category__button',
        {
          'bs-marketplace-filter-buyable-item-category__button--selected':
            buyableItemCategory?.index ===
            props.selectedBuyableItemCategory?.index,
        },
      )}
      onClick={onClick}
      type="button"
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

  const isRecommendedCategoryInList = !!props.buyableItemCategories.find(
    (category) => category.id === RECOMMENDED_BUYABLE_CATEGORY_ID,
  );

  return (
    <div className="bs-marketplace-filter-buyable-item-category">
      {/* If the recommended category is in the list, then display its button in first position */}
      {isRecommendedCategoryInList && (
        <MarketplaceFilterBuyableItemCategoryButton
          key={props.buyableItemCategories[0].id}
          buyableItemCategory={props.buyableItemCategories[0]}
          onClickCategory={props.onClickCategory}
          selectedBuyableItemCategory={props.selectedBuyableItemCategory}
        />
      )}

      {/* Then in all cases, the 'All' button should be displayed */}
      <button
        className={classNames(
          'bs-marketplace-filter-buyable-item-category__button',
          {
            'bs-marketplace-filter-buyable-item-category__button--selected':
              props.selectedBuyableItemCategory === null,
          },
        )}
        onClick={onClickAll}
        type="button"
      >
        {t('newBookingModule.filterAll')}
      </button>

      {/* Finally, display buttons for the remaining categories */}
      {props.buyableItemCategories
        .filter((category) => category.id !== RECOMMENDED_BUYABLE_CATEGORY_ID)
        .map((buyableItemCategory) => {
          return (
            <MarketplaceFilterBuyableItemCategoryButton
              key={buyableItemCategory.id}
              buyableItemCategory={buyableItemCategory}
              onClickCategory={props.onClickCategory}
              selectedBuyableItemCategory={props.selectedBuyableItemCategory}
            />
          );
        })}
    </div>
  );
};

export const MarketplaceFilterBuyableItemCategoryForStorybook =
  marketplaceCssHoc()(MarketplaceFilterBuyableItemCategory);

export default React.memo(MarketplaceFilterBuyableItemCategory);
