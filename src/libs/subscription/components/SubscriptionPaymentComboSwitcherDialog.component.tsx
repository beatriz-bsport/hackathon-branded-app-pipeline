// @flow
import React from 'react';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Form, withFormik, FormikProps } from 'formik';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import * as Yup from 'yup';
import { OptionCallback } from '../../../state/types';
import PaymentComboSelectorField from '#libs/payment-combo/components/PaymentComboSelectorField.component';
import type { PrivatePass } from '#libs/private-service/types';
import type { Subscription } from '../types';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import RedButton from '#components/button/RedButton.component';

type Props = {
  open: boolean;
  onCancel: () => void;
  isSubmitting: boolean;
  paymentComboList: Array<PaymentCombo>;
} & FormikProps<Subscription>;

export const SubscriptionPaymentComboSwitcherDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('subscription');
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>
          {t('subscription.switchPaymentCombo.form.title')}
        </DialogTitle>
        <DialogContent>
          <PaymentComboSelectorField
            choices={props.paymentComboList}
            name="payment_combo"
            fullWidth
          />
          <div className={classes.warningRow}>
            <WarningIcon className={classes.leftIcon} color="error" />
            <Typography className={classes.explainText}>
              {t('subscription.switchPaymentCombo.form.explain')}
            </Typography>
          </div>
          <Typography className={classes.explainText}>
            {t('subscription.switchPaymentCombo.form.prewarning')}
          </Typography>
          <div className={classes.row}>
            <WarningIcon className={classes.leftIcon} color="error" />
            <Typography className={classes.explainText}>
              {t('subscription.switchPaymentCombo.form.warning')}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>
            {t('subscription.switchPaymentCombo.form.cancel')}
          </Button>
          <RedButton
            delayBeforeActivation={5}
            disabled={props.isSubmitting}
            onClick={() => props.handleSubmit()}
            variant="contained"
          >
            {t('subscription.switchPaymentCombo.form.submit')}
          </RedButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: '#EFEFEF',
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  warningRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
    border: '1px solid red',
    color: 'red',
  },
  explainText: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));
export const PriceUpdaterSchema = Yup.object().shape({
  subscription: Yup.number().required(),
  payment_combo: Yup.number().required(),
});

export const SubscriptionPaymentComboSwitcherFormikHoc = withFormik<
  Props & {
    onSubmit: (
      values: { id: number; payment_combo: number },
      options: OptionCallback,
    ) => void;
    subscription: Subscription<PaymentPack, PrivatePass, PaymentCombo>;
  },
  any
>({
  mapPropsToValues: ({ subscription }) => ({
    subscription: subscription.id,
    payment_combo: subscription.payment_combo
      ? subscription.payment_combo.id
      : null,
  }),
  validationSchema: PriceUpdaterSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose<any, Props>(SubscriptionPaymentComboSwitcherFormikHoc)(
  SubscriptionPaymentComboSwitcherDialog,
);
