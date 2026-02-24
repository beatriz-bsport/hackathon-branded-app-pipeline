import React from 'react';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { getCreditsDividedValue } from '#src/libs/theme/utils';
import Card, { CardSize } from '#src/components/css-only/Card';
import Grid from '#src/components/css-only/Grid';
import CardContent from '#src/components/css-only/Card/CardContent';

import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#src/components/css-only/Grid/GridItem';
import Price from '#src/components/css-only/Price';
import MinimalCardSkeleton from '#src/libs/marketplace/components/MinimalCardSkeleton';
import type { PrivatePass } from '#src/libs/private-service/types';
import './styles.css';

export type Props = {
  privatePass: PrivatePass;
  quantity?: number;
  isExcludingTax?: boolean;
  isLoading: boolean;
};

const MinimalPrivatePassCard: React.FC<Props> = ({
  privatePass,
  quantity,
  isExcludingTax,
  isLoading,
}) => {
  const { t } = useTranslation('marketplace');

  if (!privatePass) return null;

  if (isLoading) return <MinimalCardSkeleton />;

  const nbsp = `\u00A0`;

  const formattedQuantity = quantity && `x${nbsp}${quantity}`;

  const formattedCredits = t('genericCard.credits.availableCredit', {
    count: getCreditsDividedValue(privatePass.credits),
  });

  return (
    <Card
      classes={{
        'bs-minimal-private-pass-card': 'bs-minimal-private-pass-card',
      }}
      size={CardSize.AUTO}
    >
      <CardContent
        padding
        classes={{
          'bs-minimal-private-pass-card-content':
            'bs-minimal-private-pass-card-content',
        }}
      >
        <Grid
          classes={{
            'bs-minimal-private-pass-card-grid':
              'bs-minimal-private-pass-card-grid',
          }}
        >
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-minimal-private-pass-card__title-item':
                'bs-minimal-private-pass-card__title-item',
            }}
            columnStart={1}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={1}
          >
            {formattedQuantity && (
              <span className="bs-minimal-private-pass-card__title-item__quantity">
                {`${formattedQuantity}${nbsp}`}
              </span>
            )}
            <div className="bs-minimal-private-pass-card__title-item__name">
              {privatePass.name}
            </div>
          </GridItem>

          <GridItem
            classes={{
              'bs-minimal-private-pass-card__price-item':
                'bs-minimal-private-pass-card__price-item',
            }}
            columnStart={2}
            direction={Direction.ROW}
            justification={Justification.FLEX_END}
            rowStart={1}
          >
            <Price
              amount={privatePass.price}
              classes={{
                'bs-minimal-private-pass-card__price-item__price':
                  'bs-minimal-private-pass-card__price-item__price',
              }}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              isExcludingTax={!!isExcludingTax}
              tax={privatePass.tax}
            />
          </GridItem>
          <GridItem
            classes={{
              'bs-minimal-private-pass-card__credit-item':
                'bs-minimal-private-pass-card__credit-item',
            }}
            columnStart={1}
            justification={Justification.FLEX_START}
            rowStart={2}
          >
            <div className="bs-minimal-private-pass-card__credit-item__credits">
              {formattedCredits}
            </div>
          </GridItem>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const MinimalPrivatePassCardForStorybook = marketplaceCssHoc<Props>()(
  MinimalPrivatePassCard,
);

export default React.memo(MinimalPrivatePassCard);
