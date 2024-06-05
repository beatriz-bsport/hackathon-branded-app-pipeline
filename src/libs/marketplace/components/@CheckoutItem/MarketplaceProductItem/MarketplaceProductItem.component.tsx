import React from 'react';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Card, { CardSize } from '#src/components/css-only/Card';
import CardContent from '#src/components/css-only/Card/CardContent';
import Grid from '#src/components/css-only/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#src/components/css-only/Grid/GridItem';
import Price from '#src/components/css-only/Price/Price.component';
import { MarketplaceProductItemSkeleton } from '.';

import './styles.css';

export type Props = {
  quantity: number;
  name: string;
  price: number;
  tax: number;
  isExcludingTax?: boolean;
  isLoading: boolean;
};

const MarketplaceProductItem: React.FC<Props> = ({
  quantity,
  name,
  price,
  isExcludingTax,
  tax,
  isLoading,
}) => {
  const nbsp = `\u00A0`;
  const formattedQuantity = quantity && `x${nbsp}${quantity}`;
  if (isLoading) {
    return <MarketplaceProductItemSkeleton />;
  }
  return (
    <Card
      classes={{
        'bs-product-item': 'bs-product-item',
      }}
      size={CardSize.AUTO}
    >
      <CardContent
        padding
        classes={{ 'bs-product-item-content': 'bs-product-item-content' }}
      >
        <Grid
          classes={{
            'bs-product-item-grid': 'bs-product-item-grid',
          }}
        >
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-product-item-quantity': 'bs-product-item-quantity',
            }}
            columnStart={1}
            direction={Direction.ROW}
          >
            <p>{formattedQuantity}</p>
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-product-item-name': 'bs-product-item-name',
            }}
            columnEnd={3}
            columnStart={2}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
          >
            <p>{name}</p>
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-product-item-price__container':
                'bs-product-item-price__container',
            }}
            columnStart={3}
            direction={Direction.ROW}
          >
            <Price
              amount={price}
              classes={{
                'bs-product-item-price': 'bs-product-item-price',
              }}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              isExcludingTax={!!isExcludingTax && isExcludingTax}
              tax={tax}
            />
          </GridItem>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const MarketplaceProductItemForStoryBook = marketplaceCssHoc()(
  MarketplaceProductItem,
);

export default React.memo(MarketplaceProductItem);
