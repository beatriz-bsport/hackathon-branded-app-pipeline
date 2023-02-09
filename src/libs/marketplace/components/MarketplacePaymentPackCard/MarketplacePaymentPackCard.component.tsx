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
  const { t } = useTranslation(['marketplace']);

  const formatedCredits = paymentPack.unlimited
    ? t('genericCard.credits.unlimited')
    : t('genericCard.credits.availableCredit', { count: paymentPack.credits });

  return (
    <Card classes={{ 'bs-pass-card': 'bs-pass-card' }}>
      <Content padding>
        <Grid classes={{ 'bs-pass-card__grid': 'bs-pass-card__grid' }}>
          <Item alignment={Alignment.FLEX_START} columnEnd={1}>
            <div className="bs-pass-card__title">
              {paymentPack.is_universal_pass && (
                <ToolTip title={t('genericCard.title.universalPassMessage')}>
                  <Style className="bs-pass-card__title__icon" />
                </ToolTip>
              )}
              {paymentPack.name}
            </div>
            <div className="bs-pass-card__subtitle">{formatedCredits}</div>
            <div className="bs-pass-card__description">{description}</div>
          </Item>
          <Item
            alignment={Alignment.FLEX_END}
            justification={Justification.SPACE_BETWEEN}
          >
            <div className="bs-pass-card__validity">
              <div className="bs-pass-card__validity__content">
                {useValidityInfoForPaymentPackCard(paymentPack)}
              </div>
            </div>
            <Price
              amount={paymentPack.price}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
            >
              <div className="bs-pass-card__price-icon">
                <ShoppingCartIcon />
              </div>
            </Price>
          </Item>
        </Grid>
        <Item
          justification={Justification.SPACE_BETWEEN}
          direction={Direction.ROW}
          classes={{ 'bs-pass-card__footer': 'bs-pass-card__footer' }}
        >
          <button
            type="button"
            className="bs-pass-card__left-button"
            onClick={onOpenDetailDialog}
          >
            <div className="bs-pass-card__left-button__content">
              <VisibilityIcon className="bs-pass-card__left-button__icon" />
              {t('genericCard.details.buttonContent')}
            </div>
          </button>

          <button
            type="button"
            className="bs-pass-card__right-button"
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
