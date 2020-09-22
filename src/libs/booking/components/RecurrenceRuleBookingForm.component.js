// @flow

import React from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import * as Yup from 'yup';
import { withFormik } from 'formik';

import MetaActivitySelectorField from '../../meta-activity/components/MetaActivitySelectorField.component';

import { IntegerField, SelectField } from '../../../components/forms';

type Props = {
  values: any,
  offerSet: boolean,
  metaActivityList: Array,
};

export function RecurrenceRuleBookingForm(props: Props) {
  const { t } = useTranslation(['booking', 'datetime']);
  const classes = useStyles();
  return (
    <div>
      <div className={classes.field}>
        <fieldset>
          <legend>{t('booking:recurrenceRule.form.timeGroup')}</legend>
          <div className={classes.row}>
            <SelectField
              choices={[0, 1, 2, 3, 4, 5, 6]}
              style={{ minWidth: 140, marginBottom: 9 }}
              itemRenderer={(c) => (
                <MenuItem key={c} value={c}>
                  {t(`datetime:time.weekdayNumber.${c}`)}
                </MenuItem>
              )}
              name="day_of_week"
              label={t('booking:recurrenceRule.form.dayOfWeek.label')}
              disabled={props.offerSet}
            />
            <Typography style={{ paddingLeft: 10, paddingRight: 14 }}>
              {t('booking:recurrenceRule.form.at')}
            </Typography>
            <IntegerField
              id="hour"
              name="hour"
              label={t('booking:recurrenceRule.form.hour.label')}
              required
              disabled={props.offerSet}
            />
            <IntegerField
              id="minute"
              name="minute"
              label={t('booking:recurrenceRule.form.minute.label')}
              required
              disabled={props.offerSet}
            />
          </div>
        </fieldset>
      </div>
      <div className={classes.field}>
        <MetaActivitySelectorField
          id="meta_activity"
          name="meta_activity"
          label={t('booking:recurrenceRule.form.metaActivity.label')}
          disabled={props.offerSet}
          noMulti
          required
          fullWidth
          metaActivityList={props.metaActivityList}
        />
      </div>
      <div className={classes.field}>
        <IntegerField
          id="delay_week"
          name="delay_week"
          label={t('booking:recurrenceRule.form.delayWeek.label')}
          helperText={t('booking:recurrenceRule.form.delayWeek.helperText')}
          required
        />
      </div>
      <div className={classes.field}>
        <Typography variant="body2">
          {t('booking:recurrenceRule.explain', {
            dayOfWeek: t(
              `datetime:time.weekdayNumber.${props.values.day_of_week}`,
            ),
            hour: `${props.values.hour}`.padStart(2, '0'),
            minute: `${props.values.minute}`.padStart(2, '0'),
            delayWeek: props.values.delay_week,
          })}
        </Typography>
      </div>
    </div>
  );
}
const useStyles = makeStyles((theme) => ({
  rulesContainer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  calculation_method: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  root: {
    height: theme.spacing(4),
  },
  dense: {
    paddingLeft: 0,
  },
  field: {
    marginBottom: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

const RecurrenceRuleBookingSchema = Yup.object().shape({
  day_of_week: Yup.number()
    .min(0)
    .max(6)
    .required(),
  minute: Yup.number()
    .min(0)
    .max(59)
    .required(),
  hour: Yup.number()
    .min(0)
    .max(23)
    .required(),
  delay_week: Yup.number()
    .min(1)
    .max(8)
    .required(),
  meta_activity: Yup.number().required(),
});

export const RecurrenceRuleBookingFormikHOC = withFormik({
  // eslint-disable-next-line
  mapPropsToValues: ({ initial }) =>
    initial
      ? {
          ...initial,
          meta_activity: initial.meta_activity.id,
          delay_week: 4,
        }
      : {
          delay_week: 4,
          hour: 11,
          minute: 0,
          day_of_week: 0,
        },
  validationSchema: RecurrenceRuleBookingSchema,
  handleSubmit: (values, { props: { onSubmit, refresh }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => {
        setSubmitting(false);
        refresh();
      },
      onError: () => setSubmitting(false),
    });
  },
});

export default RecurrenceRuleBookingForm;
