import React from 'react';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import Card, { CardSize } from '#src/components/css-only/Card';
import Grid from '#src/components/css-only/Grid';
import CardContent from '#src/components/css-only/Card/CardContent';

import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#src/components/css-only/Grid/GridItem';
import Price from '#src/components/css-only/Price';
import { PaymentCombo } from '#src/libs/payment-combo/types';
import MinimalCardSkeleton from '#src/libs/marketplace/components/MinimalCardSkeleton';
import PaymentComboItemList from '../MarketplacePaymentComboCard/PaymentComboItemList';
import InitialPrice from '../MarketplacePaymentComboCard/InitialPrice';

import './styles.css';

export type Props = {
  paymentCombo: PaymentCombo;
  quantity?: number;
  isExcludingTax?: boolean;
  isLoading: boolean;
};

const MinimalPaymentComboCard: React.FC<Props> = ({
  paymentCombo,
  quantity,
  isExcludingTax,
  isLoading,
}) => {
  if (!paymentCombo) return null;

  if (isLoading) return <MinimalCardSkeleton />;

  const nbsp = `\u00A0`;

  const formattedQuantity = quantity && `x${nbsp}${quantity}`;

  return (
    <Card
      classes={{
        'bs-minimal-payment-combo-card': 'bs-minimal-payment-combo-card',
      }}
      size={CardSize.AUTO}
    >
      <CardContent
        padding
        classes={{
          'bs-minimal-payment-combo-card-content':
            'bs-minimal-payment-combo-card-content',
        }}
      >
        <Grid
          classes={{
            'bs-minimal-payment-combo-card-grid':
              'bs-minimal-payment-combo-card-grid',
          }}
        >
          <GridItem
            alignment={Alignment.FLEX_START}
            classes={{
              'bs-minimal-payment-combo-card__title-item':
                'bs-minimal-payment-combo-card__title-item',
            }}
            columnStart={1}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={1}
          >
            {formattedQuantity && (
              <span className="bs-minimal-payment-combo-card__title-item__quantity">
                {`${formattedQuantity}${nbsp}`}
              </span>
            )}
            <div className="bs-minimal-payment-combo-card__title-item__name">
              {paymentCombo.name}
            </div>
          </GridItem>

          <GridItem
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-minimal-payment-combo-card__price-item':
                'bs-minimal-payment-combo-card__price-item',
            }}
            columnStart={2}
            direction={Direction.COLUMN}
            rowStart={1}
          >
            <InitialPrice
              isExcludingTax={isExcludingTax}
              paymentCombo={paymentCombo}
            />
            <Price
              amount={paymentCombo.price}
              classes={{
                'bs-minimal-payment-combo-card__price-item__price':
                  'bs-minimal-payment-combo-card__price-item__price',
              }}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              isExcludingTax={isExcludingTax}
              tax={paymentCombo.tax}
            />
          </GridItem>
          <GridItem
            classes={{
              'bs-minimal-payment-combo-card__list-item':
                'bs-minimal-payment-combo-card__list-item',
            }}
            columnEnd={3}
            columnStart={1}
            justification={Justification.FLEX_START}
            rowStart={2}
          >
            <PaymentComboItemList
              classes={{
                'bs-minimal-payment-combo-card__list-item__list':
                  'bs-minimal-payment-combo-card__list-item__list',
              }}
              paymentCombo={paymentCombo}
            />
          </GridItem>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const MinimalPaymentComboCardForStorybook = marketplaceCssHoc()(
  MinimalPaymentComboCard,
);

export default React.memo(MinimalPaymentComboCard);
