// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import { CB } from '@bsport/common/lib/master-data/payment-methods';

import * as Yup from 'yup';
import { Form, withFormik } from 'formik';
import PaymentMethodSelectorField from '../../../payment/components/PaymentMethodSelectorField.component';

import {
  IntegerField,
  TextField,
  PercentField,
  MultipleCheckboxField,
  SwitchField,
  PriceField,
  Submit,
} from '../../../../components/forms';

type Props = {
  initial: PrivatePass,
  t: TFunction,
  onSubmit: (data: {
    name: string,
    tax: string,
    credits: number,
    price: string,
    manager_only: boolean,
  }) => void,
  classes: Object,
  onCancel: () => void,
};

type State = {
  name: ?string,
  tax: ?string,
  credits: number,
  price: ?string,
  manager_only: boolean,
};

export const PrivatePassForm = (props: Props) => {
  const { t, classes, isSubmitting } = props;
  return (
    <Form className={classes.container}>
      <div className={classes.field}>
        <TextField
          name="name"
          fullWidth
          label={t('privatePass.form.name.label')}
        />
      </div>
      <div className={classes.field}>
        <IntegerField
          name="credits"
          fullWidth
          label={t('privatePass.form.credits.label')}
          helperText={t('privatePass.form.credits.helperText')}
        />
      </div>
      <div className={classes.field}>
        <PriceField
          name="price"
          fullWidth
          label={t('privatePass.form.price.label')}
        />
      </div>
      <div className={classes.field}>
        <PercentField
          name="tax"
          fullWidth
          label={t('privatePass.form.tax.label')}
          type="number"
          required
          max={100}
          InputProps={{
            inputProps: { min: 0, max: 100, step: 0.01 },
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
        <div className={classes.field}>
          <SwitchField
            name="manager_only"
            label={t('privatePass.form.managerOnly.label')}
          />
        </div>
        <div className={classes.durationNbBlock}>
          <div className={classes.field}>
            <PaymentMethodSelectorField
              name="available_payment_method_identifiers"
              disabled={props.values.manager_only}
              label={t(
                'privatePass.form.available_payment_method_identifiers.label',
              )}
              helperText={t(
                'privatePass.form.available_payment_method_identifiers.helperText',
              )}
            />
          </div>
        </div>
      </div>
      <div className={classes.durationNbBlock}>
        <div className={classes.row}>
          <Icon className={classes.leftIcon} />
          <IntegerField
            name="duration_days"
            label={t('privatePass.form.durationDays.label')}
            helperText={t('privatePass.form.durationDays.helperText')}
            InputProps={{ min: 0, max: 30, step: 1 }}
            fullWidth
          />
        </div>
        <div className={classes.row}>
          <AddIcon className={classes.leftIcon} />
          <IntegerField
            name="duration_months"
            label={t('privatePass.form.durationMonths.label')}
            helperText={t('privatePass.form.durationMonths.helperText')}
            InputProps={{ min: 0, max: 24, step: 1 }}
            fullWidth
          />
        </div>
        <div className={classes.row}>
          <AddIcon className={classes.leftIcon} />
          <IntegerField
            name="duration_years"
            label={t('privatePass.form.durationYears.label')}
            helperText={t('privatePass.form.durationYears.helperText')}
            InputProps={{ min: 0, max: 30, step: 1 }}
            fullWidth
          />
        </div>
      </div>
      <div className={classes.field} />
      <div className={classes.buttonContainer}>
        <Button onClick={props.onCancel}>
          {t('privatePass.form.actions.cancel')}
        </Button>
        <Submit disabled={isSubmitting}>
          {t('privatePass.form.actions.submit')}
        </Submit>
      </div>
    </Form>
  );
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    marginBottom: theme.spacing.unit,
  },
  buttonContainer: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
  },
  durationNbBlock: {
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
    marginBottom: theme.spacing.unit,
    border: '1px solid #E2E2E2',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
});

export const PrivatePassSchema = Yup.object().shape({
  // cover_main: Yup.object().nullable(),
  name: Yup.string().required(),
  tax: Yup.number().required(),
  price: Yup.number().required(),
  manager_only: Yup.boolean().required(),
  duration_days: Yup.number()
    .required()
    .integer()
    .min(0),
  duration_months: Yup.number()
    .required()
    .integer()
    .min(0),
  duration_years: Yup.number()
    .required()
    .integer()
    .min(0),
  available_payment_method_identifiers: Yup.array()
    .of(Yup.number().integer())
    .min(1),
});

export const PrivatePassFormikHOC = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) return initial;

    return {
      name: null,
      tax: 0,
      credits: 1,
      price: null,
      manager_only: false,
      duration_days: 0,
      duration_months: 0,
      duration_years: 1,
      available_payment_method_identifiers: [CB.id],
    };
  },
  validationSchema: PrivatePassSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  PrivatePassFormikHOC,
)(PrivatePassForm);
