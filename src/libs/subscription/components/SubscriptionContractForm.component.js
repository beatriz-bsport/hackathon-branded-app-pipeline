// @flow

import React from 'react';
import { compose } from 'recompose';
import Collapse from '@material-ui/core/Collapse';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import omit from 'lodash/omit';

import * as Yup from 'yup';
import { withFormik } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';

import {
  TextField,
  PriceField,
  SwitchField,
  RadioGroupField,
} from '../../../components/forms';
import PaymentPackSelectorField from '../../payment-packs/components/PaymentPackSelectorField.component';
import PrivatePassSelectorField from '../../private-service/components/pass/PrivatePassSelectorField.component';
import PaymentComboSelectorField from '../../payment-combo/components/PaymentComboSelectorField.component';

import type { SubscriptionContract } from '../types';

type Props = { t: TFunction, classes: * } & SubscriptionContract & {
    onSubmit: (SubscriptionContract) => void,
  };

const OBJECT_TYPE_PAYMENT_PACK = 'payment_pack';
const OBJECT_TYPE_PRIVATE_PASS = 'private_pass';
const OBJECT_TYPE_PAYMENT_COMBO = 'payment_combo';

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
      <fieldset className={classes.section}>
        <legend>{t('contract.form.object_type.label')}</legend>
        <RadioGroupField
          name="object_type"
          choices={[
            {
              label: t('contract.form.object_type.privatePass'),
              value: OBJECT_TYPE_PRIVATE_PASS,
            },
            {
              label: t('contract.form.object_type.paymentPack'),
              value: OBJECT_TYPE_PAYMENT_PACK,
            },
            {
              label: t('contract.form.object_type.paymentCombo'),
              value: OBJECT_TYPE_PAYMENT_COMBO,
            },
          ]}
        />
        <Collapse in={props.values.object_type === OBJECT_TYPE_PAYMENT_PACK}>
          <PaymentPackSelectorField
            choices={props.paymentPacks}
            name="payment_pack"
            fullWidth
            className={classes.fieldMain}
          />
        </Collapse>
        <Collapse in={props.values.object_type === OBJECT_TYPE_PRIVATE_PASS}>
          <PrivatePassSelectorField
            choices={props.privatePassList}
            name="private_pass"
            fullWidth
            className={classes.fieldMain}
          />
        </Collapse>
        <Collapse in={props.values.object_type === OBJECT_TYPE_PAYMENT_COMBO}>
          <PaymentComboSelectorField
            choices={props.paymentComboList}
            name="payment_combo"
            fullWidth
            className={classes.fieldMain}
          />
        </Collapse>
      </fieldset>
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
  section: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
});

export const SubscriptionContractFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  nb_interval: Yup.number().integer().min(2).required(),
  recurrent_price: Yup.number().min(0),
  flat_fee: Yup.number(),
  payment_pack: Yup.number()
    .integer()
    .nullable()
    .test('is-nullable', 'missing', function (payment_pack) {
      const { object_type } = this.parent;
      return object_type !== OBJECT_TYPE_PAYMENT_PACK || !!payment_pack;
    }),
  private_pass: Yup.number()
    .integer()
    .nullable()
    .test('is-nullable', 'missing', function (private_pass) {
      const { object_type } = this.parent;
      return object_type !== OBJECT_TYPE_PRIVATE_PASS || !!private_pass;
    }),
  payment_combo: Yup.number()
    .integer()
    .nullable()
    .test('is-nullable', 'missing', function (payment_combo) {
      const { object_type } = this.parent;
      return object_type !== OBJECT_TYPE_PAYMENT_COMBO || !!payment_combo;
    }),
  description: Yup.string().required(),
  contract: Yup.string().required(),
  manager_only: Yup.boolean(),
  auto_renewal: Yup.boolean(),
});

export const SubscriptionContractFormHoc = withFormik({
  // eslint-disable-next-line
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        payment_pack: initial.payment_pack ? initial.payment_pack.id : null,
        private_pass: initial.private_pass
          ? initial.private_pass.id || initial.private_pass
          : null,
        private_combo: initial.payment_combo
          ? initial.payment_combo.id || initial.payment_combo
          : null,
        // eslint-disable-next-line
        object_type: initial.private_pass
          ? OBJECT_TYPE_PRIVATE_PASS
          : initial.payment_pack
          ? OBJECT_TYPE_PAYMENT_PACK
          : OBJECT_TYPE_PAYMENT_COMBO,
      };
    }
    return {
      name: '',
      recurrent_price: 0,
      flat_fee: 0,
      nb_interval: 12,
      payment_pack: null,
      private_pass: null,
      payment_combo: null,
      description: '',
      contract: '',
      manager_only: false,
      auto_renewal: false,
      object_type: OBJECT_TYPE_PAYMENT_PACK,
    };
  },
  validationSchema: SubscriptionContractFieldsSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const valuesCleaned = {
      ...omit(values, ['object_type']),
      private_pass:
        values.object_type === OBJECT_TYPE_PRIVATE_PASS
          ? values.private_pass
          : null,
      payment_combo:
        values.object_type === OBJECT_TYPE_PAYMENT_COMBO
          ? values.payment_combo
          : null,
      payment_pack:
        values.object_type === OBJECT_TYPE_PAYMENT_PACK
          ? values.payment_pack
          : null,
    };

    onSubmit(valuesCleaned, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(
  withTranslation(['subscription']),
  withStyles(styles),
)(SubscriptionContractFields);
