// @flow

import React from 'react';

import moment from 'moment';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { AlertError, DateField, Submit } from '../../components/forms';

import type { ReportConfiguration } from './types';

type Props = {
  reportConfiguration: ReportConfiguration,
  isSubmitting: boolean,
  t: TFunction,
};

const ReportGenerationSchema = Yup.object().shape({
  dateStart: Yup.date().required('required'),
  dateEnd: Yup.date().required('required'),
});

export function ReportGenerationForm(props: Props) {
  const { t, isSubmitting, reportConfiguration } = props;
  return (
    <Form>
      <Typography variant="subtitle1">{reportConfiguration.name}</Typography>
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <DateField name="dateStart" fullWidth label={t('common.from')} />
          <AlertError name="dateStart" />
        </Grid>
        <Grid item xs={6}>
          <DateField name="dateEnd" fullWidth label={t('common.until')} />
          <AlertError name="dateEnd" />
        </Grid>
      </Grid>
      <Submit disabled={isSubmitting}>{t('common.generate')}</Submit>
    </Form>
  );
}

export default withNamespaces()(
  withFormik({
    mapPropsToValues: ({ initial }) =>
      initial || {
        dateStart: moment().subtract(30, 'days'),
        dateEnd: moment(),
      },
    validationSchema: ReportGenerationSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      setTimeout(() => {
        onSubmit(values);
        setSubmitting(false);
      }, 500);
    },
  })(ReportGenerationForm),
);
