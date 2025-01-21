import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import clsx from 'clsx';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import Card, { CardSize } from '#src/components/css-only/Card';
import RecommendedChip from '#src/components/css-only/RecommendedChip';
import CardContent from '#src/components/css-only/Card/CardContent';
import Grid from '#src/components/css-only/Grid';
import GridItem from '#src/components/css-only/Grid/GridItem';
import Price from '#src/components/css-only/Price';
import Collapse from '#src/components/css-only/Fabrique/Collapse';
import Button from '#src/components/css-only/Fabrique/Button';
import InitialPrice from '#src/libs/marketplace/components/@PaymentCombo/MarketplacePaymentComboCard/InitialPrice';

import './styles.css';

import type { PaymentCombo } from '#src/libs/payment-combo/types';
import useIsTextExpandable from '../../../../../hooks/useIsTextExpandable';

export type Props = {
  paymentCombo: PaymentCombo;
  isExcludingTax: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  bookingConfirmButtonComponent?: React.ReactElement;
};

const MarketplacePaymentComboBuyableItem: React.FC<Props> = ({
  paymentCombo,
  isExcludingTax,
  isSelected,
  onClick,
  bookingConfirmButtonComponent,
}) => {
  const { t } = useTranslation(['marketplace', 'booking', 'paymentCombo']);
  const [showAllDescription, setShowAllDescription] = useState(false);

  const descriptionText = useIsTextExpandable(showAllDescription);

  const paymentComboItems = useMemo(
    () =>
      (paymentCombo.payment_packs || []).concat(
        paymentCombo.shop_items,
        paymentCombo.private_passes,
      ),
    [
      paymentCombo.payment_packs,
      paymentCombo.private_passes,
      paymentCombo.shop_items,
    ],
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const onClickSeeMore = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setShowAllDescription(
      (previousShowAllDescription) => !previousShowAllDescription,
    );
  }, []);

  const isRecommended = !!paymentCombo?.highlighted_as_recommended;

  return (
    <Card
      classes={{
        'bs-payment-combo-buyable-item__card':
          'bs-payment-combo-buyable-item__card',
      }}
      id={`bs-payment-combo-buyable-item__card-${paymentCombo?.id}`}
      isSelected={isSelected}
      onClick={onClick}
      size={CardSize.AUTO}
    >
      <CardContent
        padding
        classes={{
          'bs-payment-combo-buyable-item__card__content':
            'bs-payment-combo-buyable-item__card__content',
        }}
      >
        <Grid
          classes={{
            'bs-payment-combo-buyable-item__card_content_grid':
              'bs-payment-combo-buyable-item__card_content_grid',
          }}
        >
          {/* START -- FIRST ROW / NAME ROW */}
          <GridItem
            classes={{
              'payment-combo-buyable-item__grid_item-title':
                'payment-combo-buyable-item__grid_item-title',
            }}
          >
            <div className="bs-payment-combo-buyable-item__title">
              {paymentCombo?.name ?? ''}
            </div>
            <div
              className={clsx({
                'bs-payment-combo-buyable-item__recommended_icon_container--hidden':
                  !isRecommended,
              })}
            >
              <div className="bs-payment-combo-buyable-item__recommended_icon">
                <RecommendedChip />
              </div>
            </div>
          </GridItem>

          {/* START -- SECOND ROW / ITEMS ROW */}
          <GridItem
            classes={{
              'payment-combo-buyable-item__grid_item-combo_items':
                'payment-combo-buyable-item__grid_item-combo_items',
            }}
          >
            <div className="bs-payment-combo-buyable-item__list">
              {isMobile ? (
                <li className="bs-payment-combo-buyable-item__list__item">
                  {t('paymentCombo:detail.itemCount', {
                    count: paymentComboItems.length,
                  })}
                </li>
              ) : (
                paymentComboItems.map((item) => (
                  <li
                    key={`combo_items_${item.id}`}
                    className="bs-payment-combo-buyable-item__list__item"
                  >
                    {item?.name ?? ''}
                  </li>
                ))
              )}
            </div>
          </GridItem>

          {/* START -- THIRD ROW / PRICING ROW */}
          <GridItem
            classes={{
              'payment-combo-buyable-item__grid_item-pricing':
                'payment-combo-buyable-item__grid_item-pricing',
            }}
          >
            <div className="bs-payment-combo-buyable-item__pricing_container">
              <InitialPrice
                isExcludingTax={isExcludingTax}
                paymentCombo={paymentCombo}
              />
              <Price
                amount={paymentCombo.price}
                classes={{
                  'bs-payment-combo-buyable-item__price':
                    'bs-payment-combo-buyable-item__price',
                }}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                isExcludingTax={isExcludingTax}
                tax={paymentCombo.tax}
              />
            </div>
          </GridItem>

          {/* START -- FOURTH ROW / DESCRIPTION ROW */}

          <GridItem
            classes={{
              'payment-combo-buyable-item__grid_item-description':
                'payment-combo-buyable-item__grid_item-description',
              ...(paymentCombo?.description
                ? {}
                : {
                    'payment-combo-buyable-item__grid_item-description--hidden':
                      'payment-combo-buyable-item__grid_item-description--hidden',
                  }),
            }}
          >
            <Collapse collapsedHeight={40} isExpanded={showAllDescription}>
              <div
                ref={descriptionText.ref}
                className={clsx('bs-payment-combo-buyable-item__description', {
                  'bs-payment-combo-buyable-item__description--short':
                    !showAllDescription,
                })}
              >
                {paymentCombo?.description ?? ''}
              </div>
            </Collapse>
          </GridItem>

          {/* START -- FIFTHROW / SEE MORE ROW */}
          <GridItem
            classes={{
              'payment-combo-buyable-item__grid_item-collapse-footer':
                'payment-combo-buyable-item__grid_item-collapse-footer',
            }}
          >
            <div
              className={clsx({
                'bs-payment-combo-buyable-item__seemore_button--hidden':
                  !descriptionText.isExpandable,
              })}
            >
              <Button
                classes={{
                  root: 'bs-payment-combo-buyable-item__seemore_button',
                  text: 'bs-payment-combo-buyable-item__seemore_button__text',
                }}
                onClick={onClickSeeMore}
              >
                {showAllDescription ? (
                  <>
                    <KeyboardArrowUp />
                    {t('booking:newBookingModule.cards.seeLess')}
                  </>
                ) : (
                  <>
                    <KeyboardArrowDown />
                    {t('booking:newBookingModule.cards.seeMore')}
                  </>
                )}
              </Button>
            </div>
          </GridItem>
          <GridItem
            classes={{
              'bs-payment-combo-buyable-item__grid_item-booking-button':
                'bs-payment-combo-buyable-item__grid_item-booking-button',
              'bs-payment-combo-buyable-item__booking-confirm-button':
                'bs-payment-combo-buyable-item__booking-confirm-button',
            }}
          >
            {!!bookingConfirmButtonComponent &&
              isSelected &&
              bookingConfirmButtonComponent}
          </GridItem>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const MarketplacePaymentComboBuyableItemForStorybook =
  marketplaceCssHoc()(MarketplacePaymentComboBuyableItem);

export default React.memo(MarketplacePaymentComboBuyableItem);
