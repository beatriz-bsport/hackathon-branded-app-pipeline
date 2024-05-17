import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core/styles';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MoneyIcon from '@material-ui/icons/Money';
import Typography from '@material-ui/core/Typography';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
} from '@bsport/common/lib/master-data/payment-group';
import { getCurrencyDisplay } from '../../theme/selectors';

// import/no-unresolved
import SEPA_LOGO from '../icons/sepa.svg';
import BANCONTACT_LOGO from '../icons/bancontact.png';
import SOFORT_LOGO from '../icons/sofort.png';
import IDEAL_LOGO from '../icons/ideal.png';
import BACS_DEBIT_LOGO from '../icons/bacs-direct-debit.png';
import Stripe from '../icons/Stripe.icon';
import { PAYMENT_STRIPE_TERMINAL_FAKE } from '../utils';
import { QuicksalePaymentMethod } from '#libs/quicksale/constants';

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
    case PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA:
      return (
        <div className={classes.sepaContainer}>
          <img alt="sepa" className={classes.sepaIcon} src={SEPA_LOGO} />
        </div>
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT:
      return (
        <img alt="bancontact" className={classes.icon} src={BANCONTACT_LOGO} />
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT:
      return (
        <div className={classes.sepaContainer}>
          <img alt="sofort" className={classes.sepaIcon} src={SOFORT_LOGO} />
        </div>
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL:
      return <img alt="ideal" className={classes.icon} src={IDEAL_LOGO} />;
    case PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT:
      return <img alt="ideal" className={classes.icon} src={BACS_DEBIT_LOGO} />;
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
        return <EuroSymbolIcon className={classes.icon} />;
      }
      return <AttachMoneyIcon className={classes.icon} />;
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  sepaContainer: {
    display: 'flex',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  sepaIcon: {
    height: 18,
  },
  icon: {
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
