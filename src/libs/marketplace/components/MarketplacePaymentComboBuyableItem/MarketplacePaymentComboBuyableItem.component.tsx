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
import Content from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import Item, { Alignment, Justification } from '#csscomponents/Grid/GridItem';
import Price from '#csscomponents/Price';
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
      <Content
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
          <Item
            alignment={Alignment.FLEX_START}
            classes={{
              'bs-payment-combo-buyable__title-item':
                'bs-payment-combo-buyable__title-item',
            }}
            columnStart={1}
            justification={Justification.SPACE_BETWEEN}
          >
            <div className="bs-payment-combo-buyable-item__title">
              {paymentCombo.name}
            </div>
          </Item>
          {paymentCombo.highlighted_as_recommended && (
            <Item
              classes={{
                'bs-payment-combo-buyable__recommended-item':
                  'bs-payment-combo-buyable__recommended-item',
              }}
              columnEnd={3}
              columnStart={2}
              justification={Justification.FLEX_START}
            >
              <div className="bs-payment-combo-buyable-item__recommended-container">
                <RecommendedChip />
              </div>
            </Item>
          )}
          <Item
            classes={{
              'bs-payment-combo-buyable__elements-item':
                'bs-payment-combo-buyable__elements-item',
            }}
            columnEnd={3}
            columnStart={1}
            rowStart={2}
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
                    key={item.id}
                    className="bs-payment-combo-buyable-item__list__item"
                  >
                    {item.name}
                  </li>
                ))
              )}
            </div>
          </Item>
          <Item
            classes={{
              'bs-payment-combo-buyable__description-item':
                'bs-payment-combo-buyable__description-item',
            }}
            columnEnd={isMobile ? 4 : 3}
            columnStart={1}
            rowStart={3}
          >
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
              {paymentCombo.description}
            </div>
          </Item>
          {descriptionText.isExpandable && (
            <Item
              classes={{
                'bs-payment-combo-buyable__seemore-item':
                  'bs-payment-combo-buyable__seemore-item',
              }}
              rowStart={4}
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
            </Item>
          )}
          <Item
            classes={{
              'bs-payment-combo-buyable-item__item':
                'bs-payment-combo-buyable-item__item',
            }}
            columnStart={3}
            justification={Justification.SPACE_BETWEEN}
            rowEnd={3}
            rowStart={1}
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
          </Item>
        </Grid>
      </Content>
    </Card>
  );
};

export const MarketplacePaymentComboBuyableItemForStorybook =
  marketplaceCssHoc()(MarketplacePaymentComboBuyableItem);

export default React.memo(MarketplacePaymentComboBuyableItem);
