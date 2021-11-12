import React from 'react';
import pick from 'lodash/pick';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { withFormik } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment-timezone';

import * as Yup from 'yup';
import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack';

import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/Add';

import Collapse from '@material-ui/core/Collapse';
import { DATE_FORMAT } from '../../../utils/datetime';

import {
  PriceField,
  TextField,
  SwitchField,
  CheckboxField,
  RadioGroupField,
  AlertError,
  DateField,
} from '../../../components/forms';

const VALID_BY_DURATION = 'VALID_BY_DURATION';
const VALID_BY_DATERANGE = 'VALID_BY_DATERANGE';

type Props = {};

const PaymentPackTemplateForm = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();

  const { unlimited, start_date_method, timeType } = props.values;

  return (
    <>
      <TextField
        name="name"
        label={t('form.paymentPack.name.label')}
        required
        fullWidth
        helperText={t('form.paymentPack.name.helperText')}
      />
      <SwitchField
        name="manager_only"
        label={t('form.paymentPack.managerOnly')}
      />
      <PriceField
        name="price"
        label={t('form.paymentPack.priceIncludingTax.label')}
        required
        fullWidth
        helperText={t('form.paymentPack.priceIncludingTax.helperText')}
      />
      <TextField
        name="tax"
        label={t('form.paymentPack.tax.label')}
        type="number"
        required
        fullWidth
        max={100}
        InputProps={{
          inputProps: { min: 0, max: 100, step: 0.005 },
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
      />
      <TextField
        name="credits"
        label={t('form.paymentPack.credits.label')}
        type="number"
        fullWidth
        disabled={unlimited}
        helperText={t('form.paymentPack.credits.helperText')}
      />
      <CheckboxField name="unlimited" label={t('form.paymentPack.unlimited')} />
      <PriceField
        name="theorical_margin_value"
        label={t('form.paymentPack.theoricalMarginValue.label')}
        type="number"
        fullWidth
        disabled={!unlimited}
        helperText={t('form.paymentPack.theoricalMarginValue.helperText')}
      />
      <Collapse in={timeType === VALID_BY_DURATION}>
        <div className={classes.durationNbBlock}>
          <div className={classes.row}>
            <Icon className={classes.leftIcon} />
            <TextField
              name="duration_days"
              label={t('form.paymentPack.durationDays.label')}
              helperText={t('form.paymentPack.durationDays.helperText')}
              type="number"
              fullWidth
            />
          </div>
          <div className={classes.row}>
            <AddIcon className={classes.leftIcon} />
            <TextField
              name="duration_months"
              label={t('form.paymentPack.durationMonths.label')}
              helperText={t('form.paymentPack.durationMonths.helperText')}
              type="number"
              fullWidth
            />
          </div>
          <div className={classes.row}>
            <AddIcon className={classes.leftIcon} />
            <TextField
              name="duration_years"
              label={t('form.paymentPack.durationYears.label')}
              helperText={t('form.paymentPack.durationYears.helperText')}
              type="number"
              fullWidth
            />
          </div>
        </div>
        <div style={{ paddingBottom: 24 }}>
          <RadioGroupField
            name="start_date_method"
            choices={[
              {
                label: t('form.paymentPack.start_date_method.on_purchase'),
                value: START_ON_PURCHASE,
              },
              {
                label: t('form.paymentPack.start_date_method.on_booking'),
                value: START_ON_FIRST_BOOKING,
              },
              {
                label: t('form.paymentPack.start_date_method.on_attendance'),
                value: START_ON_FIRST_ATTENDANCE,
              },
            ]}
          />
          <AlertError name="start_date_method" />
        </div>
        <Collapse in={start_date_method !== `${START_ON_PURCHASE}`}>
          <TextField
            name="expiration_days_before_first_use"
            label={t('form.paymentPack.expirationDaysBeforeFirstUse.label')}
            helperText={t(
              'form.paymentPack.expirationDaysBeforeFirstUse.helperText',
            )}
            type="number"
            fullWidth
          />
        </Collapse>
      </Collapse>
      <Collapse in={timeType === VALID_BY_DATERANGE}>
        <DateField
          label={t('form.paymentPack.from')}
          fullWidth
          name="lower_date"
        />
        <DateField
          label={t('form.paymentPack.until')}
          fullWidth
          name="upper_date"
        />
      </Collapse>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  durationNbBlock: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    marginBottom: theme.spacing(3),
    border: '1px solid #E2E2E2',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
}));

const PaymentPackTemplateSchema = Yup.object().shape({
  name: Yup.string().required(),
  price: Yup.number().min(0),
  tax: Yup.number().min(0),
  credits: Yup.number().min(0).nullable(),
  timeType: Yup.string().required(),
  expiration_days_before_first_use: Yup.number(),
  unlimited: Yup.boolean(),
  theorical_margin_value: Yup.number(),
  start_date_method: Yup.number()
    .required('paymentPack:form.paymentPack.error.start_date_method_type')
    .typeError('paymentPack:form.paymentPack.error.start_date_method_type'),
  duration_days: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  duration_months: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  duration_years: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  lower_date: Yup.date().when('timeType', {
    is: VALID_BY_DATERANGE,
    then: Yup.date().required(),
    otherwise: Yup.date().nullable(),
  }),
  upper_date: Yup.date().when('timeType', {
    is: VALID_BY_DATERANGE,
    then: Yup.date().required(),
    otherwise: Yup.date().nullable(),
  }),
  manager_only: Yup.boolean(),
});

export const PaymentPackTemplateFormikHOC = withFormik({
  mapPropsToValues: ({ initial }) =>
    Object.assign(
      {
        name: '',
        price: 0,
        tax: 0,
        credits: 1,
        timeType: `${VALID_BY_DURATION}`,
        duration_days: 0,
        duration_months: 1,
        duration_years: 0,
        lower_date: moment(),
        upper_date: moment().add('months', 1),
        manager_only: false,
        start_date_method: `${START_ON_PURCHASE}`,
        expiration_days_before_first_use: 365,
        unlimited: false,
        theorical_margin_value: 0,
      },
      (initial && {
        ...initial,
        start_date_method: `${initial.start_date_method}`,
        categories: initial.categories || [],
        establishments: initial.establishments || [],
        timeType: initial.validity_daterange
          ? VALID_BY_DATERANGE
          : VALID_BY_DURATION,
        lower_date: initial.validity_daterange
          ? moment(JSON.parse(initial.validity_daterange).lower)
          : moment(),
        upper_date: initial.validity_daterange
          ? moment(JSON.parse(initial.validity_daterange).upper)
          : moment().add('days', 365),
      }) ||
        {},
    ),
  validationSchema: PaymentPackTemplateSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const keys = [
      'name',
      'price',
      'tax',
      'theorical_margin_value',
      'unlimited',
      'credits',
      'max_bookings_per_day',
      'max_bookings_per_week',
      'max_bookings_per_month',
      'max_purchase_per_member',
      'id',
      'manager_only',
      'expiration_days_before_first_use',
      'start_date_method',
    ];
    const data = pick(values, keys);

    if (values.timeType === VALID_BY_DATERANGE) {
      data.duration_days = null;
      data.duration_months = null;
      data.duration_years = null;
      data.validity_daterange = {
        lower: moment(values.lower_date).format(DATE_FORMAT),
        upper: moment(values.upper_date).format(DATE_FORMAT),
      };
    } else {
      data.duration_days = values.duration_days;
      data.duration_months = values.duration_months;
      data.duration_years = values.duration_years;
      data.validity_daterange = null;
    }
    if (!values.unlimited) {
      data.penalty_active = false;
    }
    if (!values.full_vod_access) {
      data.only_vod_access = false;
    }
    onSubmit(data, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default PaymentPackTemplateForm;
