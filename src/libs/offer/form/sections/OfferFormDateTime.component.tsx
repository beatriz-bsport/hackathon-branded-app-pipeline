import React, { useCallback, useMemo } from 'react';

import {
  AccessTime,
  CalendarToday,
  DateRange,
  RemoveRedEye,
} from '@material-ui/icons';
import { useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DatePicker from 'material-ui-pickers/DatePicker';
import TimePicker from 'material-ui-pickers/TimePicker';
import moment, { Moment } from 'moment-timezone';
import Alert from '@material-ui/lab/Alert';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from '@date-io/moment';

import FormSection from '#components/forms/FormSection';
import useOfferFormStyles from '#libs/offer/hooks/useOfferFormStyles';
import OfferFormField from '#libs/offer/form/OfferFormField.component';
import NumericInput from '#components/input/NumericInput.component';
import { SwitchField } from '#libs/custom-form/components/GenericFormik.input';
import { OFFER_RECURRENCE } from '#libs/offer/constants';
import OfferFormWeeklyRecurrenceDays from '#libs/offer/components/OfferFormWeeklyRecurrenceDays.component';
import OfferFormSelector from '#libs/offer/form/OfferFormSelector.component';
import { useOfferFormDateTime } from '#libs/offer/hooks';
import { isAmPmTimeFormat } from '../../../../utils/datetime';

import { OfferFormValues } from '#libs/offer/types';
import { getOfferRecurrenceDates } from '#libs/offer/utils';

type Props = {
  timezone: string;
  isOfferInGroup?: boolean;
  isEditOffer?: boolean;
};

const OfferFormDateTime = (props: Props) => {
  const { timezone, isOfferInGroup, isEditOffer } = props;
  const { t } = useTranslation(['offer', 'translation']);
  const classes = useOfferFormStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { values, errors, setFieldValue } = useFormikContext<OfferFormValues>();
  const { rebuildDatetime, getMinutes, getHours, getDurationMinute } =
    useOfferFormDateTime(timezone);
  const {
    recurrence,
    recurrenceWeekDay,
    dateIntervalStart,
    dateIntervalEnd,
    isRecurrence,
    durationMinute,
  } = values;

  const handleChangeDate = useCallback(
    (
      stateKey: 'dateIntervalStart' | 'dateIntervalEnd',
      dateValue: Moment,
      dateState: Moment,
    ) => {
      const newDate = rebuildDatetime(
        dateValue,
        moment(dateState).tz(timezone).get('hour'),
        moment(dateState).tz(timezone).get('minute'),
      );

      setFieldValue(stateKey, moment(newDate));
    },
    [rebuildDatetime, setFieldValue, timezone],
  );

  const handleChangeDateStart = useCallback(
    (date: Moment) => {
      const isDateEqualOrAfterEndDate = moment(date).isSameOrAfter(
        moment(dateIntervalEnd),
      );
      handleChangeDate('dateIntervalStart', date, moment(dateIntervalStart));
      if (isRecurrence && isDateEqualOrAfterEndDate) {
        setFieldValue('dateIntervalEnd', moment(date).add(1, 'day'));
      }
    },
    [
      dateIntervalEnd,
      dateIntervalStart,
      handleChangeDate,
      isRecurrence,
      setFieldValue,
    ],
  );

  const handleChangeDateEnd = useCallback(
    (date: Moment) =>
      handleChangeDate('dateIntervalEnd', date, moment(dateIntervalEnd)),
    [dateIntervalEnd, handleChangeDate],
  );

  const handleChangeStartTime = useCallback(
    (time: Moment) => {
      const hour = time.hour();
      const minute = time.minute();

      const newDateIntervalStart = rebuildDatetime(
        dateIntervalStart,
        hour,
        minute,
      );

      setFieldValue('dateIntervalStart', moment(newDateIntervalStart));
    },
    [dateIntervalStart, rebuildDatetime, setFieldValue],
  );

  const handleChangeDurationMinute = useCallback(
    (hour?: number, minute?: number) => {
      const newDurationMinute = getDurationMinute(durationMinute, hour, minute);
      setFieldValue('durationMinute', newDurationMinute);
    },
    [durationMinute, getDurationMinute, setFieldValue],
  );

  const handleChangeHours = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      handleChangeDurationMinute(parseInt(event.target.value)),
    [handleChangeDurationMinute],
  );

  const handleChangeMinutes = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      handleChangeDurationMinute(null, parseInt(event.target.value)),
    [handleChangeDurationMinute],
  );

  const getDatePickerMask = useCallback((value) => {
    if (value) {
      return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    }
    return [];
  }, []);

  const handleOpenRecurrencePreviewDialog = useCallback(() => {
    setFieldValue('isRecurrenceWeekDayDialogOpen', true);
  }, [setFieldValue]);

  const offerRecurrencePreviewCount = useMemo(
    () =>
      getOfferRecurrenceDates(
        {
          recurrence,
          recurrenceWeekDay,
          dateIntervalStart,
          dateIntervalEnd,
        },
        timezone,
      )?.length ?? 0,
    [
      dateIntervalEnd,
      dateIntervalStart,
      recurrence,
      recurrenceWeekDay,
      timezone,
    ],
  );

  const availableRecurrenceOptions = useMemo(() => {
    const allOptions = [
      {
        label: t('offer:form.section.dateTime.field.recurrence.option.daily'),
        value: OFFER_RECURRENCE.DAILY,
      },
      {
        label: t('offer:form.section.dateTime.field.recurrence.option.weekly'),
        value: OFFER_RECURRENCE.WEEKLY,
      },
      {
        label: t('offer:form.section.dateTime.field.recurrence.option.monthly'),
        value: OFFER_RECURRENCE.MONTHLY,
      },
    ];

    const availableOptions = allOptions
      .map((option) => {
        const isDailyOption = option.value === OFFER_RECURRENCE.DAILY;
        const isMonthlyOption = option.value === OFFER_RECURRENCE.MONTHLY;
        if (isOfferInGroup && (isDailyOption || isMonthlyOption)) {
          return null;
        }
        return option;
      })
      .filter((option) => !!option);

    return availableOptions;
  }, [isOfferInGroup, t]);

  const datePickerPlaceholder = useMemo(() => moment().format('L'), []);

  return (
    <FormSection
      id="offer-form-datetime-section"
      sectionTitle={t('offer:form.section.dateTime.title')}
      sectionIcon={DateRange}
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIconContainerStyle={classes.sectionIconContainer}
    >
      <div className={classes.formFieldColumns}>
        <OfferFormField
          label={t('offer:form.section.dateTime.field.dateIntervalStartTime')}
          isRequired
          id="offer-form-date-start-time-field"
        >
          <TimePicker
            id="offer-form-date-start-time-input"
            ampm={isAmPmTimeFormat()}
            error={
              typeof errors.dateIntervalStart === 'string' &&
              errors.dateIntervalStart === 'offer:form.errors.dateTooFar'
            }
            className={classNames(classes.timeInput)}
            variant="outlined"
            size="small"
            keyboard
            required
            value={moment(dateIntervalStart).tz(timezone)}
            onChange={handleChangeStartTime}
            placeholder="00:00"
            InputProps={{
              classes: {
                adornedEnd: classes.dateInputAdornedEnd,
              },
            }}
            keyboardIcon={<AccessTime />}
          />
        </OfferFormField>

        <OfferFormField
          label={t('offer:form.section.dateTime.field.durationMinute')}
          isRequired
        >
          <div className={classes.durationField}>
            <div className={classes.durationFieldInputWithIndicator}>
              <NumericInput
                id="offer-form-duration-hours-input"
                name="durationMinute"
                value={getHours(durationMinute)}
                variant="outlined"
                size="small"
                placeholder="1"
                onChange={handleChangeHours}
                inputClass={classes.smallWidth}
                InputProps={{ inputProps: { min: 0, max: 23 } }}
                error={!!errors.durationMinute}
              />
              {t('translation:common.hourSmall')}
            </div>

            <div className={classes.durationFieldInputWithIndicator}>
              <NumericInput
                id="offer-form-duration-minutes-input"
                name="durationMinute"
                value={getMinutes(durationMinute)}
                variant="outlined"
                size="small"
                placeholder="00"
                onChange={handleChangeMinutes}
                inputClass={classes.smallWidth}
                InputProps={{ inputProps: { min: 0, max: 59 } }}
                error={!!errors.durationMinute}
              />
              {t('translation:common.minuteSmall')}
            </div>
          </div>
        </OfferFormField>
      </div>

      {!!errors.durationMinute && (
        <div>
          <Typography variant="caption" color="error">
            {t(errors.durationMinute)}
          </Typography>
        </div>
      )}

      <OfferFormField
        id="offer-form-date-start-field"
        label={t('offer:form.section.dateTime.field.dateIntervalStart')}
        isRequired
        isError={!!errors.dateIntervalStart}
      >
        <div className={classes.errorContainer}>
          <MuiPickersUtilsProvider
            utils={MomentUtils}
            moment={moment}
            locale={moment.locale()}
          >
            <DatePicker
              id="offer-form-date-start-input"
              className={classes.dateInput}
              format="L"
              variant="outlined"
              size="small"
              keyboard
              required
              error={
                typeof errors.dateIntervalStart === 'string' &&
                errors.dateIntervalStart === 'offer:form.errors.dateTooFar'
              }
              value={moment(dateIntervalStart)}
              onChange={handleChangeDateStart}
              placeholder={datePickerPlaceholder}
              mask={getDatePickerMask}
              InputProps={{
                classes: {
                  adornedEnd: classes.dateInputAdornedEnd,
                },
              }}
              helperText={null}
              keyboardIcon={<CalendarToday />}
            />
          </MuiPickersUtilsProvider>

          {!!errors.dateIntervalStart &&
            typeof errors.dateIntervalStart === 'string' && (
              <Typography variant="caption" color="error">
                {t(errors.dateIntervalStart)}
              </Typography>
            )}
        </div>
      </OfferFormField>

      {!isEditOffer && (
        <>
          <div className={classes.formFieldColumns}>
            <SwitchField
              id="offer-form-recurrence-switch"
              name="isRecurrence"
              label={t('offer:form.section.dateTime.field.recurrence.title')}
              switchColor="secondary"
            />

            {isRecurrence && (
              <OfferFormField
                id="offer-form-date-end-field"
                label={t('offer:form.section.dateTime.field.dateIntervalEnd')}
                isRequired
                isError={!!errors.dateIntervalEnd}
              >
                <div className={classes.errorContainer}>
                  <MuiPickersUtilsProvider
                    utils={MomentUtils}
                    moment={moment}
                    locale={moment.locale()}
                  >
                    <DatePicker
                      id="offer-form-date-end-input"
                      className={classes.dateInput}
                      format="L"
                      variant="outlined"
                      size="small"
                      keyboard
                      required
                      error={!!errors.dateIntervalEnd}
                      value={dateIntervalEnd}
                      minDate={dateIntervalStart}
                      onChange={handleChangeDateEnd}
                      placeholder={datePickerPlaceholder}
                      mask={getDatePickerMask}
                      InputProps={{
                        classes: {
                          adornedEnd: classes.dateInputAdornedEnd,
                        },
                      }}
                      helperText={null}
                      keyboardIcon={<CalendarToday />}
                    />
                  </MuiPickersUtilsProvider>

                  {!!errors.dateIntervalEnd &&
                    typeof errors.dateIntervalEnd === 'string' && (
                      <Typography variant="caption" color="error">
                        {t(errors.dateIntervalEnd)}
                      </Typography>
                    )}
                </div>
              </OfferFormField>
            )}
          </div>

          {isRecurrence && (
            <OfferFormField
              id="offer-form-recurrence-field"
              label={t('offer:form.section.dateTime.field.recurrence.title')}
              isRequired
              isError={!!errors.recurrence}
              isFlexColumn={isMobile}
            >
              <div
                className={classNames(classes.bigWidth, classes.errorContainer)}
              >
                <OfferFormSelector
                  id="offer-form-recurrence-selector"
                  name="recurrence"
                  options={availableRecurrenceOptions}
                  className={classes.bigWidth}
                  placeholder={t(
                    'offer:form.section.dateTime.field.recurrence.placeholder',
                  )}
                  isError={!!errors.recurrence}
                />

                {!!errors.recurrence && (
                  <Typography variant="caption" color="error">
                    {t(errors.recurrence)}
                  </Typography>
                )}
              </div>
            </OfferFormField>
          )}

          {isRecurrence && recurrence === OFFER_RECURRENCE.WEEKLY && (
            <OfferFormWeeklyRecurrenceDays
              id="offer-form-recurrence-week-days"
              timezone={timezone}
            />
          )}

          {isRecurrence && (
            <Alert
              className={classes.recurrencePreviewAlert}
              severity="info"
              action={
                isMobile ? (
                  <RemoveRedEye onClick={handleOpenRecurrencePreviewDialog} />
                ) : (
                  <Button
                    color="inherit"
                    startIcon={<RemoveRedEye />}
                    onClick={handleOpenRecurrencePreviewDialog}
                  >
                    {t('offer:form.section.dateTime.field.recurrence.preview')}
                  </Button>
                )
              }
            >
              {t('offer:form.section.dateTime.field.recurrence.previewCount', {
                count: offerRecurrencePreviewCount,
              })}
            </Alert>
          )}
        </>
      )}
    </FormSection>
  );
};

export default OfferFormDateTime;
