// @flow

import React from 'react';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';

import { TextField, PriceField, SwitchField } from '../../../components/forms';
import PaymentPackSelectorField from '../../payment-packs/components/PaymentPackSelectorField.component';

import type { SubscriptionContract } from '../types';

type Props = { t: TFunction, classes: * } & SubscriptionContract & {
    onSubmit: (SubscriptionContract) => void,
  };

export function SubscriptionContractFields(props: Props) {
  const { t, classes } = props;
  return (
    <div>
      <TextField
        name="name"
        label={t('contract.form.name.label')}
        required
        fullWidth
        className={classes.field}
      />
      <PaymentPackSelectorField
        choices={props.paymentPacks}
        name="payment_pack"
        fullWidth
        className={classes.fieldMain}
      />
      <TextField
        name="nb_interval"
        label={t('contract.form.nb_interval.label')}
        helperText={t('contract.form.nb_interval.helperText')}
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
      <PriceField
        name="flat_fee"
        label={t('contract.form.flat_fee.label')}
        helperText={t('contract.form.flat_fee.helperText')}
        required
        fullWidth
        className={classes.field}
      />
      <TextField
        name="description"
        label={t('contract.form.description.label')}
        placeholder={t('contract.form.description.placeholder')}
        className={classes.field}
        required
        fullWidth
        multiline
        variant="outlined"
        rows={5}
      />
      <TextField
        name="contract"
        label={t('contract.form.contract.label')}
        placeholder={t('contract.form.contract.placeholder')}
        className={classes.field}
        required
        fullWidth
        multiline
        rows={5}
        variant="outlined"
      />
      <SwitchField
        name="manager_only"
        label={t('contract.form.managerOnly.label')}
      />
      <SwitchField
        name="auto_renewal"
        label={t('contract.form.autoRenewal.label')}
      />
    </div>
  );
}
const styles = (theme) => ({
  field: { marginBottom: theme.spacing(3) },
  fieldMain: { marginBottom: theme.spacing(5) },
});

export const SubscriptionContractFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  nb_interval: Yup.number()
    .integer()
    .min(2)
    .required(),
  recurrent_price: Yup.number().min(1),
  flat_fee: Yup.number(),
  payment_pack: Yup.number()
    .integer()
    .required(),
  description: Yup.string().required(),
  contract: Yup.string().required(),
  manager_only: Yup.boolean(),
  auto_renewal: Yup.boolean(),
});

export const SubscriptionContractFormHoc = withFormik({
  // eslint-disable-next-line
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return { ...initial, payment_pack: initial.payment_pack.id };
    }
    return {
      name: '',
      recurrent_price: 0,
      flat_fee: 0,
      nb_interval: 12,
      payment_pack: null,
      description: '',
      contract: '',
      manager_only: false,
      auto_renewal: false,
    };
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
