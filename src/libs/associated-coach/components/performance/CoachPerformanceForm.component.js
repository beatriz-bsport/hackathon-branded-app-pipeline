// @flow

import React from 'react';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Moment from 'moment';
import { Submit, DateField } from '../../../../components/forms';

type Props = {
  t: TFunction,
  classes: Object,
  isSubmitting: boolean,
  disabled: ?boolean,
};

export function CoachPerformanceForm(props: Props) {
  const { t, classes, isSubmitting } = props;
  return (
    <Form className={classes.alignCenter}>
      <DateField
        id="textfield_remuneration_beginning"
        required
        name="dateStart"
        label={t('common.from')}
        className={classes.dateInput}
      />
      <DateField
        id="textfield_remuneration_end"
        required
        name="dateEnd"
        label={t('common.until')}
        className={classes.dateInput}
      />
      <Submit
        id="button_remuneration_calculate"
        variant="outlined"
        color="secondary"
        disabled={isSubmitting || !!props.disabled}
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
  dateEnd: Yup.date(),
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentRules', 'coachPerformance', 'translation']),
  withFormik({
    mapPropsToValues: () => ({
      dateStart: Moment().subtract(1, 'month').startOf('day'),
      dateEnd: Moment().startOf('day'),
    }),
    validationSchema: CoachPerformanceSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      values.dateEnd.add(1, 'day');
      onSubmit(values, {
        onError: () => setSubmitting(false),
        onSuccess: () => setSubmitting(false),
      });
    },
  }),
)(CoachPerformanceForm);
