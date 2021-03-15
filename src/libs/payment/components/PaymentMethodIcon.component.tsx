import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core/styles';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import Typography from '@material-ui/core/Typography';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT,
} from '@bsport/common/lib/master-data/payment-group';

import SEPA_LOGO from '../icons/sepa.png';
import BANCONTACT_LOGO from '../icons/bancontact.png';
import SOFORT_LOGO from '../icons/sofort.png';
import IDEAL_LOGO from '../icons/ideal.png';

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
          <img className={classes.sepaIcon} src={SEPA_LOGO} alt="sepa" />
        </div>
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT:
      return (
        <img className={classes.icon} src={BANCONTACT_LOGO} alt="bancontact" />
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT:
      return (
        <div className={classes.sepaContainer}>
          <img className={classes.sepaIcon} src={SOFORT_LOGO} alt="sofort" />
        </div>
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL:
      return <img className={classes.icon} src={IDEAL_LOGO} alt="ideal" />;
    default:
      return <EuroSymbolIcon className={classes.icon} />;
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
  creditCardContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default PaymentMethodIcon;
