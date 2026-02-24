import React from 'react';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import Card, { CardSize } from '#src/components/css-only/Card';
import Grid from '#src/components/css-only/Grid';
import CardContent from '#src/components/css-only/Card/CardContent';

import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#src/components/css-only/Grid/GridItem';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import Typography from '#src/components/css-only/Fabrique/Typography/Typography.component';
import { TypographyVariant } from '#src/components/css-only/Fabrique/Typography/constants';

import MinimalCardSkeleton from '#src/libs/marketplace/components/MinimalCardSkeleton';

import './styles.css';

export type Props = {
  paymentPack: PaymentPack;
  quantity?: number;
  isExcludingTax?: boolean;
  isLoading: boolean;
  isFocused?: boolean;
};

const MinimalPaymentPackCard: React.FC<Props> = ({
  paymentPack,
  quantity,
  isExcludingTax,
  isLoading,
  isFocused = false,
}) => {
  const { t } = useTranslation('marketplace');

  if (!paymentPack) return null;

  if (isLoading) return <MinimalCardSkeleton />;

  const nbsp = `\u00A0`;

  const formattedQuantity = quantity && `x${nbsp}${quantity}`;

  const formattedCredits = paymentPack.unlimited
    ? t('genericCard.credits.unlimited')
    : t('genericCard.credits.availableCredit', {
        count: getCreditsDividedValue(paymentPack.credits),
        credits: getCreditsDividedDisplay(paymentPack.credits),
      });

  return (
    <Card
      classes={{
        'bs-minimal-payment-pack-card': 'bs-minimal-payment-pack-card',
        'bs-minimal-payment-pack-card--focused':
          isFocused && 'bs-minimal-payment-pack-card--focused',
      }}
      size={CardSize.AUTO}
    >
      <CardContent
        padding
        classes={{
          'bs-minimal-payment-pack-card-content':
            'bs-minimal-payment-pack-card-content',
        }}
      >
        <Grid
          classes={{
            'bs-minimal-payment-pack-card-grid':
              'bs-minimal-payment-pack-card-grid',
          }}
        >
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-minimal-payment-pack-card__title-item':
                'bs-minimal-payment-pack-card__title-item',
            }}
            columnStart={1}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={1}
          >
            <Typography
              className="bs-minimal-payment-pack-card__title-item__name"
              variant={TypographyVariant.TITLE_SM}
            >
              {formattedQuantity && (
                <span className="bs-minimal-payment-pack-card__title-item__quantity">
                  {`${formattedQuantity}${nbsp}`}
                </span>
              )}
              {paymentPack.name}
            </Typography>
          </GridItem>

          <GridItem
            classes={{
              'bs-minimal-payment-pack-card__price-item':
                'bs-minimal-payment-pack-card__price-item',
            }}
            columnStart={2}
            direction={Direction.ROW}
            justification={Justification.FLEX_END}
            rowStart={1}
          >
            <Typography
              className="bs-minimal-payment-pack-card__price-item__price"
              variant={TypographyVariant.TITLE_SM}
            >
              {paymentPack.price === 0
                ? t('genericCard.price.free')
                : getCurrencyDisplayWithPrice(
                    paymentPack.price,
                    isExcludingTax,
                    paymentPack.tax,
                  )}
            </Typography>
          </GridItem>
          <GridItem
            classes={{
              'bs-minimal-payment-pack-card__credit-item':
                'bs-minimal-payment-pack-card__credit-item',
            }}
            columnStart={1}
            justification={Justification.FLEX_START}
            rowStart={2}
          >
            <Typography variant={TypographyVariant.BODY_SM}>
              {formattedCredits}
            </Typography>
          </GridItem>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const MinimalPaymentPackCardForStorybook = marketplaceCssHoc()(
  MinimalPaymentPackCard,
);

export default React.memo(MinimalPaymentPackCard);
