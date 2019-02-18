// @flow

import React from 'react';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import { compose } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { Submit, DateField } from '../../../components/forms';

import { Moment } from '../../../i18n';

type Props = {
  t: TFunction,
  classes: Object,
  isSubmitting: boolean,
};

export function CoachPerformanceForm(props: Props) {
  const { t, classes, isSubmitting } = props;
  return (
    <Form className={classes.alignCenter}>
      <DateField
        required
        name="dateStart"
        label={t('common.from')}
        className={classes.dateInput}
      />
      <DateField
        required
        name="dateEnd"
        label={t('common.until')}
        className={classes.dateInput}
      />
      <Submit variant="outlined" color="secondary" disabled={isSubmitting}>
        {t('calculate')}
      </Submit>
    </Form>
  );
}

const styles = (theme) => ({
  alignCenter: {
    display: 'flex',
  },
  dateInput: {
    marginRight: theme.spacing.unit * 2,
  },
});

const CoachPerformanceSchema = Yup.object().shape({
  dateStart: Yup.date(),
  dateEnd: Yup.date(),
});

export default compose(
  withStyles(styles),
  withNamespaces(['paymentRules', 'coachPerformance', 'translation']),
  withFormik({
    mapPropsToValues: () => ({
      dateStart: Moment().subtract(1, 'month'),
      dateEnd: Moment(),
    }),
    validationSchema: CoachPerformanceSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      onSubmit(values, {
        onError: () => setSubmitting(false),
        onSuccess: () => setSubmitting(false),
      });
    },
  }),
)(CoachPerformanceForm);
