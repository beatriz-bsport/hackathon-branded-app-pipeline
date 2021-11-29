// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Form, withFormik } from 'formik';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import * as Yup from 'yup';
import { Submit } from '../../../components/forms';
import PaymentPackSelectorField from '../../payment-packs/components/PaymentPackSelectorField.component';

type Props = {
  t: TFunction,
  open: boolean,
  classes: Object,
  onCancel: () => void,
  isSubmitting: boolean,
  paymentPackList: Array<PaymentPack>,
};

export const SubscriptionPaymentPackSwitcherDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>
          {props.t('subscription.switchPack.form.title')}
        </DialogTitle>
        <DialogContent>
          <PaymentPackSelectorField
            choices={props.paymentPackList}
            name="payment_pack"
            fullWidth
          />
          <Typography className={props.classes.explainText}>
            {props.t('subscription.switchPack.form.explain')}
          </Typography>
          <div className={props.classes.row}>
            <WarningIcon className={props.classes.leftIcon} color="error" />
            <Typography className={props.classes.explainText}>
              {props.t('subscription.switchPack.form.warning')}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>
            {props.t('subscription.switchPack.form.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {props.t('subscription.switchPack.form.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const styles = (theme) => ({
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
  explainText: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
});

export const PriceUpdaterSchema = Yup.object().shape({
  subscription: Yup.number().required(),
  payment_pack: Yup.number().required(),
});

export const SubscriptionPackSwitcherFormikHoc = withFormik({
  mapPropsToValues: ({ subscription }) => ({
    subscription: subscription.id,
    payment_pack: subscription.payment_pack
      ? subscription.payment_pack.id
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

export default compose(
  withTranslation(['subscription']),
  withStyles(styles),
  SubscriptionPackSwitcherFormikHoc,
)(SubscriptionPaymentPackSwitcherDialog);
