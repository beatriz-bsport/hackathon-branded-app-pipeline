import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Style from '@material-ui/icons/Style';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useMediaQuery, useTheme } from '@material-ui/core';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import ToolTip from '#src/components/Tooltip.component';
import Card from '#src/components/css-only/Card';
import CardContent from '#src/components/css-only/Card/CardContent';
import Grid from '#src/components/css-only/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#src/components/css-only/Grid/GridItem';
import Price from '#src/components/css-only/Price';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import { CardSize } from '#src/components/css-only/Card/types';
import { MARKETPLACE_BREAKPOINT } from '#src/libs/marketplace/constants';
import Button, { ButtonColor } from '#src/components/css-only/Fabrique/Button';
import { useValidityInfoForPaymentPackCard } from '../../../utils/payment-pack';

import './styles.css';

export type Props = {
  paymentPack: PaymentPack;
  isExcludingTax?: boolean;
  addToCart: () => void;
  onOpenDetailDialog: () => void;
  hideCredits?: boolean;
};

const MarketplacePaymentPackCard: React.FC<Props> = ({
  paymentPack,
  isExcludingTax,
  addToCart,
  onOpenDetailDialog,
  hideCredits,
}) => {
  const { t } = useTranslation('marketplace');
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
  );

  const count = getCreditsDividedValue(paymentPack?.credits);
  const credits = getCreditsDividedDisplay(paymentPack?.credits);

  const formatedCredits = paymentPack.unlimited
    ? t('genericCard.credits.unlimited')
    : `${t('genericCard.credits.availableCredit', {
        count,
        credits,
      })}`;

  const handleAddToCart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      addToCart();
    },
    [addToCart],
  );

  return (
    <Card
      classes={{ 'bs-pass-card': 'bs-pass-card' }}
      id={`payment-pack-${paymentPack?.id}`}
      size={CardSize.AUTO}
    >
      <CardContent
        padding
        classes={{ 'bs-pass-card-content': 'bs-pass-card-content' }}
      >
        <Grid
          classes={{ 'bs-paymentpack-card__grid': 'bs-paymentpack-card__grid' }}
        >
          <GridItem
            alignment={Alignment.FLEX_START}
            columnEnd={2}
            columnStart={1}
            justification={
              isMobile ? Justification.SPACE_BETWEEN : Justification.FLEX_START
            }
          >
            <div className="bs-paymentpack-card__title">
              {!!paymentPack.linked_private_pass && (
                <ToolTip title={t('genericCard.title.universalPassMessage')}>
                  <Style className="bs-paymentpack-card__title__icon" />
                </ToolTip>
              )}
              {paymentPack.name}
            </div>
            {!hideCredits && (
              <div className="bs-paymentpack-card__subtitle">
                {formatedCredits}
              </div>
            )}
            {paymentPack.description && (
              <div className="bs-paymentpack-card__description">
                {paymentPack.description}
              </div>
            )}
          </GridItem>
          <GridItem
            alignment={Alignment.FLEX_END}
            columnEnd={3}
            columnStart={2}
            justification={Justification.SPACE_BETWEEN}
          >
            <div className="bs-paymentpack-card__validity">
              <div className="bs-paymentpack-card__validity__content">
                {useValidityInfoForPaymentPackCard(paymentPack)}
              </div>
            </div>
            <Price
              amount={paymentPack.price}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              isExcludingTax={isExcludingTax}
              tax={paymentPack.tax}
            >
              <Button
                classes={{ root: 'bs-paymentpack-card__price-icon' }}
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon />
              </Button>
            </Price>
          </GridItem>
        </Grid>
        <GridItem
          classes={{
            'bs-paymentpack-card__footer': 'bs-paymentpack-card__footer',
          }}
          direction={Direction.ROW}
          justification={Justification.SPACE_BETWEEN}
        >
          <Button
            classes={{
              root: 'bs-paymentpack-card__left-button',
              text: 'bs-paymentpack-card__left-button__content',
            }}
            onClick={onOpenDetailDialog}
          >
            <VisibilityIcon className="bs-paymentpack-card__left-button__icon" />
            {t('genericCard.details.buttonContent')}
          </Button>

          <Button
            classes={{ root: 'bs-paymentpack-card__right-button' }}
            color={ButtonColor.PRIMARY}
            onClick={addToCart}
          >
            {t('genericCard.addButton.buttonContent')}
          </Button>
        </GridItem>
      </CardContent>
    </Card>
  );
};
export const MarketplacePaymentPackCardForStorybook = marketplaceCssHoc()(
  MarketplacePaymentPackCard,
);

export default React.memo(MarketplacePaymentPackCard);
