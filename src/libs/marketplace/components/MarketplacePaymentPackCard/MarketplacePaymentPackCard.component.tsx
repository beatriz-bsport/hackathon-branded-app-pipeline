import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose, pure } from 'recompose';

import VisibilityIcon from '@material-ui/icons/Visibility';
import Style from '@material-ui/icons/Style';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { useValidityInfoForPaymentPackCard } from '../../utils/payment-pack';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import ToolTip from '#components/Tooltip.component';
import Card from '#components/css-only/Card';
import Content from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import Item, {
  Alignment,
  Direction,
  Justification,
} from '#components/css-only/Grid/GridItem';
import Price from '#components/css-only/Price';

import './styles.css';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import type { PaymentPack } from '#libs/payment-packs/types';

export type Props = {
  paymentPack: PaymentPack;

  description: string;
  addToCart: () => void;
  onOpenDetailDialog: () => void;
};

const MarketplacePaymentPackCard: React.FC<Props> = ({
  paymentPack,
  description,
  addToCart,
  onOpenDetailDialog,
}) => {
  const { t } = useTranslation('marketplace');

  const formatedCredits = paymentPack.unlimited
    ? t('genericCard.credits.unlimited')
    : t('genericCard.credits.availableCredit', { count: paymentPack.credits });

  return (
    <Card classes={{ 'bs-paymentpack-card': 'bs-paymentpack-card' }}>
      <Content padding>
        <Grid
          classes={{ 'bs-paymentpack-card__grid': 'bs-paymentpack-card__grid' }}
        >
          <Item alignment={Alignment.FLEX_START} columnEnd={1}>
            <div className="bs-paymentpack-card__title">
              {paymentPack.is_universal_pass && (
                <ToolTip title={t('genericCard.title.universalPassMessage')}>
                  <Style className="bs-paymentpack-card__title__icon" />
                </ToolTip>
              )}
              {paymentPack.name}
            </div>
            <div className="bs-paymentpack-card__subtitle">
              {formatedCredits}
            </div>
            <div className="bs-paymentpack-card__description">
              {description}
            </div>
          </Item>
          <Item
            alignment={Alignment.FLEX_END}
            justification={Justification.SPACE_BETWEEN}
          >
            <div className="bs-paymentpack-card__validity">
              <div className="bs-paymentpack-card__validity__content">
                {useValidityInfoForPaymentPackCard(paymentPack)}
              </div>
            </div>
            <div className="bs-paymentpack-card__price-container">
              <Price
                amount={paymentPack.price}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              >
                <div className="bs-paymentpack-card__price-icon">
                  <ShoppingCartIcon />
                </div>
              </Price>
            </div>
          </Item>
        </Grid>
        <Item
          justification={Justification.SPACE_BETWEEN}
          direction={Direction.ROW}
          classes={{
            'bs-paymentpack-card__footer': 'bs-paymentpack-card__footer',
          }}
        >
          <button
            type="button"
            className="bs-paymentpack-card__left-button"
            onClick={onOpenDetailDialog}
          >
            <div className="bs-paymentpack-card__left-button__content">
              <VisibilityIcon className="bs-paymentpack-card__left-button__icon" />
              {t('genericCard.details.buttonContent')}
            </div>
          </button>

          <button
            type="button"
            className="bs-paymentpack-card__right-button"
            onClick={addToCart}
          >
            {t('genericCard.addButton.buttonContent')}
          </button>
        </Item>
      </Content>
    </Card>
  );
};

export default compose(marketplaceCssHoc(), pure)(MarketplacePaymentPackCard);
