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
      classes={{ 'bs-pack-card': 'bs-pack-card' }}
      onClick={onClick}
      size={CardSize.AUTO}
    >
      <Content>
        <Grid classes={{ 'bs-pack-card__grid': 'bs-pack-card__grid' }}>
          <Item
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
          </Item>
          <Item
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
                <button
                  className="bs-pack-card__price__icon"
                  onClick={addToCart}
                  type="button"
                >
                  <ShoppingCartIcon />
                </button>
              </Price>
            </div>
          </Item>
        </Grid>
        <Item
          alignment={Alignment.CENTER}
          classes={{ 'bs-pack-card__footer': 'bs-pack-card__footer' }}
          direction={Direction.ROW}
          justification={Justification.SPACE_BETWEEN}
        >
          <button
            className="bs-pack-card__footer__button__left"
            onClick={onOpenDetailDialog}
            type="button"
          >
            <div className="bs-pack-card__footer__left__button__content">
              <VisibilityIcon className="bs-pack-card__button__icon" />
              {t('genericCard.details.buttonContent')}
            </div>
          </button>

          <button
            className="bs-pack-card__footer__button__right"
            onClick={addToCart}
            type="button"
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
