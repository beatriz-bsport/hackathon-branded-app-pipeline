import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { DateRange } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useFormikContext } from 'formik';
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';

import FormSection from '#components/forms/FormSection';
import Calendar from '#components/offer/Calendar.component';
import { useOfferFormStyles } from '#libs/offer/hooks';
import { OfferFormValues } from '#libs/offer/types';
import { getOfferRecurrenceDates } from '#libs/offer/utils';

export type Props = {
  timezone: string;
};

export const OfferFormRecurrencePreview = (props: Props) => {
  const { timezone } = props;
  const { values, setFieldValue } = useFormikContext<OfferFormValues>();
  const {
    recurrence,
    recurrenceWeekDay,
    dateIntervalStart,
    dateIntervalEnd,
    isRecurrenceWeekDayDialogOpen,
    calendarSelectedDate,
  } = values;
  const { t } = useTranslation(['offer', 'common']);
  const offerFormClasses = useOfferFormStyles();
  const classes = useStyles();
  const formClasses = useOfferFormStyles();

  const offerDates = useMemo(
    () =>
      getOfferRecurrenceDates(
        {
          recurrence,
          recurrenceWeekDay,
          dateIntervalStart,
          dateIntervalEnd,
        },
        timezone,
      ),
    [
      dateIntervalEnd,
      dateIntervalStart,
      recurrence,
      recurrenceWeekDay,
      timezone,
    ],
  );

  const recurrenceCalendarEvents = useMemo(
    () =>
      offerDates.reduce((acc: { [key: string]: boolean }, date) => {
        const midnight = moment(date).startOf('day');
        acc[midnight.toString()] = true;
        return acc;
      }, {}),
    [offerDates],
  );

  const handleDateChange = useCallback(
    (date: string) => {
      setFieldValue('calendarSelectedDate', date);
    },
    [setFieldValue],
  );

  const handleCloseDialog = useCallback(
    () => setFieldValue('isRecurrenceWeekDayDialogOpen', false),
    [setFieldValue],
  );

  return (
    <Dialog
      classes={{
        paper: classes.popup,
      }}
      onClose={handleCloseDialog}
      open={isRecurrenceWeekDayDialogOpen}
    >
      <FormSection
        sectionCustomIconStyle={offerFormClasses.sectionIcon}
        sectionIcon={DateRange}
        sectionIconContainerStyle={offerFormClasses.sectionIconContainer}
        sectionTitle={t('offer:form.dialog.recurrencePreview')}
      >
        <MuiPickersUtilsProvider
          locale={moment.locale()}
          moment={moment}
          utils={MomentUtils}
        >
          <Calendar
            forceMonthDisplay
            previewOnly
            activeWrapperStyle={offerFormClasses.activeCalendarDay}
            date={calendarSelectedDate}
            events={recurrenceCalendarEvents}
            onDateChange={handleDateChange}
            weekRowContainerStyle={classes.weekRowStyle}
            wrapperStyle={classes.calendarDayBase}
          />
        </MuiPickersUtilsProvider>

        <Alert className={formClasses.recurrencePreviewAlert} severity="info">
          {t('offer:form.section.dateTime.field.recurrence.previewCount', {
            count: offerDates.length,
          })}
        </Alert>
      </FormSection>

      <DialogActions className={classes.actionsContainer}>
        <Button color="secondary" onClick={handleCloseDialog}>
          {t('common:close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  popup: {
    minWidth: 600,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      minWidth: 'inherit',
      width: '80vh',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  actionsContainer: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  calendarDayBase: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: 999,
  },
  weekRowStyle: {
    padding: 0,
  },
}));

export default React.memo(OfferFormRecurrencePreview);
