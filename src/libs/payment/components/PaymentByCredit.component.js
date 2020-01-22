// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import { CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT } from '@bsport/common/lib/master-data/payment-methods';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import AcceptTermsAndConditions from './AcceptTermsAndConditions.component';

type Props = {
  termsAndConditions: string,
  setTermsAccepted: (boolean) => void,
  termsAccepted: boolean,
  loading: boolean,
  onCancel: () => void,
  submitPayment: (data: *) => void,
  t: TFunction,
  classes: Object,
};

export const PaymentByCredit = (props: Props) => (
  <div>
    <Typography
      align="center"
      color="textSecondary"
      className={props.classes.explainText}
    >
      {props.t('forms.credit.explain')}
    </Typography>
    {props.termsAndConditions ? (
      <AcceptTermsAndConditions
        accepted={props.termsAccepted}
        onChecked={(termsAccepted) => props.setTermsAccepted(termsAccepted)}
        termsAndConditions={props.termsAndConditions}
      />
    ) : null}
    <div className={props.classes.buttonContainer}>
      <Button onClick={props.onCancel}>{props.t('forms.cancelPayment')}</Button>
      <Button
        onClick={() =>
          props.submitPayment({
            payment_method: PAYMENT_METHOD_CREDIT_ACCOUNT.id,
          })
        }
        color="primary"
        variant="contained"
        disabled={
          (!props.termsAccepted && props.termsAndConditions) || props.loading
        }
      >
        {props.t('forms.credit.pay')}
      </Button>
    </div>
  </div>
);

const styles = (theme) => ({
  explainText: {
    marginTop: theme.spacing.unit * 2,
    border: '2px solid #efefef',
    borderRadius: theme.spacing.unit,
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  buttonContainer: {
    paddingTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default compose(
  withNamespaces(['payment']),
  withStyles(styles),
  withState('termsAccepted', 'setTermsAccepted', false),
)(PaymentByCredit);
