import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group';

const PaymentMethodTypeSwitcher = (props: {
  onChange: (string) => void;
  payment_method: string;
  enabledPaymentGroupMethodIdentifier: Array<number>;
  disabled: boolean;
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  return (
    <RadioGroup
      aria-label="payment-method"
      className={classes.paymentMethodSelectorContainer}
      value={props.payment_method}
      onChange={(ev) => props.onChange(parseInt(ev.target.value))}
    >
      {(props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
      ) && (
        <FormControlLabel
          value={PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA}
          control={<Radio color="primary" />}
          label={t('paymentMethod.sepa')}
          labelPlacement="bottom"
          disabled={props.disabled}
        />
      )}
      {(props.enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
      ) && (
        <FormControlLabel
          value={PAYMENT_GROUP_METHOD_IDENTIFIER_CB}
          control={<Radio color="primary" />}
          label={t('paymentMethod.card')}
          labelPlacement="bottom"
          disabled={props.disabled}
        />
      )}
    </RadioGroup>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  paymentMethodSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
}));

export default PaymentMethodTypeSwitcher;
