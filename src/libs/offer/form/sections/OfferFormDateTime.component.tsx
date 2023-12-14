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
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
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
import { DATE_PICKER_MASK } from '../../../../constants';

type Props = {
  timezone: string;
  isOfferInGroup?: boolean;
  isEditOffer?: boolean;
  disabled?: boolean;
};

const OfferFormDateTime = (props: Props) => {
  const { timezone, isOfferInGroup, isEditOffer, disabled } = props;
  const { t } = useTranslation(['offer', 'translation']);
  const classes = useOfferFormStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { values, errors, setFieldValue } = useFormikContext<OfferFormValues>();
  const { rebuildDatetime, getMinutes, getHours, getDays, getDurationMinute } =
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
    (days?: number, hour?: number, minute?: number) => {
      const newDurationMinute = getDurationMinute(
        durationMinute,
        days,
        hour,
        minute,
      );
      setFieldValue('durationMinute', newDurationMinute);
    },
    [durationMinute, getDurationMinute, setFieldValue],
  );

  const handleChangeDays = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      handleChangeDurationMinute(parseInt(event.target.value), null, null),
    [handleChangeDurationMinute],
  );

  const handleChangeHours = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      handleChangeDurationMinute(null, parseInt(event.target.value), null),
    [handleChangeDurationMinute],
  );

  const handleChangeMinutes = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      handleChangeDurationMinute(null, null, parseInt(event.target.value)),
    [handleChangeDurationMinute],
  );

  const getDatePickerMask = useCallback((value) => {
    if (value) {
      return DATE_PICKER_MASK;
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
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIcon={DateRange}
      sectionIconContainerStyle={classes.sectionIconContainer}
      sectionTitle={t('offer:form.section.dateTime.title')}
    >
      <div className={classes.formFieldColumns}>
        <OfferFormField
          isRequired
          id="offer-form-date-start-time-field"
          label={t('offer:form.section.dateTime.field.dateIntervalStartTime')}
        >
          <TimePicker
            required
            adornmentPosition="start"
            ampm={isAmPmTimeFormat()}
            className={classNames(classes.timeInput)}
            disabled={!!disabled}
            error={
              typeof errors.dateIntervalStart === 'string' &&
              errors.dateIntervalStart === 'offer:form.errors.dateTooFar'
            }
            id="offer-form-date-start-time-input"
            InputProps={{
              classes: {
                adornedEnd: classes.dateInputAdornedEnd,
                adornedStart: classes.dateInputAdornedStart,
              },
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton className={classes.inputIconAdornment}>
                    <AccessTime />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={handleChangeStartTime}
            placeholder="00:00"
            size="small"
            value={moment(dateIntervalStart).tz(timezone)}
            variant="outlined"
          />
        </OfferFormField>

        <OfferFormField
          isRequired
          label={t('offer:form.section.dateTime.field.durationMinute')}
        >
          <div className={classes.durationField}>
            <div className={classes.durationFieldInputWithIndicator}>
              <NumericInput
                disabled={!!disabled}
                error={!!errors.durationMinute}
                id="offer-form-duration-hours-input"
                inputClass={classes.smallWidth}
                InputProps={{
                  disableUnderline: true,
                  inputProps: { min: 0 },
                  endAdornment: (
                    <InputAdornment
                      className={classes.numericInputAdornment}
                      position="end"
                    >
                      {t('translation:common.daySmall')}
                    </InputAdornment>
                  ),
                }}
                name="durationMinute"
                onChange={handleChangeDays}
                placeholder="0"
                size="small"
                value={getDays(durationMinute)}
              />
            </div>

            <div className={classes.durationFieldInputWithIndicator}>
              <NumericInput
                disabled={!!disabled}
                error={!!errors.durationMinute}
                id="offer-form-duration-hours-input"
                inputClass={classes.smallWidth}
                InputProps={{
                  disableUnderline: true,
                  inputProps: { min: 0, max: 23 },
                  endAdornment: (
                    <InputAdornment
                      className={classes.numericInputAdornment}
                      position="end"
                    >
                      {t('translation:common.hourSmall')}
                    </InputAdornment>
                  ),
                }}
                name="durationMinute"
                onChange={handleChangeHours}
                placeholder="1"
                size="small"
                value={getHours(durationMinute)}
              />
            </div>

            <div className={classes.durationFieldInputWithIndicator}>
              <NumericInput
                disabled={!!disabled}
                error={!!errors.durationMinute}
                id="offer-form-duration-minutes-input"
                inputClass={classes.minutesInput}
                InputProps={{
                  disableUnderline: true,
                  inputProps: { min: 0, max: 59 },
                  endAdornment: (
                    <InputAdornment
                      className={classes.numericInputAdornment}
                      position="end"
                    >
                      {t('translation:common.minuteSmall')}
                    </InputAdornment>
                  ),
                }}
                name="durationMinute"
                onChange={handleChangeMinutes}
                placeholder="00"
                size="small"
                value={getMinutes(durationMinute)}
              />
            </div>
          </div>
        </OfferFormField>
      </div>

      {!!errors.durationMinute && (
        <div>
          <Typography color="error" variant="caption">
            {t(errors.durationMinute)}
          </Typography>
        </div>
      )}

      <OfferFormField
        isRequired
        id="offer-form-date-start-field"
        isError={!!errors.dateIntervalStart}
        label={t('offer:form.section.dateTime.field.dateIntervalStart')}
      >
        <div className={classes.errorContainer}>
          <MuiPickersUtilsProvider
            locale={moment.locale()}
            moment={moment}
            utils={MomentUtils}
          >
            <DatePicker
              required
              adornmentPosition="start"
              className={classes.dateInput}
              disabled={!!disabled}
              error={
                typeof errors.dateIntervalStart === 'string' &&
                errors.dateIntervalStart === 'offer:form.errors.dateTooFar'
              }
              format="L"
              helperText={null}
              id="offer-form-date-start-input"
              InputProps={{
                classes: {
                  adornedEnd: classes.dateInputAdornedEnd,
                  adornedStart: classes.dateInputAdornedStart,
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton className={classes.inputIconAdornment}>
                      <CalendarToday />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              mask={getDatePickerMask}
              onChange={handleChangeDateStart}
              placeholder={datePickerPlaceholder}
              size="small"
              value={moment(dateIntervalStart)}
              variant="outlined"
            />
          </MuiPickersUtilsProvider>

          {!!errors.dateIntervalStart &&
            typeof errors.dateIntervalStart === 'string' && (
              <Typography color="error" variant="caption">
                {t(errors.dateIntervalStart)}
              </Typography>
            )}
        </div>
      </OfferFormField>

      {!isEditOffer && (
        <>
          <SwitchField
            id="offer-form-recurrence-switch"
            label={t('offer:form.section.dateTime.field.recurrence.title')}
            name="isRecurrence"
            switchColor="secondary"
          />

          <div className={classes.formFieldColumns}>
            {isRecurrence && (
              <OfferFormField
                isRequired
                id="offer-form-recurrence-field"
                isError={!!errors.recurrence}
                label={t('offer:form.section.dateTime.field.recurrence.title')}
              >
                <div
                  className={classNames(
                    classes.bigWidth,
                    classes.errorContainer,
                  )}
                >
                  <OfferFormSelector
                    className={classes.bigWidth}
                    id="offer-form-recurrence-selector"
                    isError={!!errors.recurrence}
                    name="recurrence"
                    options={availableRecurrenceOptions}
                    placeholder={t(
                      'offer:form.section.dateTime.field.recurrence.placeholder',
                    )}
                  />

                  {!!errors.recurrence && (
                    <Typography color="error" variant="caption">
                      {t(errors.recurrence)}
                    </Typography>
                  )}
                </div>
              </OfferFormField>
            )}
            {isRecurrence && (
              <OfferFormField
                isRequired
                id="offer-form-date-end-field"
                isError={!!errors.dateIntervalEnd}
                label={t('offer:form.section.dateTime.field.dateIntervalEnd')}
              >
                <div className={classes.errorContainer}>
                  <MuiPickersUtilsProvider
                    locale={moment.locale()}
                    moment={moment}
                    utils={MomentUtils}
                  >
                    <DatePicker
                      keyboard
                      required
                      className={classes.dateInput}
                      error={!!errors.dateIntervalEnd}
                      format="L"
                      helperText={null}
                      id="offer-form-date-end-input"
                      InputProps={{
                        classes: {
                          adornedEnd: classes.dateInputAdornedEnd,
                        },
                      }}
                      keyboardIcon={<CalendarToday />}
                      mask={getDatePickerMask}
                      minDate={dateIntervalStart}
                      onChange={handleChangeDateEnd}
                      placeholder={datePickerPlaceholder}
                      size="small"
                      value={dateIntervalEnd}
                      variant="outlined"
                    />
                  </MuiPickersUtilsProvider>

                  {!!errors.dateIntervalEnd &&
                    typeof errors.dateIntervalEnd === 'string' && (
                      <Typography color="error" variant="caption">
                        {t(errors.dateIntervalEnd)}
                      </Typography>
                    )}
                </div>
              </OfferFormField>
            )}
          </div>

          {isRecurrence && recurrence === OFFER_RECURRENCE.WEEKLY && (
            <OfferFormWeeklyRecurrenceDays
              id="offer-form-recurrence-week-days"
              timezone={timezone}
            />
          )}

          {isRecurrence && (
            <Alert
              action={
                isMobile ? (
                  <RemoveRedEye onClick={handleOpenRecurrencePreviewDialog} />
                ) : (
                  <Button
                    color="inherit"
                    onClick={handleOpenRecurrencePreviewDialog}
                    startIcon={<RemoveRedEye />}
                  >
                    {t('offer:form.section.dateTime.field.recurrence.preview')}
                  </Button>
                )
              }
              className={classes.recurrencePreviewAlert}
              severity="info"
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

export default React.memo(OfferFormDateTime);
