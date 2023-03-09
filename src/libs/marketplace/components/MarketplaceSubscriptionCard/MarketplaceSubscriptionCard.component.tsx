import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HistoryIcon from '@material-ui/icons/History';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card from '#csscomponents/Card';
import Content from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import Item, {
  Alignment,
  Direction,
  Justification,
} from '#csscomponents/Grid/GridItem';
import Price from '#csscomponents/Price';

import BillingInterval from './BillingInterval';

import './styles.css';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import type { Subscription } from '#libs/subscription/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentPack } from '#libs/payment-packs/types';
import { PaymentCombo } from '#libs/payment-combo/types';

type SubscriptionType = Subscription<PrivatePass, PaymentPack, PaymentCombo>;

export type Props = {
  subscription: SubscriptionType;
  addToCart: () => void;
  onOpenDetailDialog: () => void;
};

const MarketplaceSubscriptionCard: React.FC<Props> = ({
  subscription,
  addToCart,
  onOpenDetailDialog,
}) => {
  const { t } = useTranslation('marketplace');

  return (
    <Card classes={{ 'bs-subscription-card': 'bs-subscription-card' }}>
      <Content padding>
        <Grid
          classes={{
            'bs-subscription-card__grid': 'bs-subscription-card__grid',
          }}
        >
          <Item alignment={Alignment.FLEX_START} columnEnd={1}>
            <div className="bs-subscription-card__title">
              <HistoryIcon className="bs-subscription-card__title__icon" />
              {subscription?.name}
            </div>
            {!!subscription?.flat_fee && (
              <div className="bs-subscription-card__subtitle">
                {t('subscriptionCard.fees', {
                  fees: getCurrencyDisplayWithPrice(subscription.flat_fee),
                })}
              </div>
            )}
            <div className="bs-subscription-card__description">
              {subscription?.description}
            </div>
          </Item>
          <Item
            alignment={Alignment.FLEX_END}
            justification={Justification.FLEX_START}
            rowStart={1}
            columnEnd={2}
          >
            {!!subscription?.planned_invoices?.length && (
              <div className="bs-subscription-card__planned-invoices">
                <div className="bs-subscription-card__planned-invoices__content">
                  {t('subscriptionCard.invoice', {
                    count: subscription.planned_invoices.length,
                  })}
                </div>
              </div>
            )}
          </Item>
          <Item
            rowStart={1}
            columnStart={1}
            justification={Justification.FLEX_END}
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-subscription-card__price-item':
                'bs-subscription-card__price-item',
            }}
          >
            <div className="bs-subscription-card__price-container">
              <Price
                amount={subscription?.recurrent_price}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                classes={{
                  'bs-subscription-card__price': 'bs-subscription-card__price',
                }}
              >
                <div className="bs-subscription-card__billing-interval--desktop">
                  <BillingInterval subscription={subscription} />
                </div>
                <div className="bs-subscription-card__billing-interval--mobile">
                  {subscription?.flat_fee ? (
                    <BillingInterval subscription={subscription} withFees />
                  ) : (
                    <BillingInterval subscription={subscription} />
                  )}
                </div>
              </Price>
            </div>
          </Item>
          <Item
            rowStart={2}
            columnStart={1}
            justification={Justification.CENTER}
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-subscription-card__price-icon':
                'bs-subscription-card__price-icon',
            }}
          >
            <ShoppingCartIcon />
          </Item>
        </Grid>
        <Item
          justification={Justification.SPACE_BETWEEN}
          direction={Direction.ROW}
          classes={{
            'bs-subscription-card__footer': 'bs-subscription-card__footer',
          }}
        >
          <button
            type="button"
            className="bs-subscription-card__left-button"
            onClick={onOpenDetailDialog}
          >
            <div className="bs-subscription-card__left-button__content">
              <VisibilityIcon className="bs-subscription-card__left-button__icon" />
              {t('genericCard.details.buttonContent')}
            </div>
          </button>

          <button
            type="button"
            className="bs-subscription-card__right-button"
            onClick={addToCart}
          >
            {t('subscriptionCard.registerButton')}
          </button>
        </Item>
      </Content>
    </Card>
  );
};

export default compose(
  marketplaceCssHoc(),
  React.memo,
)(MarketplaceSubscriptionCard);
