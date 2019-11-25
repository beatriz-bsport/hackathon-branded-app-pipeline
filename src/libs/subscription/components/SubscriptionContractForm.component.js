// @flow

import React from 'react';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';

import { TextField, PriceField } from '../../../components/forms';
import PaymentPackSelectorField from '../../payment-packs/components/PaymentPackSelectorField.component';

import type { SubscriptionContract } from '../types';

type Props = { t: TFunction, classes: * } & SubscriptionContract & {
    onSubmit: (SubscriptionContract) => void,
  };

export function SubscriptionContractFields(props: Props) {
  const { t, classes } = props;
  return (
    <div>
      <PaymentPackSelectorField
        choices={props.paymentPacks}
        name="payment_pack"
        fullWidth
        className={classes.fieldMain}
      />
      <TextField
        name="name"
        label={t('contract.form.name.label')}
        required
        fullWidth
        className={classes.field}
      />
      <TextField
        name="nb_interval"
        label={t('contract.form.nb_interval.label')}
        className={classes.field}
        required
        fullWidth
      />
      <PriceField
        name="recurrent_price"
        label={t('contract.form.recurrent_price.label')}
        required
        fullWidth
        className={classes.field}
      />
    </div>
  );
}
const styles = (theme) => ({
  field: { marginBottom: theme.spacing.unit * 3 },
  fieldMain: { marginBottom: theme.spacing.unit * 5 },
});

export const SubscriptionContractFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  nb_interval: Yup.number()
    .integer()
    .min(2)
    .required(),
  recurrent_price: Yup.number().min(1),
  payment_pack: Yup.number()
    .integer()
    .required(),
});

export const SubscriptionContractFormHoc = withFormik({
  mapPropsToValues: ({ initial }) =>
    initial || {
      name: '',
      recurrent_price: 0,
      nb_interval: 12,
      payment_pack: null,
    },
  validationSchema: SubscriptionContractFieldsSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(
  withNamespaces(['subscription']),
  withStyles(styles),
)(SubscriptionContractFields);
