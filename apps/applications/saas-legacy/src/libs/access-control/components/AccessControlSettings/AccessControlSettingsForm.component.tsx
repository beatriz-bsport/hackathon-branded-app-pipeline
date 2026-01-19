import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Card,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import { FormikProps, useField, useFormikContext, withFormik } from 'formik';
import { compose } from 'recompose';
import { DateTime } from 'luxon';

import type { AccessControlPolicy } from '#src/libs/access-control/types';

type OwnProps = {
  // eslint-disable-next-line
  accessControlPolicy: AccessControlPolicy;
  isLoading: boolean;
  // eslint-disable-next-line
  onSubmit: (data: AccessControlPolicy) => void;
};

type FormikValues = {
  booked_session_time_interval_after_visit_hours: number;
  booked_session_time_interval_after_visit_minutes: number;
  booked_session_time_interval_before_visit_minutes: number;
  automatic_check_in_enabled: boolean;
};

type Props = OwnProps & FormikProps<FormikValues>;

const validationSchema = Yup.object().shape({
  booked_session_time_interval_after_visit_hours: Yup.number()
    .min(0, 'settings.errors.hours.min')
    .max(23, 'settings.errors.hours.max')
    .required('settings.errors.required'),
  booked_session_time_interval_after_visit_minutes: Yup.number()
    .min(0, 'settings.errors.minutes.min')
    .max(59, 'settings.errors.minutes.max')
    .required('settings.errors.required'),
  booked_session_time_interval_before_visit_minutes: Yup.number()
    .min(0, 'settings.errors.minutes.min')
    .max(59, 'settings.errors.minutes.max')
    .required('settings.errors.required'),
});

const NumberInput: React.FC<{
  label: string;
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: number;
}> = ({ label, name, onChange, value }) => {
  const classes = useStyles();
  const { t } = useTranslation('accessControl');
  const [field, meta] = useField(name);

  return (
    <div className={classes.numberInput}>
      <Typography color="textSecondary" variant="body2">
        {label}
      </Typography>
      <TextField
        {...field}
        InputLabelProps={{
          shrink: true,
        }}
        name={name}
        onChange={onChange}
        type="number"
        value={value}
        variant="outlined"
      />
      {meta.touched && meta.error ? (
        <Typography color="error" variant="caption">
          {t(meta.error)}
        </Typography>
      ) : null}
    </div>
  );
};

const AccessControlSettingsForm: React.FC<Props> = ({ isLoading }) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  const {
    dirty,
    handleChange,
    handleSubmit,
    isValid,
    setFieldValue,
    values: {
      booked_session_time_interval_after_visit_hours,
      booked_session_time_interval_after_visit_minutes,
      booked_session_time_interval_before_visit_minutes,
      automatic_check_in_enabled,
    },
  } = useFormikContext<FormikValues>();

  return (
    <Card variant="outlined">
      <form className={classes.root} onSubmit={handleSubmit}>
        <div>
          <Typography variant="h6">{t('settings.title')}</Typography>
          <Typography color="textSecondary" variant="subtitle2">
            {t('settings.description')}
          </Typography>
        </div>
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <div className={classes.inputSection}>
              <Typography variant="body1">
                {t('settings.afterTitle')}
              </Typography>
              <div className={classes.inputContainer}>
                <NumberInput
                  label={t('settings.hours')}
                  name="booked_session_time_interval_after_visit_hours"
                  onChange={handleChange}
                  value={booked_session_time_interval_after_visit_hours}
                />
                <NumberInput
                  label={t('settings.minutes')}
                  name="booked_session_time_interval_after_visit_minutes"
                  onChange={handleChange}
                  value={booked_session_time_interval_after_visit_minutes}
                />
              </div>
            </div>
            <div className={classes.inputSection}>
              <Typography variant="body1">
                {t('settings.beforeTitle')}
              </Typography>
              <div className={classes.inputContainer}>
                <NumberInput
                  label={t('settings.minutes')}
                  name="booked_session_time_interval_before_visit_minutes"
                  onChange={handleChange}
                  value={booked_session_time_interval_before_visit_minutes}
                />
              </div>
            </div>
            <div className={classes.inputSection}>
              <FormControlLabel
                control={
                  <Switch
                    checked={automatic_check_in_enabled}
                    onChange={() =>
                      setFieldValue(
                        'automatic_check_in_enabled',
                        !automatic_check_in_enabled,
                      )
                    }
                  />
                }
                label={
                  <div>
                    <Typography variant="body1">
                      {t('settings.automaticCheckIn')}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {t('settings.automaticCheckInDescription')}
                    </Typography>
                  </div>
                }
              />
            </div>
            <div className={classes.saveSection}>
              <Button
                color="primary"
                disabled={!dirty || !isValid}
                type="submit"
                variant="contained"
              >
                {t('common:save')}
              </Button>
              <Typography color="textSecondary" variant="caption">
                {t('settings.isStudioWide')}
              </Typography>
            </div>
          </>
        )}
      </form>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  inputContainer: { display: 'flex', gap: theme.spacing(1) },
  inputSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  numberInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: 200,
  },
  root: {
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
  saveSection: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export default compose<Props, OwnProps>(
  React.memo,

  withFormik<OwnProps, FormikValues>({
    mapPropsToValues: ({ accessControlPolicy }) => {
      const {
        booked_session_time_interval_before_visit,
        booked_session_time_interval_after_visit,
        automatic_check_in_enabled,
      } = accessControlPolicy;
      const beforeVisit = DateTime.fromFormat(
        booked_session_time_interval_before_visit,
        'HH:mm:ss',
      );
      const afterVisit = DateTime.fromFormat(
        booked_session_time_interval_after_visit,
        'HH:mm:ss',
      );

      return {
        booked_session_time_interval_after_visit_hours: afterVisit.hour,
        booked_session_time_interval_after_visit_minutes: afterVisit.minute,
        booked_session_time_interval_before_visit_minutes: beforeVisit.minute,
        automatic_check_in_enabled,
      };
    },

    validationSchema,

    enableReinitialize: true,

    handleSubmit: (values, { props: { onSubmit } }) => {
      const {
        booked_session_time_interval_after_visit_hours,
        booked_session_time_interval_after_visit_minutes,
        booked_session_time_interval_before_visit_minutes,
        automatic_check_in_enabled,
      } = values;

      const data = {
        booked_session_time_interval_before_visit: DateTime.now()
          .set({
            hour: 0,
            minute: booked_session_time_interval_before_visit_minutes,
            second: 0,
          })
          .toFormat('HH:mm:ss'),
        booked_session_time_interval_after_visit: DateTime.now()
          .set({
            hour: booked_session_time_interval_after_visit_hours,
            minute: booked_session_time_interval_after_visit_minutes,
            second: 0,
          })
          .toFormat('HH:mm:ss'),
        automatic_check_in_enabled,
      };

      onSubmit(data);
    },
  }),
)(AccessControlSettingsForm);
