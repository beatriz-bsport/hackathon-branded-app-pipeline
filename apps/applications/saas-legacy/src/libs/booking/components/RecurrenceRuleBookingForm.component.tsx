// @flow

import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormikContext, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Alert } from '@material-ui/lab';

// @ts-expect-error
import MetaActivitySelectorField from '#src/libs/meta-activity/components/MetaActivitySelectorField.component';
// @ts-expect-error
import EstablishmentSelectorField from '../../establishment/components/EstablishmentSelectorField.component';

// @ts-expect-error
import { IntegerField, SelectField } from '../../../components/forms';
import Config from '#src/config';

import {
  RECURRENCE_RULE_BOOKING_52_WEEKS_ALLOWLIST_BY_ENV,
  RECURRENT_BOOKING_MAX_DELAY_52_WEEKS,
  RECURRENT_BOOKING_MAX_DELAY_8_WEEKS,
} from '#src/libs/booking/components/constants';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Establishment } from '#src/api/types';

type InitialRecurrenceRuleBooking = {
  day_of_week: number;
  minute: number;
  hour: number;
  delay_week: number;
  meta_activity: MetaActivity | null;
  establishment: Establishment | null;
  notify_if_booked: boolean;
};

type RecurrenceRuleBooking = {
  day_of_week: number;
  minute: number;
  hour: number;
  delay_week: number;
  meta_activity: number | null;
  establishment: number | null;
  notify_if_booked: boolean;
};

type Props = {
  values: RecurrenceRuleBooking;
  offerSet: boolean;
  memberSet: boolean;
  metaActivityList: Array<MetaActivity>;
  setFieldValue: <T>(field: string, value: T) => void;
  initial?: InitialRecurrenceRuleBooking;
  establishmentList: Array<Establishment>;
  hasActivityGroups: boolean;
  showCreateBookingWarning: boolean;
  fetchGroupsOfferList?: (params: {
    meta_activity__in: number[];
    page: number;
    page_size: number;
  }) => void;
  companyId: number;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (
    values: RecurrenceRuleBooking,
    options: {
      onSuccess: () => void;
      onError: (error: any) => void;
    },
  ) => void;
};

const RecurrenceRuleBookingForm: React.FC<Props> = ({
  initial,
  values,
  offerSet,
  memberSet,
  metaActivityList,
  establishmentList,
  fetchGroupsOfferList,
  hasActivityGroups = false,
  setFieldValue,
  showCreateBookingWarning,
  companyId,
}) => {
  const { t } = useTranslation(['booking', 'datetime']);
  const classes = useStyles();
  const [checked, setChecked] = useState(
    initial ? initial.notify_if_booked : false,
  );
  const { errors } = useFormikContext();

  const handleChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setFieldValue('notify_if_booked', event.target.checked);
  };

  const processError = (error: any) => {
    if (!error) return null;
    if (
      error?.response?.data?.non_field_errors?.[0]?.includes(
        'must make a unique set',
      )
    ) {
      return 'booking:recurrenceRule.form.duplicateError';
    }
    return 'booking:recurrenceRule.form.globalError';
  };

  useEffect(() => {
    fetchGroupsOfferList?.({
      meta_activity__in: values.meta_activity ? [values.meta_activity] : [],
      page: 1,
      page_size: 1,
    });
  }, [values.meta_activity, fetchGroupsOfferList]);

  // @ts-expect-error
  const errorLabel = processError(errors?.global);

  return (
    <div>
      <div className={classes.field}>
        <fieldset>
          <legend>{t('booking:recurrenceRule.form.timeGroup')}</legend>
          <div className={classes.row}>
            <SelectField
              choices={[0, 1, 2, 3, 4, 5, 6]}
              disabled={offerSet}
              itemRenderer={(c: number) => (
                <MenuItem key={c} value={c}>
                  {t(`datetime:time.weekdayNumber.${c}`)}
                </MenuItem>
              )}
              label={t('booking:recurrenceRule.form.dayOfWeek.label')}
              name="day_of_week"
              style={{ minWidth: 140, marginBottom: 9 }}
            />
            <Typography style={{ paddingLeft: 10, paddingRight: 14 }}>
              {t('booking:recurrenceRule.form.at')}
            </Typography>
            <IntegerField
              required
              disabled={offerSet}
              id="hour"
              label={t('booking:recurrenceRule.form.hour.label')}
              name="hour"
            />
            <IntegerField
              required
              disabled={offerSet}
              id="minute"
              label={t('booking:recurrenceRule.form.minute.label')}
              name="minute"
            />
          </div>
        </fieldset>
      </div>
      <div className={classes.field}>
        <EstablishmentSelectorField
          fullWidth
          noMulti
          establishmentList={establishmentList}
          id="establishment"
          label={t('booking:recurrenceRule.form.establishment.label')}
          name="establishment"
        />
      </div>
      <div className={classes.field}>
        <MetaActivitySelectorField
          fullWidth
          noMulti
          required
          disabled={offerSet || memberSet}
          helperText={(days: number) =>
            t('booking:recurrenceRule.blockedBookings', { days })
          }
          id="meta_activity"
          label={t('booking:recurrenceRule.form.metaActivity.label')}
          metaActivityList={metaActivityList}
          name="meta_activity"
          showHelperText={(days: number) => days > values.delay_week * 7}
        />
      </div>
      <div className={classes.field}>
        <IntegerField
          required
          helperText={t('booking:recurrenceRule.form.delayWeek.helperText', {
            delayWeek: getMaxDelayWeek(companyId),
          })}
          id="delay_week"
          label={t('booking:recurrenceRule.form.delayWeek.label')}
          name="delay_week"
        />
      </div>
      <div className={classes.field}>
        <Alert className={classes.alertRoot} severity="info">
          <Typography variant="body2">
            {t('booking:recurrenceRule.explain', {
              dayOfWeek: t(`datetime:time.weekdayNumber.${values.day_of_week}`),
              hour: `${values.hour}`.padStart(2, '0'),
              minute: `${values.minute}`.padStart(2, '0'),
              delayWeek: values.delay_week,
            })}
          </Typography>
        </Alert>
      </div>
      {hasActivityGroups && (
        <Alert severity="error" variant="outlined">
          {t('booking:recurrenceRule.form.groupWarning')}
        </Alert>
      )}
      <div className={classes.field}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                id="notify_if_booked"
                name="notify_if_booked"
                onChange={handleChangeChecked}
              />
            }
            label={t('booking:recurrenceRule.notify')}
          />
        </FormGroup>
      </div>
      {showCreateBookingWarning && (
        <Alert severity="error">
          {t('booking:recurrenceRule.form.permissionWarning')}
        </Alert>
      )}
      {errorLabel && <Alert severity="error">{t(errorLabel)}</Alert>}
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
  alertRoot: { display: 'flex', alignItems: 'center' },
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

const getMaxDelayWeek = (companyId: number) => {
  type EnvKey = 'local' | 'dev' | 'staging' | 'production';
  const environment: EnvKey =
    (Config.REACT_APP_SENTRY_ENVIRONMENT as EnvKey) || 'production';
  const allowlistedCompanies =
    RECURRENCE_RULE_BOOKING_52_WEEKS_ALLOWLIST_BY_ENV[environment] || [];
  return allowlistedCompanies.includes(companyId)
    ? RECURRENT_BOOKING_MAX_DELAY_52_WEEKS
    : RECURRENT_BOOKING_MAX_DELAY_8_WEEKS;
};

const recurrenceRuleBookingSchema = (props: Props) => {
  return Yup.object().shape({
    day_of_week: Yup.number().min(0).max(6).required(),
    minute: Yup.number().min(0).max(59).required(),
    hour: Yup.number().min(0).max(23).required(),
    delay_week: Yup.number()
      .min(1)
      .max(getMaxDelayWeek(props.companyId))
      .required(),
    meta_activity: Yup.number().required(),
    establishment: Yup.number().nullable(),
    notify_if_booked: Yup.boolean(),
  });
};

export const RecurrenceRuleBookingFormikHOC = withFormik({
  mapPropsToValues: ({ initial }: Props): RecurrenceRuleBooking =>
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
  validationSchema: recurrenceRuleBookingSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting, setErrors }) => {
    onSubmit(values, {
      onSuccess: () => {
        setSubmitting(false);
      },
      onError: (e) => {
        // @ts-expect-error
        setErrors({ global: e });
        setSubmitting(false);
      },
    });
  },
});

export default RecurrenceRuleBookingForm;
