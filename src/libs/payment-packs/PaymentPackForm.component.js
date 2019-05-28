// @flow

import _ from 'lodash';
import React from 'react';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import {
  InputAdornment,
  Collapse,
  Grid,
  LinearProgress,
  Paper,
} from '@material-ui/core';

import { Moment } from '../../i18n';

import {
  PriceField,
  TextField,
  DateField,
  MultipleCheckboxField,
  RadioGroupField,
  Actions,
  Submit,
  SwitchField,
} from '../../components/forms';

type Props = {
  categories: *[],
  metaActivities: *[],
  establishments: *[],
  isSubmitting: boolean,
  t: TFunction,
  values: *,
  initial: *,
  classes: { [string]: string },
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
  const { manager_only, timeType } = values;
  return (
    <Paper>
      <Form className={classes.content}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label={t('common.name')}
              required
              fullWidth
              helperText={t('form.paymentPack.helper.name')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PriceField
              name="price"
              label={t('common.priceIncludingTax')}
              required
              fullWidth
              helperText={t('form.paymentPack.helper.price')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="tax"
              label={t('common.tax')}
              required
              fullWidth
              max={100}
              InputProps={{
                inputProps: { min: 0, max: 100 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="credits"
              label={t('common.credits')}
              type="number"
              fullWidth
              helperText={t('form.paymentPack.helper.credits')}
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
                <TextField
                  name="duration_days"
                  label={t('form.paymentPack.durationDays')}
                  helperText={t('form.paymentPack.durationDaysHelperText')}
                  type="number"
                  fullWidth
                />
                <TextField
                  name="duration_months"
                  label={t('form.paymentPack.durationMonths')}
                  helperText={t('form.paymentPack.durationMonthsHelperText')}
                  type="number"
                  fullWidth
                />
                <TextField
                  name="duration_years"
                  label={t('form.paymentPack.durationYears')}
                  helperText={t('form.paymentPack.durationYearsHelperText')}
                  type="number"
                  fullWidth
                />
              </Collapse>
              <Collapse in={timeType === VALID_BY_DATERANGE}>
                <DateField
                  label={t('common.from')}
                  fullWidth
                  name="lower_date"
                />
                <DateField
                  label={t('common.until')}
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
                label={t('form.paymentPack.maxBookingPerWeek')}
                type="number"
                fullWidth
                name="max_bookings_per_week"
                helperText={t('form.paymentPack.helper.maxBookingPerWeek')}
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
            <Grid item xs={12} md={4}>
              <MultipleCheckboxField
                name="categories"
                label={t('common.sports')}
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
                label={t('common.activities')}
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
                label={t('common.establishments')}
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
          <Submit disabled={isSubmitting}>
            {initial ? t('common.edit') : t('common.create')}
          </Submit>
        </Actions>
      </Form>
      <LinearProgress
        style={{ visibility: isSubmitting ? 'visible' : 'hidden' }}
      />
    </Paper>
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
  categories: Yup.array().of(Yup.number()),
  establishments: Yup.array().of(Yup.number()),
  metaActivities: Yup.array().of(Yup.number()),
});

const styles = (theme) => ({
  content: { padding: theme.spacing.unit * 2, paddingBottom: 0 },
  legend: { margin: 0 },
  fieldset: { marginBottom: theme.spacing.unit * 2 },
});

export default compose(
  withStyles(styles),
  withNamespaces([]),
  withFormik({
    mapPropsToValues: ({ initial }) =>
      Object.assign(
        {
          name: '',
          price: 0,
          tax: 0,
          credits: '',
          timeType: `${VALID_BY_DURATION}`,
          duration_days: 0,
          duration_months: 1,
          duration_years: 0,
          max_bookings_per_week: null,
          lower_date: Moment(),
          upper_date: Moment().add('months', 1),
          new_member_only: false,
          manager_only: false,
          categories: [],
          metaActivities: [],
          establishments: [],
        },
        (initial && {
          ...initial,
          categories: initial.categories.map((c) => c.id),
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
        'credits',
        'max_bookings_per_week',
        'id',
        'new_member_only',
        'manager_only',
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
          lower: Moment(values.lower_date).format('YYYY-MM-DD'),
          upper: Moment(values.upper_date).format('YYYY-MM-DD'),
        };
      } else {
        data.duration_days = values.duration_days;
        data.duration_months = values.duration_months;
        data.duration_years = values.duration_years;
        data.validity_daterange = null;
      }
      console.log(data);
      onSubmit(data, {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      });
    },
  }),
)(PaymentPackForm);
