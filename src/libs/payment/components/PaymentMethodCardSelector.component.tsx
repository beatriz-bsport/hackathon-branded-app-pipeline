import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import classnames from 'classnames';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

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
      return <img className={classes.icon} src={SEPA_LOGO} alt="sepa" />;
    case PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT:
      return (
        <img className={classes.icon} src={BANCONTACT_LOGO} alt="bancontact" />
      );
    case PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT:
      return <img className={classes.icon} src={SOFORT_LOGO} alt="sofort" />;
    case PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL:
      return <img className={classes.icon} src={IDEAL_LOGO} alt="ideal" />;
    default:
      return <EuroSymbolIcon className={classes.icon} alt="payment-method" />;
  }
};

type Props = {
  paymentMethodSelected: number;
  paymentMethodChoices: Array<number>;
  selectPaymentMethod: (paymentMethod: number) => void;
};

export const PaymentMethodCardSelector = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  return (
    <FormControl className={classes.formControl}>
      <Typography
        className={classes.title}
        variant="h6"
        id="payment-method-select-label"
      >
        {t('paymentMethod.select.label')}
      </Typography>
      <div className={classes.row}>
        {props.paymentMethodChoices.map((pm) => (
          <ButtonBase onClick={() => props.selectPaymentMethod(pm)}>
            <Paper
              className={classnames(
                classes.paper,
                props.paymentMethodSelected === pm ? classes.selected : null,
              )}
            >
              <PaymentMethodIcon paymentMethod={pm} />
              {/* <Typography>{t(`paymentMethod.label.${pm}`)}</Typography> */}
            </Paper>
          </ButtonBase>
        ))}
      </div>
    </FormControl>
  );
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100vw',
    overflowX: 'auto',
    paddingBottom: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  icon: {
    height: 36,
  },
  selected: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 4,
  },
  creditCardContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

export default PaymentMethodCardSelector;
