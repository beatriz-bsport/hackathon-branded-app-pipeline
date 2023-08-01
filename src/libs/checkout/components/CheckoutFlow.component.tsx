// @ts-nocheck
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import BasketConsumer from './BasketConsumer.component';

import BasketFinalizer from './BasketFinalizer.component';
import ShopItemFeaturedBanner from './ShopItemFeaturedBanner.component';
import { CheckoutItem, Basket, PrepaidLine } from '../types';
import { ShopItem } from '../../shop/types';
import { PaymentMethod } from '../../payment/types';
import { OptionCallback } from '../../../state/types';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    minWidth: '40vw',
    maxWidth: '100vw',
  },
  title: {
    padding: theme.spacing(2),
    paddingLeft: 0,
  },
  featureBanner: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    maxWidth: '90vw',
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

type Props = {
  basket: Basket<string, PrepaidLine>;
  companyCountry?: string;
  loading: boolean;
  processing: boolean;
  termsAndConditions: string;

  shopItemList: Array<ShopItem>;
  addShopItemToBasket: (id: number) => void;

  removeItemFromBasket: (basketId: string, data: any) => void;
  addItemToBasket: (
    basketId: string,
    data: any,
    options?: OptionCallback,
  ) => void;

  paymentModule: any;

  onBasketFinalized: () => void;
  submitPayment: (data: any) => void;
  attachCoupon: (code: string) => void;
  patchBasket: (data: any) => void;

  backToCalendar: () => void;

  validateUnpaid: (options: OptionCallback) => void;

  savedPaymentMethodList?: Array<PaymentMethod>;

  termsAndConditionsAccepted: boolean;
  setTermsAndConditionsAccepted: (value: boolean) => void;
  onItemExpire: (item: CheckoutItem) => void;
  allowConsumerToUseInternalAccount: boolean;
  useInternalAccount: (amount: number) => void;
  creditAccountBalance?: number | null;
  onRemoveInternalAccountPrepaidLine: () => void;
  isExcludingTax: boolean;

  checkItemsBasket: (basketId: number) => void;
};

export const CheckoutFlow: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('checkout');
  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="h4">
        {t('myBasket.title')}
      </Typography>
      <Paper square>
        <BasketConsumer
          basket={props.basket}
          isExcludingTax={props.isExcludingTax}
          loading={props.loading}
          onAddCheckoutItem={(data) => {
            props.addItemToBasket(props.basket.id, data);
          }}
          onItemExpire={props.onItemExpire}
          onRemoveCheckoutItem={(data) =>
            props.removeItemFromBasket(props.basket.id, data)
          }
          onRemoveInternalAccountPrepaidLine={
            props.onRemoveInternalAccountPrepaidLine
          }
        />
      </Paper>
      {props.shopItemList.length ? (
        <div className={classes.featureBanner}>
          <ShopItemFeaturedBanner
            isExcludingTax={props.isExcludingTax}
            loading={props.loading || props.processing}
            onAddShopItem={props.addShopItemToBasket}
            shopItemList={props.shopItemList}
          />
        </div>
      ) : null}
      {props.basket.checkout_items.length ? (
        <Paper square className={classes.paper}>
          <BasketFinalizer
            withPrice
            allowConsumerToUseInternalAccount={
              props.allowConsumerToUseInternalAccount &&
              props.useInternalAccount
            }
            attachCoupon={props.attachCoupon}
            availablePaymentMethods={props.basket.available_payment_methods}
            backToCalendar={props.backToCalendar}
            basket={props.basket}
            checkItemsBasket={props.checkItemsBasket}
            companyCountry={props.companyCountry}
            creditAccountBalance={props.creditAccountBalance}
            isExcludingTax={props.isExcludingTax}
            loading={props.loading}
            onBasketFinalized={props.onBasketFinalized}
            patchBasket={props.patchBasket}
            paymentModule={props.paymentModule}
            processing={props.processing}
            savedPaymentMethodList={props.savedPaymentMethodList}
            setTermsAndConditionsAccepted={props.setTermsAndConditionsAccepted}
            submitPayment={props.submitPayment}
            termsAndConditions={props.termsAndConditions}
            termsAndConditionsAccepted={props.termsAndConditionsAccepted}
            useInternalAccount={props.useInternalAccount}
            validateUnpaid={props.validateUnpaid}
          />
        </Paper>
      ) : null}
    </div>
  );
};

export default CheckoutFlow;
