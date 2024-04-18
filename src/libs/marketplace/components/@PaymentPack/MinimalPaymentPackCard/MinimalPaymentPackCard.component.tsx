import React from 'react';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { getCreditsDividedValue } from '#libs/theme/utils';
import Card, { CardSize } from '#components/css-only/Card';
import Grid from '#components/css-only/Grid';
import CardContent from '#components/css-only/Card/CardContent';

import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#components/css-only/Grid/GridItem';
import Price from '#components/css-only/Price';
import type { PaymentPack } from '#libs/payment-packs/types';

import MinimalCardSkeleton from '#marketplacecomponents/MinimalCardSkeleton';

import './styles.css';

export type Props = {
  paymentPack: PaymentPack;
  quantity?: number;
  isExcludingTax?: boolean;
  isLoading: boolean;
};

const MinimalPaymentPackCard: React.FC<Props> = ({
  paymentPack,
  quantity,
  isExcludingTax,
  isLoading,
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
      });

  return (
    <Card
      classes={{
        'bs-minimal-payment-pack-card': 'bs-minimal-payment-pack-card',
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
            {formattedQuantity && (
              <span className="bs-minimal-payment-pack-card__title-item__quantity">
                {formattedQuantity}
              </span>
            )}
            <div className="bs-minimal-payment-pack-card__title-item__name">
              {paymentPack.name}
            </div>
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
            <Price
              amount={paymentPack.price}
              classes={{
                'bs-minimal-payment-pack-card__price-item__price':
                  'bs-minimal-payment-pack-card__price-item__price',
              }}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              isExcludingTax={isExcludingTax}
              tax={paymentPack.tax}
            />
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
            <div className="bs-minimal-payment-pack-card__credit-item__credits">
              {formattedCredits}
            </div>
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
