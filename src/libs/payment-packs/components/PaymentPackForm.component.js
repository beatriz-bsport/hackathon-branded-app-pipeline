// @flow

import _ from 'lodash';
import React from 'react';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddIcon from '@material-ui/icons/Add';

import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack';

import { Moment } from '../../../i18n';
import { DATE_FORMAT } from '../../../datetime';

import {
  PriceField,
  TextField,
  DateField,
  MultipleCheckboxField,
  RadioGroupField,
  Actions,
  Submit,
  SwitchField,
  CheckboxField,
} from '../../../components/forms';

type Props = {
  categories: *[],
  metaActivities: *[],
  establishments: *[],
  isSubmitting: boolean,
  t: TFunction,
  values: *,
  initial: *,
  classes: { [string]: string },
  onCancel: ?() => void,
  onCancelText: ?string,
};

/*
 * VALID_BY_DURATION:
 * the pack will be active on the specified
 * number of days after the consumer bought it
 *
 * VALID_BY_DATERANGE:
 *  the pack is valid on a fixed daterange
 */
const VALID_BY_DURATION = 'VALID_BY_DURATION';
const VALID_BY_DATERANGE = 'VALID_BY_DATERANGE';

export function PaymentPackForm(props: Props) {
  const {
    t,
    categories,
    metaActivities,
    establishments,
    values,
    isSubmitting,
    initial,
    classes,
  } = props;
  const { manager_only, unlimited, start_date_method, timeType } = values;
  return (
    <div>
      <Form className={classes.content}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label={t('form.paymentPack.name.label')}
              required
              fullWidth
              helperText={t('form.paymentPack.name.helperText')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PriceField
              name="price"
              label={t('form.paymentPack.priceIncludingTax.label')}
              required
              fullWidth
              helperText={t('form.paymentPack.priceIncludingTax.helperText')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="tax"
              label={t('form.paymentPack.tax.label')}
              type="number"
              required
              fullWidth
              max={100}
              InputProps={{
                inputProps: { min: 0, max: 100, step: 0.01 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>
          {values.credits && initial && values.credits !== initial.credits && (
            <div className={classes.row}>
              <WarningIcon
                fontSize="small"
                color="error"
                className={classes.leftIcon}
              />
              <Typography variant="caption" color="error">
                {t('form.paymentPack.credits.bewareChange')}
              </Typography>
            </div>
          )}
          <Grid item xs={6}>
            <TextField
              name="credits"
              label={t('form.paymentPack.credits.label')}
              type="number"
              fullWidth
              disabled={unlimited}
              helperText={t('form.paymentPack.credits.helperText')}
            />
          </Grid>
          <Grid item xs={6}>
            <CheckboxField
              name="unlimited"
              label={t('form.paymentPack.unlimited')}
            />
          </Grid>
          <Grid item xs={12}>
            <PriceField
              name="theorical_margin_value"
              label={t('form.paymentPack.theoricalMarginValue.label')}
              type="number"
              fullWidth
              disabled={!unlimited}
              helperText={t('form.paymentPack.theoricalMarginValue.helperText')}
            />
          </Grid>
        </Grid>
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            {t('form.paymentPack.timeSettingsTitle')}
          </legend>
          <Grid container>
            <Grid item xs={12} md={6}>
              <RadioGroupField
                name="timeType"
                choices={[
                  {
                    label: t('form.paymentPack.validByDuration'),
                    value: VALID_BY_DURATION,
                  },
                  {
                    label: t('form.paymentPack.validByDaterange'),
                    value: VALID_BY_DATERANGE,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Collapse in={timeType === VALID_BY_DURATION}>
                <div className={classes.durationNbBlock}>
                  <TextField
                    name="duration_days"
                    label={t('form.paymentPack.durationDays.label')}
                    helperText={t('form.paymentPack.durationDays.helperText')}
                    type="number"
                    fullWidth
                  />
                  <div className={classes.row}>
                    <AddIcon className={classes.leftIcon} />
                    <TextField
                      name="duration_months"
                      label={t('form.paymentPack.durationMonths.label')}
                      helperText={t(
                        'form.paymentPack.durationMonths.helperText',
                      )}
                      type="number"
                      fullWidth
                    />
                  </div>
                  <div className={classes.row}>
                    <AddIcon className={classes.leftIcon} />
                    <TextField
                      name="duration_years"
                      label={t('form.paymentPack.durationYears.label')}
                      helperText={t(
                        'form.paymentPack.durationYears.helperText',
                      )}
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
                        label: t(
                          'form.paymentPack.start_date_method.on_purchase',
                        ),
                        value: START_ON_PURCHASE,
                      },
                      {
                        label: t(
                          'form.paymentPack.start_date_method.on_booking',
                        ),
                        value: START_ON_FIRST_BOOKING,
                      },
                      {
                        label: t(
                          'form.paymentPack.start_date_method.on_attendance',
                        ),
                        value: START_ON_FIRST_ATTENDANCE,
                      },
                    ]}
                  />
                </div>
                <Collapse in={start_date_method !== `${START_ON_PURCHASE}`}>
                  <TextField
                    name="expiration_days_before_first_use"
                    label={t(
                      'form.paymentPack.expirationDaysBeforeFirstUse.label',
                    )}
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
            </Grid>
          </Grid>
        </fieldset>
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            {t('form.paymentPack.restrictionsTitle')}
          </legend>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                label={t('form.paymentPack.maxBookingPerWeek.label')}
                type="number"
                fullWidth
                name="max_bookings_per_week"
                helperText={t('form.paymentPack.maxBookingPerWeek.helperText')}
              />
            </Grid>
            <Grid item xs={12}>
              <SwitchField
                name="new_member_only"
                disabled={manager_only}
                label={t('form.paymentPack.newMemberOnly')}
              />
            </Grid>
            <Grid item xs={12}>
              <SwitchField
                name="manager_only"
                label={t('form.paymentPack.managerOnly')}
              />
            </Grid>
            <Grid item xs={12}>
              <SwitchField
                name="onsite_payment_available"
                label={t('form.paymentPack.onsitePaymentAvailable')}
                disabled={manager_only}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MultipleCheckboxField
                name="categories"
                label={t('form.paymentPack.sports')}
                helperText={t('form.paymentPack.noneMeansAll')}
                choices={categories.map((category) => ({
                  id: category.id,
                  optionLabel: category.name,
                }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MultipleCheckboxField
                name="metaActivities"
                label={t('form.paymentPack.activities')}
                helperText={t('form.paymentPack.noneMeansAll')}
                choices={metaActivities.map((metaActivity) => ({
                  id: metaActivity.id,
                  optionLabel: metaActivity.name,
                }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MultipleCheckboxField
                name="establishments"
                label={t('form.paymentPack.establishments')}
                helperText={t('form.paymentPack.noneMeansAll')}
                choices={establishments.map((establishment) => ({
                  id: establishment.id,
                  optionLabel: establishment.title,
                }))}
              />
            </Grid>
          </Grid>
        </fieldset>
        <Actions>
          {props.onCancel ? (
            <Button onClick={props.onCancel}>
              {props.onCancelText || t('form.paymentPack.actions.skip')}
            </Button>
          ) : null}
          <Submit disabled={isSubmitting}>
            {initial && initial.id
              ? t('form.paymentPack.actions.edit')
              : t('form.paymentPack.actions.create')}
          </Submit>
        </Actions>
      </Form>
      <LinearProgress
        style={{ visibility: isSubmitting ? 'visible' : 'hidden' }}
      />
    </div>
  );
}

const PackSchema = Yup.object().shape({
  name: Yup.string().required(),
  price: Yup.number().min(0),
  tax: Yup.number().min(0),
  credits: Yup.number()
    .min(0)
    .nullable(),
  timeType: Yup.string().required(),
  expiration_days_before_first_use: Yup.number(),
  unlimited: Yup.boolean(),
  theorical_margin_value: Yup.number(),
  start_date_method: Yup.number().required(),
  duration_days: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number()
      .min(0)
      .required(),
    otherwise: Yup.number()
      .min(0)
      .nullable(),
  }),
  duration_months: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number()
      .min(0)
      .required(),
    otherwise: Yup.number()
      .min(0)
      .nullable(),
  }),
  duration_years: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number()
      .min(0)
      .required(),
    otherwise: Yup.number()
      .min(0)
      .nullable(),
  }),
  max_bookings_per_week: Yup.number()
    .min(0)
    .nullable(),
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
  new_member_only: Yup.boolean(),
  manager_only: Yup.boolean(),
  onsite_payment_available: Yup.boolean(),
  categories: Yup.array().of(Yup.number()),
  establishments: Yup.array().of(Yup.number()),
  metaActivities: Yup.array().of(Yup.number()),
});

const styles = (theme) => ({
  content: { padding: theme.spacing.unit * 2, paddingBottom: 0 },
  legend: { margin: 0 },
  fieldset: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  durationNbBlock: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
    border: '1px solid #E2E2E2',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['paymentPack']),
  withFormik({
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
          max_bookings_per_week: null,
          lower_date: Moment(),
          upper_date: Moment().add('months', 1),
          new_member_only: false,
          manager_only: false,
          onsite_payment_available: false,
          start_date_method: `${START_ON_FIRST_BOOKING}`,
          expiration_days_before_first_use: 365,
          unlimited: false,
          theorical_margin_value: 0,
          categories: [],
          metaActivities: [],
          establishments: [],
        },
        (initial && {
          ...initial,
          start_date_method: `${initial.start_date_method}`,
          categories: (initial.categories || []).map((c) => c.id),
          establishments: initial.establishments || [],
          timeType: initial.validity_daterange
            ? VALID_BY_DATERANGE
            : VALID_BY_DURATION,
          lower_date: initial.validity_daterange
            ? Moment(JSON.parse(initial.validity_daterange).lower)
            : Moment(),
          upper_date: initial.validity_daterange
            ? Moment(JSON.parse(initial.validity_daterange).upper)
            : Moment().add('days', 365),
        }) ||
          {},
      ),
    validationSchema: PackSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      const keys = [
        'name',
        'price',
        'tax',
        'theorical_margin_value',
        'unlimited',
        'credits',
        'max_bookings_per_week',
        'id',
        'new_member_only',
        'manager_only',
        'onsite_payment_available',
        'expiration_days_before_first_use',
        'start_date_method',
        'categories',
        'metaActivities',
        'establishments',
      ];
      const data = _.pick(values, keys);

      if (values.timeType === VALID_BY_DATERANGE) {
        data.duration_days = null;
        data.duration_months = null;
        data.duration_years = null;
        data.validity_daterange = {
          lower: Moment(values.lower_date).format(DATE_FORMAT),
          upper: Moment(values.upper_date).format(DATE_FORMAT),
        };
      } else {
        data.duration_days = values.duration_days;
        data.duration_months = values.duration_months;
        data.duration_years = values.duration_years;
        data.validity_daterange = null;
      }
      onSubmit(data, {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      });
    },
  }),
)(PaymentPackForm);
