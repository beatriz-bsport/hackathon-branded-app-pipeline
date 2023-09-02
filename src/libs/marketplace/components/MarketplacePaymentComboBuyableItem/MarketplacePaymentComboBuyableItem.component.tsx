import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import classNames from 'classnames';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import Card, { CardSize } from '#csscomponents/Card';
import RecommendedChip from '#components/css-only/RecommendedChip';
import CardContent from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import GridItem from '#csscomponents/Grid/GridItem';
import Price from '#csscomponents/Price';
import Collapse from '#components/css-only/Fabrique/Collapse';
import useIsTextExpandable from '../../../../hooks/useIsTextExpandable';
import Button from '#components/css-only/Button';
import InitialPrice from '#libs/marketplace/components/MarketplacePaymentComboCard/InitialPrice';

import './styles.css';

import type { PaymentCombo } from '#libs/payment-combo/types';

export type Props = {
  paymentCombo: PaymentCombo;
  isExcludingTax: boolean;
  isSelected?: boolean;
  onClick?: () => void;
};

const MarketplacePaymentComboBuyableItem: React.FC<Props> = ({
  paymentCombo,
  isExcludingTax,
  isSelected,
  onClick,
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
        'bs-payment-combo-buyable-item-card':
          'bs-payment-combo-buyable-item-card',
      }}
      isSelected={isSelected}
      onClick={onClick}
      size={CardSize.AUTO}
    >
      <CardContent
        padding
        classes={{
          'bs-payment-combo-buyable-item__content':
            'bs-payment-combo-buyable-item__content',
        }}
      >
        <Grid
          classes={{
            'bs-payment-combo-buyable-item__grid':
              'bs-payment-combo-buyable-item__grid',
          }}
        >
          {/* START -- FIRST ROW */}
          <GridItem
            classes={{
              'payment-combo-buyable-item__grid_item-title':
                'payment-combo-buyable-item__grid_item-title',
            }}
          >
            <div className="bs-payment-combo-buyable-item__title">
              <div
                className={classNames(
                  'bs-payment-combo-buyable-item__recommended-container',
                  {
                    'bs-payment-combo-buyable-item__recommended-item--hidden':
                      !isRecommended,
                  },
                )}
              >
                <div className="bs-payment-combo-buyable-item__recommended_icon">
                  <RecommendedChip />
                </div>
              </div>
              {paymentCombo.name}
            </div>

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
                    key={item.id}
                    className="bs-payment-combo-buyable-item__list__item"
                  >
                    {item.name}
                  </li>
                ))
              )}
            </div>
          </GridItem>

          <GridItem
            classes={{
              'payment-combo-buyable-item__grid_item-pricing':
                'payment-combo-buyable-item__grid_item-pricing',
            }}
          >
            <div className="bs-payment-combo-buyable-item__prices-container">
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
          {/* START -- SECOND ROW : SPANNING TWO COLUMNS */}
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
                className={classNames(
                  'bs-payment-combo-buyable-item__description',
                  {
                    'bs-payment-combo-buyable-item__description--short':
                      !showAllDescription,
                  },
                )}
              >
                {paymentCombo?.description ?? ''}
              </div>
            </Collapse>
          </GridItem>

          {/* START -- THIRD ROW */}
          <GridItem
            classes={{
              'payment-combo-buyable-item__grid_item-collapse-arrow':
                'payment-combo-buyable-item__grid_item-collapse-arrow',
            }}
          >
            <div
              className={classNames({
                'bs-payment-combo-buyable-item__seemore--hidden':
                  !descriptionText.isExpandable,
              })}
            >
              <Button
                classes={{
                  root: 'bs-payment-combo-buyable-item__seemore',
                  text: 'bs-payment-combo-buyable-item__seemore__text',
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
        </Grid>
      </CardContent>
    </Card>
  );
};

export const MarketplacePaymentComboBuyableItemForStorybook =
  marketplaceCssHoc()(MarketplacePaymentComboBuyableItem);

export default React.memo(MarketplacePaymentComboBuyableItem);
