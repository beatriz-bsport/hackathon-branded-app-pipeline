// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import Card, { CardSize } from '#csscomponents/Card';
import Content from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import Item, {
  Alignment,
  Direction,
  Justification,
} from '#csscomponents/Grid/GridItem';
import Price from '#csscomponents/Price';
import InitialPrice from './InitialPrice';
import PaymentComboItemList from './PaymentComboItemList';

import './styles.css';

import type { PaymentCombo } from '#libs/payment-combo/types';

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
      size={CardSize.AUTO}
      classes={{ 'bs-pack-card': 'bs-pack-card' }}
      onClick={onClick}
    >
      <Content>
        <Grid classes={{ 'bs-pack-card__grid': 'bs-pack-card__grid' }}>
          <Item
            alignment={Alignment.FLEX_START}
            justification={Justification.SPACE_BETWEEN}
            columnStart={1}
            classes={{
              'bs-pack-card__item': 'bs-pack-card__item',
              '--left': '--left',
            }}
          >
            <div className="bs-pack-card__text-container">
              <div className="bs-pack-card__title">{paymentCombo.name}</div>
              <div className="bs-pack-card__description">
                {paymentCombo.description}
              </div>
            </div>
          </Item>
          <Item
            justification={Justification.SPACE_BETWEEN}
            columnStart={2}
            classes={{
              'bs-pack-card__item': 'bs-pack-card__item',
              '--rigth': '--rigth',
            }}
          >
            <PaymentComboItemList
              paymentCombo={paymentCombo}
              classes={{ 'bs-pack-card__list': 'bs-pack-card__list' }}
              onOpenDetailDialog={onOpenDetailDialog}
            />
            <div className="bs-pack-card__prices-container">
              <InitialPrice paymentCombo={paymentCombo} />
              <Price
                tax={paymentCombo.tax}
                isExcludingTax={isExcludingTax}
                amount={paymentCombo.price}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                classes={{
                  'bs-pack-card__price': 'bs-pack-card__price',
                }}
              >
                <button
                  type="button"
                  className="bs-pack-card__price__icon"
                  onClick={addToCart}
                >
                  <ShoppingCartIcon />
                </button>
              </Price>
            </div>
          </Item>
        </Grid>
        <Item
          direction={Direction.ROW}
          justification={Justification.SPACE_BETWEEN}
          alignment={Alignment.CENTER}
          classes={{ 'bs-pack-card__footer': 'bs-pack-card__footer' }}
        >
          <button
            type="button"
            className="bs-pack-card__footer__button__left"
            onClick={onOpenDetailDialog}
          >
            <div className="bs-pack-card__footer__left__button__content">
              <VisibilityIcon className="bs-pack-card__button__icon" />
              {t('genericCard.details.buttonContent')}
            </div>
          </button>

          <button
            type="button"
            className="bs-pack-card__footer__button__right"
            onClick={addToCart}
          >
            {t('genericCard.addButton.buttonContent')}
          </button>
        </Item>
      </Content>
    </Card>
  );
};

export const MarketplacePaymentComboCardForStorybook = marketplaceCssHoc()(
  MarketplacePaymentComboCard,
);

export default React.memo(MarketplacePaymentComboCard);
