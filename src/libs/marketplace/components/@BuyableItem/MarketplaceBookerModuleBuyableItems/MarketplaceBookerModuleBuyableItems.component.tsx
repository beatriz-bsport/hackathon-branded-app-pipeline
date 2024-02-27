import React from 'react';

import { useTranslation } from 'react-i18next';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import MarketplaceConsumerPaymentPackCard from '#marketplacecomponents/@ConsumerPaymentPack/MarketplaceConsumerPaymentPackCard';
import MarketplaceFilterBuyableItemCategory from '#marketplacecomponents/@BuyableItem/MarketplaceFilterBuyableItemCategory';
import MarketplaceBuyableItemCategoryList from '#marketplacecomponents/@BuyableItem/MarketplaceBuyableItemCategoryList';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { MarketplaceBookerModuleBuyableItemsSkeleton } from '.';
import Collapse from '#components/css-only/Fabrique/Collapse';
import ButtonBase from '#components/css-only/Fabrique/ButtonBase';
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
  availableConsumerPacks: Array<ConsumerPaymentPack<PaymentPack> & MaxoutData>;
  isShowBuyableItems: boolean;
  buyableItemCategories: BuyableItemCategory[];
  selectedItem?: BookerItem;
  selectedBuyableItemCategory?: BuyableItemCategory;
  isExcludingTax: boolean;
  companyTheme: CompanyTheme;
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
}) => {
  const { t } = useTranslation('booking');

  const isDisplayBuyableItems =
    (!hideUnnecessaryCompatiblePurchaseMethod && isShowBuyableItems) ||
    (availableConsumerPacks ?? [])?.length === 0;

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
            {(availableConsumerPacks || []).map((consumerPaymentPack) => (
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
                      className={classNames(
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
        <Collapse collapsedHeight={0} isExpanded={isDisplayBuyableItems}>
          <MarketplaceFilterBuyableItemCategory
            buyableItemCategories={buyableItemCategories}
            onClickCategory={onClickCategory}
            selectedBuyableItemCategory={selectedBuyableItemCategory}
          />
          {!selectedBuyableItemCategory ? (
            (buyableItemCategories || [])?.map((buyableItemCategory) => (
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
        </Collapse>
      </>
    </div>
  );
};

export const MarketplaceBookerModuleBuyableItemsForStorybook =
  marketplaceCssHoc()(MarketplaceBookerModuleBuyableItems);

export default React.memo(MarketplaceBookerModuleBuyableItems);
