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
import { Submit } from '#components/forms';
import PrivatePassSelectorField from '#libs/private-service/components/pass/PrivatePassSelectorField.component';
import type { PrivatePass } from '#libs/private-service/types';
import { Subscription } from '../types';
import { PaymentPack } from '#libs/payment-packs/types';
import { PaymentCombo } from '#libs/payment-combo/types';

type Props = {
  open: boolean;
  onCancel: () => void;
  isSubmitting: boolean;
  privatePassList: Array<PrivatePass>;
} & FormikProps<Subscription>;

export const SubscriptionPrivatePassSwitcherDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('subscription');
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>
          {t('subscription.switchPrivatePass.form.title')}
        </DialogTitle>
        <DialogContent>
          <PrivatePassSelectorField
            choices={props.privatePassList}
            name="private_pass"
            fullWidth
          />
          <Typography className={classes.explainText}>
            {t('subscription.switchPrivatePass.form.explain')}
          </Typography>
          <div className={classes.row}>
            <WarningIcon className={classes.leftIcon} color="error" />
            <Typography className={classes.explainText}>
              {t('subscription.switchPrivatePass.form.warning')}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>
            {t('subscription.switchPrivatePass.form.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {t('subscription.switchPrivatePass.form.submit')}
          </Submit>
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
  explainText: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));
export const PriceUpdaterSchema = Yup.object().shape({
  subscription: Yup.number().required(),
  private_pass: Yup.number().required(),
});

export const SubscriptionPrivatePassSwitcherFormikHoc = withFormik<
  Props & {
    onSubmit: (
      values: { id: number; private_pass: number },
      options: OptionCallback,
    ) => void;
    subscription: Subscription<PaymentPack, PrivatePass, PaymentCombo>;
  },
  any
>({
  mapPropsToValues: ({ subscription }) => ({
    subscription: subscription.id,
    private_pass: subscription.private_pass
      ? subscription.private_pass.id
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

export default compose<any, Props>(SubscriptionPrivatePassSwitcherFormikHoc)(
  SubscriptionPrivatePassSwitcherDialog,
);
