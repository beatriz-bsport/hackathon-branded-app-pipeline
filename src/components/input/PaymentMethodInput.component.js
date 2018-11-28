// @flow
import React from 'react';

import {
  FormControl,
  MenuItem,
  Select,
  Input,
  InputLabel,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import PAYMENT_METHODS from 'bsport-commons/lib/master-data/payment-methods';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 160,
  },
});

type Props = {
  t: (x: string) => string,
  classes: Object,
  value: ?number,
  onChange: (paymentMethodId: number) => void,
};

export function PaymentMethodInput(props: Props) {
  const { classes, onChange, value, t } = props;
  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink htmlFor="paymentMethod-helper">
        {t('common.paymentMethod')}
      </InputLabel>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        input={
          <Input name={t('common.paymentMethod')} id="paymentMethod-helper" />
        }
      >
        {PAYMENT_METHODS.map((pm) => (
          <MenuItem key={pm.id} value={pm.id}>{t(`paymentMethods.${pm.text}`)}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default withStyles(styles)(translate()(PaymentMethodInput));
