import React from 'react';
import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import Card, { CardSize } from '#csscomponents/Card';
import CardContent from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#csscomponents/Grid/GridItem';
import Price from '#csscomponents/Price';
import Button, { ButtonColor } from '#csscomponents/Fabrique/Button';
import type { PaymentCombo } from '#libs/payment-combo/types';
import InitialPrice from './InitialPrice';
import PaymentComboItemList from './PaymentComboItemList';

import './styles.css';

export type Props = {
  paymentCombo: PaymentCombo;
  isExcludingTax: boolean;
  onClick: () => void;
  addToCart: () => void;
  onOpenDetailDialog: () => void;
};

const MarketplacePaymentComboCard: React.FC<Props> = ({
  paymentCombo,
  isExcludingTax,
  onClick,
  addToCart,
  onOpenDetailDialog,
}) => {
  const { t } = useTranslation('marketplace');

  return (
    <Card
      classes={{ 'bs-pack-card': 'bs-pack-card' }}
      id={`payment-combo-${paymentCombo?.id}`}
      onClick={onClick}
      size={CardSize.AUTO}
    >
      <CardContent>
        <Grid classes={{ 'bs-pack-card__grid': 'bs-pack-card__grid' }}>
          <GridItem
            alignment={Alignment.FLEX_START}
            classes={{
              'bs-pack-card__item': 'bs-pack-card__item',
              '--left': '--left',
            }}
            columnStart={1}
            justification={Justification.SPACE_BETWEEN}
          >
            <div className="bs-pack-card__text-container">
              <div className="bs-pack-card__title">{paymentCombo.name}</div>
              <div className="bs-pack-card__description">
                {paymentCombo.description}
              </div>
            </div>
          </GridItem>
          <GridItem
            classes={{
              'bs-pack-card__item': 'bs-pack-card__item',
              '--rigth': '--rigth',
            }}
            columnStart={2}
            justification={Justification.SPACE_BETWEEN}
          >
            <PaymentComboItemList
              classes={{ 'bs-pack-card__list': 'bs-pack-card__list' }}
              onOpenDetailDialog={onOpenDetailDialog}
              paymentCombo={paymentCombo}
            />
            <div className="bs-pack-card__prices-container">
              <InitialPrice
                isExcludingTax={isExcludingTax}
                paymentCombo={paymentCombo}
              />
              <Price
                amount={paymentCombo.price}
                classes={{
                  'bs-pack-card__price': 'bs-pack-card__price',
                }}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                isExcludingTax={isExcludingTax}
                tax={paymentCombo.tax}
              >
                <Button
                  classes={{
                    root: 'bs-pack-card__price__icon',
                  }}
                  onClick={addToCart}
                >
                  <ShoppingCartIcon />
                </Button>
              </Price>
            </div>
          </GridItem>
        </Grid>
        <GridItem
          alignment={Alignment.CENTER}
          classes={{ 'bs-pack-card__footer': 'bs-pack-card__footer' }}
          direction={Direction.ROW}
          justification={Justification.SPACE_BETWEEN}
        >
          <Button
            classes={{
              root: 'bs-pack-card__footer__button__left',
              text: 'bs-pack-card__footer__left__button__content',
            }}
            onClick={onOpenDetailDialog}
          >
            <VisibilityIcon className="bs-pack-card__button__icon" />
            {t('genericCard.details.buttonContent')}
          </Button>

          <Button
            classes={{
              root: 'bs-pack-card__footer__button__right',
            }}
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

export const MarketplacePaymentComboCardForStorybook = marketplaceCssHoc()(
  MarketplacePaymentComboCard,
);

export default React.memo(MarketplacePaymentComboCard);
