import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import isEqual from 'lodash/isEqual';
import clsx from 'clsx';
import MarketplaceConsumerPaymentPackCard from '#src/libs/marketplace/components/@ConsumerPaymentPack/MarketplaceConsumerPaymentPackCard';
import MarketplaceFilterBuyableItemCategory from '#src/libs/marketplace/components/@BuyableItem/MarketplaceFilterBuyableItemCategory';
import MarketplaceBuyableItemCategoryList from '#src/libs/marketplace/components/@BuyableItem/MarketplaceBuyableItemCategoryList';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import ShowMore from '#src/components/css-only/Fabrique/ShowMore';
import ButtonBase from '#src/components/css-only/Fabrique/ButtonBase';
import type { MaxoutData, PaymentPack } from '#src/libs/payment-packs/types';
import type { ConsumerPaymentPack } from '#src/libs/consumer-payment-pack/types';
import type {
  BookerItem,
  BookerModuleBuyableItem,
  BuyableItemCategory,
  BuyableItemIdentifier,
} from '#src/libs/booker-module/types';
import { MarketplaceBookerModuleBuyableItemsSkeleton } from '.';

import { trackPassSelectionForOfferViewedEvent } from '#src/events/booking/trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

import './styles.css';

export type Props = {
  isLoading: boolean;
  availableConsumerPacks: Array<ConsumerPaymentPack<PaymentPack> & MaxoutData>;
  isShowBuyableItems: boolean;
  buyableItemCategories: BuyableItemCategory[];
  selectedItem?: BookerItem;
  selectedBuyableItemCategory?: BuyableItemCategory;
  isExcludingTax: boolean;
  hideUnnecessaryCompatiblePurchaseMethod: boolean;
  hideCreditsForCustomers: boolean;
  onSelectConsumerPaymentPack: (
    consumerPaymentPack: ConsumerPaymentPack<PaymentPack>,
  ) => void;
  onClickShowBuyableItems: () => void;
  onClickCategory: (item: BuyableItemCategory) => void;
  onClickBuyableItem: (
    buyableItem: BookerModuleBuyableItem,
    itemIdentifier: BuyableItemIdentifier,
  ) => void;
  onClickAll?: () => void;
  bookingConfirmButtonComponent?: React.ReactElement;
  trackingParams: {
    activity_id: number;
    activity_name: string;
    is_waiting_list: boolean;
    offer_id: number;
    session_type: 'workshop' | 'group-activity';
  } | null;
};

const MarketplaceBookerModuleBuyableItems: React.FC<Props> = ({
  isLoading,
  availableConsumerPacks,
  isShowBuyableItems,
  buyableItemCategories,
  selectedItem,
  selectedBuyableItemCategory,
  isExcludingTax,
  hideCreditsForCustomers,
  onSelectConsumerPaymentPack,
  onClickShowBuyableItems,
  hideUnnecessaryCompatiblePurchaseMethod,
  onClickCategory,
  onClickBuyableItem,
  onClickAll,
  bookingConfirmButtonComponent,
  trackingParams,
}) => {
  const { t } = useTranslation('booking');

  const [hasTrackedPassSelectionViewed, setHasTrackedPassSelectionViewed] =
    useState(false);

  const isDisplayBuyableItems = React.useMemo(() => {
    return (
      (!hideUnnecessaryCompatiblePurchaseMethod && isShowBuyableItems) ||
      (availableConsumerPacks ?? [])?.length === 0
    );
  }, [
    hideUnnecessaryCompatiblePurchaseMethod,
    isShowBuyableItems,
    availableConsumerPacks,
  ]);

  const collapseClasses = React.useMemo(() => {
    return {
      content: '',
      container: isDisplayBuyableItems
        ? 'bs-marketplace-filter-buyable-item-category--displayed'
        : 'bs-marketplace-filter-buyable-item-category--hidden ',
    };
  }, [isDisplayBuyableItems]);

  useEffect(() => {
    if (!isLoading && !!trackingParams && !hasTrackedPassSelectionViewed) {
      analyticsClientB2C.track(
        trackPassSelectionForOfferViewedEvent(trackingParams),
      );
      setHasTrackedPassSelectionViewed(true);
    }
  }, [isLoading, trackingParams, hasTrackedPassSelectionViewed]);

  if (isLoading) {
    return <MarketplaceBookerModuleBuyableItemsSkeleton />;
  }
  return (
    <div className="bs-booker-module-buyable-items__container">
      <>
        {availableConsumerPacks?.length > 0 && (
          <>
            <div className="bs-new-offer-booking__consumer-payment-packs__subtitle">
              {t('booking:newBookingModule.myPasses', {
                count: availableConsumerPacks.length,
              })}
            </div>
            {(availableConsumerPacks ?? []).map((consumerPaymentPack) => (
              <MarketplaceConsumerPaymentPackCard
                key={consumerPaymentPack.id}
                bookingConfirmButtonComponent={bookingConfirmButtonComponent}
                consumerPaymentPack={consumerPaymentPack}
                isSelected={isEqual(consumerPaymentPack, selectedItem?.data)}
                onSelectConsumerPaymentPack={onSelectConsumerPaymentPack}
              />
            ))}

            {!hideUnnecessaryCompatiblePurchaseMethod && (
              <div className="bs-new-offer-booking__buyable_items__header__container">
                <ButtonBase onClick={onClickShowBuyableItems}>
                  <div className="bs-new-offer-booking__buyable_items__header">
                    <KeyboardArrowRight
                      className={clsx(
                        'bs-new-offer-booking__buyable_items__header__arrow',
                        {
                          'bs-new-offer-booking__buyable_items__header__arrow--rotate':
                            isDisplayBuyableItems,
                        },
                      )}
                    />
                    <div className="bs-new-offer-booking__buyable_items__header__title">
                      {t('booking:newBookingModule.buyNewPass')}
                    </div>
                  </div>
                </ButtonBase>
              </div>
            )}
          </>
        )}
        <ShowMore
          classes={collapseClasses}
          collapsedHeight={0}
          isExpanded={isDisplayBuyableItems}
        >
          <MarketplaceFilterBuyableItemCategory
            buyableItemCategories={buyableItemCategories}
            onClickCategory={onClickCategory}
            selectedBuyableItemCategory={selectedBuyableItemCategory}
          />
          {!selectedBuyableItemCategory ? (
            (buyableItemCategories ?? [])?.map((buyableItemCategory) => (
              <MarketplaceBuyableItemCategoryList
                key={buyableItemCategory.index}
                excludeRecommendedItemsFromRegularCategories
                bookingConfirmButtonComponent={bookingConfirmButtonComponent}
                buyableItemCategory={buyableItemCategory}
                hideCreditsForCustomers={hideCreditsForCustomers}
                isExcludingTax={isExcludingTax}
                selectBuyableItem={onClickBuyableItem}
                selectedBuyableItem={
                  selectedItem?.data as BookerModuleBuyableItem
                }
              />
            ))
          ) : (
            <MarketplaceBuyableItemCategoryList
              bookingConfirmButtonComponent={bookingConfirmButtonComponent}
              buyableItemCategory={selectedBuyableItemCategory}
              hideCreditsForCustomers={hideCreditsForCustomers}
              isExcludingTax={isExcludingTax}
              onClickAll={onClickAll}
              selectBuyableItem={onClickBuyableItem}
              selectedBuyableItem={
                selectedItem?.data as BookerModuleBuyableItem
              }
            />
          )}
          <div className="bs-booker-module-scroll_filler" />
        </ShowMore>
      </>
    </div>
  );
};

export const MarketplaceBookerModuleBuyableItemsForStorybook =
  marketplaceCssHoc()(MarketplaceBookerModuleBuyableItems);

export default React.memo(MarketplaceBookerModuleBuyableItems);
