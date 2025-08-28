import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core/styles';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MoneyIcon from '@material-ui/icons/Money';
import Typography from '@material-ui/core/Typography';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_APPLE_PAY,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GOOGLE_PAY,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_PAYPAL_WALLET,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT,
} from '@bsport/common/lib/master-data/payment-group.js';

import BACS_DEBIT_LOGO from '#src/libs/payment/icons/bacs-direct-debit.png';
import BANCONTACT_LOGO from '#src/libs/payment/icons/bancontact.png';
import IDEAL_LOGO from '#src/libs/payment/icons/ideal.png';
import PAYPAL_LOGO from '#src/libs/payment/icons/paypal.png';
import SEPA_LOGO from '#src/libs/payment/icons/sepa.svg';
import TWINT_LOGO from '#src/libs/payment/icons/twint.svg';
import APPLE_PAY_LOGO from '#src/libs/payment/icons/apple_pay.svg';
import GOOGLE_PAY_LOGO from '#src/libs/payment/icons/google_pay.svg';
import Stripe from '#src/libs/payment/icons/Stripe.icon';
import { PAYMENT_STRIPE_TERMINAL_FAKE } from '#src/libs/payment/utils';
import { QuicksalePaymentMethod } from '#src/libs/quicksale/constants';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';

const PaymentMethodIcon = (props: { paymentMethod: number }) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  switch (props.paymentMethod) {
    case PAYMENT_GROUP_METHOD_IDENTIFIER_CB:
      return (
        <div className={classes.creditCardContainer}>
          <CreditCardIcon fontSize="large" />
          <Typography noWrap style={{ marginLeft: 4 }}>
            {t(`paymentMethod.label.${props.paymentMethod}`)}
          </Typography>
        </div>
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_PAYPAL_WALLET:
      return (
        <div className={classes.largeContainer}>
          <img alt="paypal" className={classes.iconMd} src={PAYPAL_LOGO} />
        </div>
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA:
      return (
        <div className={classes.largeContainer}>
          <img alt="sepa" className={classes.iconSm} src={SEPA_LOGO} />
        </div>
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT:
      return (
        <img
          alt="bancontact"
          className={classes.iconLg}
          src={BANCONTACT_LOGO}
        />
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL:
      return <img alt="ideal" className={classes.iconLg} src={IDEAL_LOGO} />;
    case PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT:
      return (
        <img
          alt="bacs_debit"
          className={classes.iconLg}
          src={BACS_DEBIT_LOGO}
        />
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT:
      return (
        <div className={classes.container}>
          <img alt="twint" className={classes.iconLg} src={TWINT_LOGO} />
        </div>
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_APPLE_PAY:
      return (
        <div className={classes.largeContainer}>
          <img
            alt="apple_pay"
            className={classes.iconMd}
            src={APPLE_PAY_LOGO}
          />
        </div>
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_GOOGLE_PAY:
      return (
        <div className={classes.largeContainer}>
          <img
            alt="google_pay"
            className={classes.iconMd}
            src={GOOGLE_PAY_LOGO}
          />
        </div>
      );
    case PAYMENT_STRIPE_TERMINAL_FAKE:
      return <Stripe className={classes.stripeIcon} />;
    case QuicksalePaymentMethod.Manual:
      return (
        <div className={classes.manualContainer}>
          <MoneyIcon className={classes.moneyIcon} />
          <Typography variant="body2">{t('paymentMethod.manual')}</Typography>
        </div>
      );
    default:
      if (getCurrencyDisplay() === '€') {
        return <EuroSymbolIcon className={classes.iconLg} />;
      }
      return <AttachMoneyIcon className={classes.iconLg} />;
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: 36,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  largeContainer: {
    display: 'flex',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  iconSm: {
    height: 18,
  },
  iconMd: {
    height: 26,
  },
  iconLg: {
    height: 36,
  },
  stripeIcon: {
    margin: theme.spacing(1, 2),
  },
  creditCardContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  manualContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  moneyIcon: {
    height: 35,
    width: 35,
  },
}));

export default React.memo(PaymentMethodIcon);
