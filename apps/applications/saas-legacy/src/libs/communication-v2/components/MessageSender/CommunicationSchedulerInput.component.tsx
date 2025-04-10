import React, { useCallback } from 'react';

import { DateTime, Settings } from 'luxon';
import { useTranslation } from 'react-i18next';

import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {
  DatePicker,
  MuiPickersUtilsProvider,
  TimePicker,
} from 'material-ui-pickers';

import { LocalizedLuxonUtils } from '#src/i18n/utils/luxon-picker-utils';
import CustomMuiThemeWrapper from '#src/components/wrappers/CustomMuiThemeWrapper.component';
import { useTheme } from '#src/libs/communication-v2/hooks/useCommunicationsTools.hooks';
import { isAmPmTimeFormat } from '#src/utils/datetime';

export type CommunicationSchedulerInputProps = {
  setCommunicationSchedulingDate: (date: DateTime | null) => void;
  communicationSchedulingDate: DateTime | null;
  checkIsMessageSchedulable: () => boolean;
};

const CommunicationSchedulerInput: React.FC<
  CommunicationSchedulerInputProps
> = ({
  setCommunicationSchedulingDate,
  communicationSchedulingDate,
  checkIsMessageSchedulable,
}: CommunicationSchedulerInputProps) => {
  const { communicationStartHour, communicationEndHour } = useTheme();
  const classes = useStyles();
  const { t } = useTranslation('communication');

  const checkIfScheduledCommunicationAuthorizedDuringTimeSlot =
    useCallback(() => {
      if (!communicationSchedulingDate) return true;

      const { hour: scheduledHour } = communicationSchedulingDate;

      if (communicationStartHour != null && communicationEndHour != null) {
        return (
          scheduledHour >= communicationStartHour &&
          scheduledHour < communicationEndHour
        );
      }

      return true;
    }, [
      communicationSchedulingDate,
      communicationEndHour,
      communicationStartHour,
    ]);

  return (
    <>
      <div className={classes.datePickerContainer}>
        <Typography variant="body1">{t('scheduled.inputLabel')}</Typography>
        <div className={classes.datePickerSection}>
          <MuiPickersUtilsProvider
            locale={Settings.defaultLocale}
            utils={LocalizedLuxonUtils}
          >
            <DatePicker
              required
              adornmentPosition="start"
              className={classes.dateAndTimePickers}
              format="D"
              helperText={null}
              id="offer-form-date-start-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <CalendarTodayIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={setCommunicationSchedulingDate}
              placeholder={t('scheduled.chooseDate')}
              size="small"
              value={communicationSchedulingDate}
              variant="outlined"
            />
            <Typography variant="body1">{t('scheduled.at')}</Typography>
            <TimePicker
              required
              adornmentPosition="start"
              ampm={isAmPmTimeFormat()}
              className={classes.dateAndTimePickers}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon className={classes.timePickerIcon} />
                  </InputAdornment>
                ),
              }}
              onChange={setCommunicationSchedulingDate}
              placeholder={t('scheduled.chooseTime')}
              size="small"
              TextFieldComponent={(
                props: React.ComponentProps<typeof TextField>,
              ) => (
                <CustomMuiThemeWrapper
                  primary={
                    !checkIfScheduledCommunicationAuthorizedDuringTimeSlot()
                      ? 'warning'
                      : undefined
                  }
                >
                  <TextField
                    {...props}
                    error={!checkIsMessageSchedulable()}
                    focused={
                      !checkIfScheduledCommunicationAuthorizedDuringTimeSlot() ||
                      !checkIsMessageSchedulable()
                    }
                    variant="outlined"
                  />
                </CustomMuiThemeWrapper>
              )}
              value={communicationSchedulingDate}
              variant="outlined"
            />
          </MuiPickersUtilsProvider>
        </div>
      </div>
      {!checkIsMessageSchedulable() && (
        <Alert className={classes.alert} severity="error" variant="outlined">
          {t('scheduled.datetimeLimit')}
        </Alert>
      )}
      {!checkIfScheduledCommunicationAuthorizedDuringTimeSlot() && (
        <Alert className={classes.alert} severity="warning" variant="outlined">
          {t('scheduled.nighttimeLimit')}
        </Alert>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  adornment: {
    paddingLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  alert: {
    display: 'flex',
    marginTop: theme.spacing(1),
  },
  datePickerContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(2),
  },
  datePickerSection: {
    display: 'flex',
    paddingTop: theme.spacing(1),
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  timePickerIcon: {
    color: theme.palette.grey[400],
  },
  dateAndTimePickers: {
    display: 'flex',
    width: '49%',
  },
}));

export default React.memo(CommunicationSchedulerInput);
