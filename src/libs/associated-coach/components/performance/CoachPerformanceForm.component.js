// @flow

import React from 'react';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';

import Moment from 'moment-timezone';
import { Submit, DateField } from '../../../../components/forms';

type Props = {
  t: TFunction,
  classes: Object,
  isSubmitting: boolean,
  disabled: ?boolean,
  loading: boolean,
};

export function CoachPerformanceForm(props: Props) {
  const { t, classes, isSubmitting } = props;
  return (
    <Form className={classes.alignCenter}>
      <DateField
        id="textfield_remuneration_beginning"
        views={['year', 'month']}
        required
        name="dateStart"
        label={t('common.pick_a_month')}
        className={classes.dateInput}
      />
      <Submit
        id="button_remuneration_calculate"
        variant="outlined"
        color="secondary"
        disabled={isSubmitting || !!props.disabled || props.loading}
      >
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
    marginRight: theme.spacing(2),
  },
});

const CoachPerformanceSchema = Yup.object().shape({
  dateStart: Yup.date(),
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentRules', 'coachPerformance', 'translation']),
  withFormik({
    mapPropsToValues: () => ({
      dateStart: Moment().startOf('month'),
    }),
    validationSchema: CoachPerformanceSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      const timeIntervalValue = {
        ...values,
        dateEnd: Moment(values.dateStart).endOf('month'),
      };
      onSubmit(timeIntervalValue, {
        onError: () => setSubmitting(false),
        onSuccess: () => setSubmitting(false),
      });
    },
  }),
)(CoachPerformanceForm);
