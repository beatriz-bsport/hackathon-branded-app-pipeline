// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';

type Props = {
  t: TFunction,
};
const PaymentMethodSelectorField = (props: Props) => {
  return (
    <fieldset>
      {!!props.label && (
        <legend style={{ marginBottom: -2 }}>{props.label}</legend>
      )}
      <FormGroup>
        {[
          { id: CB.id, optionLabel: props.t(`paymentMethod.${CB.text}`) },
          {
            id: CREDIT_ACCOUNT.id,
            optionLabel: props.t(`paymentMethod.${CREDIT_ACCOUNT.text}`),
          },
        ].map((pm) => (
          <FormControlLabel
            key={pm.id}
            label={pm.optionLabel}
            control={
              <Checkbox
                disabled={!!props.disabled}
                checked={props.paymentMethodIds.includes(pm.id)}
                onChange={() => {
                  if (props.paymentMethodIds.includes(pm.id)) {
                    props.onChange(
                      props.paymentMethodIds.filter((i) => i !== pm.id),
                    );
                  } else {
                    props.onChange([...props.paymentMethodIds, pm.id]);
                  }
                }}
              />
            }
          />
        ))}
      </FormGroup>
      {!!props.helperText && (
        <FormHelperText>{props.helperText}</FormHelperText>
      )}
    </fieldset>
  );
};

const styles = (theme) => ({
  container: {},
});

export default compose(
  withNamespaces(['translation']),
  withStyles(styles),
)(PaymentMethodSelectorField);
