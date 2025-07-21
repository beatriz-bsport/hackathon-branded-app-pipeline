// @flow
import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DateInput from '../../../../components/input/DateInput.component';

import Config from '#src/config';

import {
  RECURRENCE_RULE_BOOKING_52_WEEKS_ALLOWLIST_BY_ENV,
  RECURRENT_BOOKING_MAX_DELAY_52_WEEKS,
  RECURRENT_BOOKING_MAX_DELAY_8_WEEKS,
} from '#src/libs/booking/components/constants';

type Props = {
  privateSlotSet?: boolean,
  onTimeSettingChange: ({
    nb_of_weeks: number,
    day_of_week: number,
    hour: number,
    minute: number,
  }) => void,
  selectedSetting?: any,
  companyId: number,
};

export default function RecurrenceRulePrivateBookingFields(props: Props) {
  const { t } = useTranslation(['booking', 'datetime']);
  const classes = useStyles();
  const weekdayNumber = [0, 1, 2, 3, 4, 5, 6];

  const handleChange = (event) => {
    const { name } = event.target;
    let value = parseInt(event.target.value, 10);
    if (!event.target.value && event.target.value !== 0) value = '';
    props.onTimeSettingChange({
      ...props.selectedSetting,
      [name]: value,
    });
  };
  const onDateChange = (date: DateTime) => {
    props.onTimeSettingChange({
      ...props.selectedSetting,
      start_from_date: date.toISODate(),
    });
  };

  const getMaxDelayWeek = (companyId: number) => {
    const environment = Config.REACT_APP_SENTRY_ENVIRONMENT || 'production';
    const allowlistedCompanies =
      RECURRENCE_RULE_BOOKING_52_WEEKS_ALLOWLIST_BY_ENV[environment] || [];
    return allowlistedCompanies.includes(companyId)
      ? RECURRENT_BOOKING_MAX_DELAY_52_WEEKS
      : RECURRENT_BOOKING_MAX_DELAY_8_WEEKS;
  };
  return (
    <div>
      {!props.privateSlotSet && (
        <div className={classes.row}>
          <FormControl required className={classes.formControl}>
            <InputLabel>
              {t('booking:recurrenceRule.form.dayOfWeek.label')}
            </InputLabel>
            <Select
              name="day_of_week"
              onChange={(ev) => handleChange(ev)}
              value={
                props.selectedSetting ? props.selectedSetting.day_of_week : null
              }
            >
              {weekdayNumber.map((c) => {
                return (
                  <MenuItem key={c} value={c}>
                    {t(`datetime:time.weekdayNumber.${c}`)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Typography style={{ paddingLeft: 10, paddingRight: 14 }}>
            {t('booking:recurrenceRule.form.at')}
          </Typography>
          <TextField
            required
            className={classes.field}
            InputProps={{
              inputProps: {
                max: 23,
                min: 0,
              },
            }}
            label={t('booking:recurrenceRule.form.hour.label')}
            name="hour"
            onChange={(ev) => handleChange(ev)}
            type="number"
            value={props.selectedSetting ? props.selectedSetting.hour : null}
          />
          <TextField
            required
            className={classes.field}
            InputProps={{
              inputProps: {
                max: 59,
                min: 0,
              },
            }}
            label={t('booking:recurrenceRule.form.minute.label')}
            name="minute"
            onChange={(ev) => handleChange(ev)}
            type="number"
            value={props.selectedSetting ? props.selectedSetting.minute : null}
          />
        </div>
      )}
      {!props.privateSlotSet && props.selectedSetting && (
        <div className={classes.row}>
          <DateInput
            label={t('booking:recurrenceRule.form.startFromDate.label')}
            minDate={DateTime.now()}
            onChange={onDateChange}
            value={
              props.selectedSetting && props.selectedSetting.start_from_date
                ? DateTime.fromISO(props.selectedSetting.start_from_date)
                : null
            }
          />
        </div>
      )}
      <TextField
        required
        helperText={t('booking:recurrenceRule.form.delayWeek.helperText')}
        InputProps={{
          inputProps: {
            max: getMaxDelayWeek(props.companyId),
            min: 1,
          },
        }}
        label={t('booking:recurrenceRule.form.delayWeek.label')}
        name="nb_of_weeks"
        onChange={(ev) => handleChange(ev)}
        type="number"
        value={props.selectedSetting ? props.selectedSetting.nb_of_weeks : null}
      />

      {!props.privateSlotSet && props.selectedSetting && (
        <Typography variant="body2">
          {t('booking:recurrenceRule.explain', {
            dayOfWeek: t(
              `datetime:time.weekdayNumber.${props.selectedSetting.day_of_week}`,
            ),
            hour: `${props.selectedSetting.hour}`.padStart(2, '0'),
            minute: `${props.selectedSetting.minute}`.padStart(2, '0'),
            delayWeek: props.selectedSetting.nb_of_weeks,
          })}
        </Typography>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  field: {
    margin: theme.spacing(1),
    minWidth: 80,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  formControl: {
    minWidth: 160,
  },
}));
