// @flow

import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import * as Yup from 'yup';
import { withFormik } from 'formik';

import MetaActivitySelectorField from '../../meta-activity/components/MetaActivitySelectorField.component';
import EstablishmentSelectorField from '../../establishment/components/EstablishmentSelectorField.component';

import { IntegerField, SelectField } from '../../../components/forms';

type Props = {
  values: any,
  offerSet: boolean,
  memberSet: boolean,
  metaActivityList: Array,
  setFieldValue: () => void,
  initial: Object,
  establishmentList: Array<Establishment>,
};

export function RecurrenceRuleBookingForm(props: Props) {
  const { t } = useTranslation(['booking', 'datetime']);
  const classes = useStyles();
  const [checked, setChecked] = useState(
    props.initial ? props.initial.notify_if_booked : false,
  );

  const handleChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    props.setFieldValue('notify_if_booked', event.target.checked);
  };

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
        <EstablishmentSelectorField
          id="establishment"
          name="establishment"
          label={t('booking:recurrenceRule.form.establishment.label')}
          noMulti
          fullWidth
          establishmentList={props.establishmentList}
        />
      </div>
      <div className={classes.field}>
        <MetaActivitySelectorField
          id="meta_activity"
          name="meta_activity"
          label={t('booking:recurrenceRule.form.metaActivity.label')}
          disabled={props.offerSet || props.memberSet}
          noMulti
          required
          fullWidth
          metaActivityList={props.metaActivityList}
          helperText={(days) =>
            t('booking:recurrenceRule.blockedBookings', { days })
          }
          showHelperText={(days) => days > props.values.delay_week * 7}
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
      <div className={classes.field}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                id="notify_if_booked"
                name="notify_if_booked"
                checked={checked}
                onChange={handleChangeChecked}
              />
            }
            label={t('booking:recurrenceRule.notify')}
          />
        </FormGroup>
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
  day_of_week: Yup.number().min(0).max(6).required(),
  minute: Yup.number().min(0).max(59).required(),
  hour: Yup.number().min(0).max(23).required(),
  delay_week: Yup.number().min(1).max(8).required(),
  meta_activity: Yup.number().required(),
  establishment: Yup.number().nullable(),
  notify_if_booked: Yup.boolean(),
});

export const RecurrenceRuleBookingFormikHOC = withFormik({
  // eslint-disable-next-line
  mapPropsToValues: ({ initial }) =>
    initial
      ? {
          ...initial,
          meta_activity: initial.meta_activity
            ? initial.meta_activity.id
            : null,
          establishment: initial.establishment
            ? initial.establishment.id
            : null,
          delay_week: initial.delay_week ? initial.delay_week : 4,
        }
      : {
          delay_week: 4,
          hour: 11,
          minute: 0,
          day_of_week: 0,
          establishment: null,
          meta_activity: null,
          notify_if_booked: false,
        },
  validationSchema: RecurrenceRuleBookingSchema,
  handleSubmit: (values, { props: { onSubmit, refresh }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => {
        setSubmitting(false);
        refresh();
      },
      onError: () => {
        setSubmitting(false);
        refresh();
      },
    });
  },
});

export default RecurrenceRuleBookingForm;
