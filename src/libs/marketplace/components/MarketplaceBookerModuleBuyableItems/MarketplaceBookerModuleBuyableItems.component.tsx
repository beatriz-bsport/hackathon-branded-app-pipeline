import React from 'react';

import { useTranslation } from 'react-i18next';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import isEqual from 'lodash/isEqual';

import MarketplaceConsumerPaymentPackCard from '#libs/marketplace/components/MarketplaceConsumerPaymentPackCard';
import MarketplaceFilterBuyableItemCategory from '#libs/marketplace/components/MarketplaceFilterBuyableItemCategory';
import MarketplaceBuyableItemCategoryList from '#libs/marketplace/components/MarketplaceBuyableItemCategoryList';
import Alert from '#csscomponents/Alert';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { MarketplaceBookerModuleBuyableItemsSkeleton } from '.';

import type { MaxoutData, PaymentPack } from '#libs/payment-packs/types';
import type { CompanyTheme } from '#libs/theme/types';
import type { ConsumerPaymentPack } from '#libs/consumer-payment-pack/types';
import type {
  BookerItem,
  BookerModuleBuyableItem,
  BuyableItemCategory,
  BuyableItemIdentifier,
} from '#libs/booker-module/types';

import './styles.css';

export type Props = {
  isLoading: boolean;
  isWaitingList: boolean;
  availableConsumerPacks: Array<ConsumerPaymentPack<PaymentPack> & MaxoutData>;
  isShowBuyableItems: boolean;
  buyableItemCategories: BuyableItemCategory[];
  selectedItem?: BookerItem;
  selectedBuyableItemCategory?: BuyableItemCategory;
  isExcludingTax: boolean;
  companyTheme: CompanyTheme;
  onSelectConsumerPaymentPack: (
    consumerPaymentPack: ConsumerPaymentPack<PaymentPack>,
  ) => void;
  onClickShowBuyableItems: () => void;
  onClickCategory: (item: BuyableItemCategory) => void;
  onClickBuyableItem: (
    buyableItem: BookerModuleBuyableItem,
    itemIdentifier: BuyableItemIdentifier,
  ) => void;
};

const MarketplaceBookerModuleBuyableItems: React.FC<Props> = ({
  isLoading,
  isWaitingList,
  availableConsumerPacks,
  isShowBuyableItems,
  buyableItemCategories,
  selectedItem,
  selectedBuyableItemCategory,
  isExcludingTax,
  companyTheme,
  onSelectConsumerPaymentPack,
  onClickShowBuyableItems,
  onClickCategory,
  onClickBuyableItem,
}) => {
  const { t } = useTranslation('booking');

  const isDisplayBuyableItems =
    (!companyTheme.hide_unnecessary_compatible_purchase_method &&
      isShowBuyableItems) ||
    (availableConsumerPacks ?? [])?.length === 0;

  if (isLoading) {
    return <MarketplaceBookerModuleBuyableItemsSkeleton />;
  }

  return (
    <div className="bs-booker-module-buyable-items__container">
      <>
        {isWaitingList && (
          <Alert severity="warning">
            {t('booking:newBookingModule.waitingListWarning')}
          </Alert>
        )}

        {(availableConsumerPacks ?? [])?.length > 0 && (
          <>
            <div className="bs-new-offer-booking__consumer-payment-packs__subtitle">
              {t('booking:newBookingModule.myPasses', {
                count: availableConsumerPacks.length,
              })}
            </div>
            {availableConsumerPacks.map((consumerPaymentPack) => (
              <MarketplaceConsumerPaymentPackCard
                key={consumerPaymentPack.id}
                consumerPaymentPack={consumerPaymentPack}
                isSelected={isEqual(consumerPaymentPack, selectedItem?.data)}
                onSelectConsumerPaymentPack={onSelectConsumerPaymentPack}
              />
            ))}

            {!companyTheme.hide_unnecessary_compatible_purchase_method && (
              <div className="bs-new-offer-booking__buyable_items__header">
                <button
                  className="bs-new-offer-booking__buyable_items__header__arrow"
                  onClick={onClickShowBuyableItems}
                  type="button"
                >
                  {isShowBuyableItems ? (
                    <KeyboardArrowDown />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </button>
                <div className="bs-new-offer-booking__buyable_items__header__title">
                  {t('booking:newBookingModule.buyNewPass')}
                </div>
              </div>
            )}
          </>
        )}

        {isDisplayBuyableItems && (
          <>
            <MarketplaceFilterBuyableItemCategory
              buyableItemCategories={buyableItemCategories}
              onClickCategory={onClickCategory}
              selectedBuyableItemCategory={selectedBuyableItemCategory}
            />
            {!selectedBuyableItemCategory ? (
              (buyableItemCategories || [])?.map((buyableItemCategory) => (
                <MarketplaceBuyableItemCategoryList
                  key={buyableItemCategory.index}
                  buyableItemCategory={buyableItemCategory}
                  isExcludingTax={isExcludingTax}
                  selectBuyableItem={onClickBuyableItem}
                  selectedBuyableItem={
                    selectedItem?.data as BookerModuleBuyableItem
                  }
                />
              ))
            ) : (
              <MarketplaceBuyableItemCategoryList
                buyableItemCategory={selectedBuyableItemCategory}
                isExcludingTax={isExcludingTax}
                selectBuyableItem={onClickBuyableItem}
                selectedBuyableItem={
                  selectedItem?.data as BookerModuleBuyableItem
                }
              />
            )}
          </>
        )}
      </>
    </div>
  );
};

export const MarketplaceBookerModuleBuyableItemsForStorybook =
  marketplaceCssHoc()(MarketplaceBookerModuleBuyableItems);

export default React.memo(MarketplaceBookerModuleBuyableItems);
