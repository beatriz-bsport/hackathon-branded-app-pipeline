import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { DateTime } from 'luxon';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  makeStyles,
  Switch,
  Theme,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  InputLabel,
  FormHelperText,
} from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import {
  BOOKING_DATE_ORDER,
  BOOKING_FIRSTNAME_ORDER,
  BOOKING_LASTNAME_ORDER,
} from '@bsport/common/lib/master-data/settings.js';

import {
  MarketPlaceCoachDisplay,
  MarketPlaceDaysFormatDisplay,
  MarketPlaceSessionTimeDisplay,
} from '@bsport/common/lib/master-data/personalization.js';

import clsx from 'clsx';
import { Alert } from '@material-ui/lab';

import {
  IntegerField,
  RadioGroupField,
  TimeField,
  TextField,
  SwitchField,
  HoursDaysIntervalRecurrenceSelectField,
  // @ts-expect-error
} from '#src/components/forms';

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc';
import { UPSELL_IDENTIFIER_SPIVI } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import { FeatureList } from '#src/libs/company/types';
import { CompanyTheme } from '../types';
import { OptionCallback } from '../../../state/types';
import Config from '../../../config';
import { StopSubscriptionInfoModal } from '#src/libs/theme/components/StopSubscriptionInfoModal';
import { getIntercomLink } from '#src/intercom';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

interface FormikValues {
  show_offers_filling: boolean;
  accept_double_booking: boolean;
  accept_double_booking_workshop: boolean;
  allow_guest: boolean;
  allow_guest_max_number: number;
  allow_guest_frequency: string;
  hide_unnecessary_compatible_purchase_method: boolean;
  show_studio_on_general_app: boolean;
  coach_can_edit_attendance: boolean;
  default_attendance: boolean;
  show_cancelled_offers_manager: boolean;
  display_stop_subscription_from_member_side: boolean;
  show_cancelled_offers_customer: boolean;
  hideCoach: boolean;
  show_workshops_customer: boolean;
  show_booked_gender_offer: boolean;
  is_checking_balance: boolean;
  hide_member_details_in_app_private_booking_for_coach: boolean;
  gender_max_shift_for_booking: number;
  max_future_booking: number;
  max_future_workshop: number;
  booking_option_included_in_max_future_booking: boolean;
  basket_expiration_days: number;
  nb_to_check_balance: number;
  default_booking_ordering: string;
  schedule_timerange_begin: string;
  schedule_timerange_end: string;
  hide_sessions_with_tags_when_not_eligible: boolean;
  requires_email_confirmation_when_signing_up: boolean;
  confirm_email_url_redirection: string;
  reset_password_url_redirection: string;
  is_roll_call_mandatory: boolean;
  no_show_validated_time: number;
  no_show_email_time: number;
  no_show_validated_interval: string;
  no_show_email_interval: string;
  show_establishment: boolean;
  show_level: boolean;
  show_activity_color: boolean;
  session_time_display: MarketPlaceSessionTimeDisplay;
  coach_display: MarketPlaceCoachDisplay;
  days_format_display: MarketPlaceDaysFormatDisplay;
  show_free_session_label: boolean;
  hide_book_button: boolean;
  show_past_sessions_calendar: boolean;
  display_credit_price_for_offer: boolean;
  one_click_checkout_enabled: boolean;
  is_marketing_double_opt_in_enabled: boolean;
}
type Props = {
  theme: CompanyTheme;
  onSubmit: (id: number, data: FormData, options: OptionCallback) => void;
};

const regexHTTP = /https?:\/\//;

const ThemePersonalizeForm: React.FC<FormikProps<FormikValues>> = ({
  isSubmitting,
  isValid,
  handleSubmit,
  setFieldValue,
  values,
  errors,
  // @ts-expect-error
  theme,
}) => {
  const { t } = useTranslation(['theme', 'translation', 'b2b_theme']);
  const classes = useStyles();
  const showMarketingDoubleOptInSetting = useSafeFlag(
    FeatureFlags.MARKETING_DOUBLE_OPT_IN,
  );

  const handleOnChangeCoachDisplay = React.useCallback(
    (option: { label: string; value: MarketPlaceCoachDisplay }) => {
      setFieldValue('coach_display', option.value);
    },
    [setFieldValue],
  );

  const handleOnChangeSessionTimeDisplay = React.useCallback(
    (option: { label: string; value: MarketPlaceSessionTimeDisplay }) => {
      setFieldValue('session_time_display', option.value);
    },
    [setFieldValue],
  );

  const handleOnChangeDayFormatDisplay = React.useCallback(
    (option: { label: string; value: MarketPlaceDaysFormatDisplay }) => {
      setFieldValue('days_format_display', option.value);
    },
    [setFieldValue],
  );

  const [isStopSubscriptionModalOpen, setIsStopSubscriptionModalOpen] =
    useState(false);

  const handleOnChangeStopSubscription = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setIsStopSubscriptionModalOpen(true);
      }
    },
    [],
  );

  const handleCancelSwitchStopSubscription = React.useCallback(() => {
    setFieldValue('display_stop_subscription_from_member_side', false);
    setIsStopSubscriptionModalOpen(false);
  }, [setFieldValue]);

  const handleValidateSwitchStopSubscription = React.useCallback(() => {
    setIsStopSubscriptionModalOpen(false);
    setFieldValue('display_stop_subscription_from_member_side', true);
  }, [setFieldValue]);

  const [showDialogGuest, setShowDialogGuest] = useState(false);
  const guestFrequencyOptions = [
    {
      value: 'every_week',
      label: t('forms.allowGuest.frequencies.week'),
    },
    {
      value: 'every_month',
      label: t('forms.allowGuest.frequencies.month'),
    },
    {
      value: 'every_year',
      label: t('forms.allowGuest.frequencies.year'),
    },
  ];

  const coachDisplayOptions = React.useMemo(
    () => [
      {
        label: t(
          'forms.themePersonalization.coachDisplayOptions.showCoachFullNameWithPicture',
        ),
        value: MarketPlaceCoachDisplay.DEFAULT,
      },
      {
        label: t(
          'forms.themePersonalization.coachDisplayOptions.onlyShowCoachFirstName',
        ),
        value: MarketPlaceCoachDisplay.ONLY_FIRST_NAME,
      },
      {
        label: t(
          'forms.themePersonalization.coachDisplayOptions.showCoachFirstNameWithPicture',
        ),
        value: MarketPlaceCoachDisplay.FIRST_NAME_WITH_PICTURE,
      },
      {
        label: t(
          'forms.themePersonalization.coachDisplayOptions.showCoachFullNameWithoutPicture',
        ),
        value: MarketPlaceCoachDisplay.FULL_NAME_WITHOUT_PICTURE,
      },
    ],
    [t],
  );

  const coachDisplayCurrent = React.useMemo(
    () =>
      coachDisplayOptions.find(
        (element) => element.value === values.coach_display,
      ),
    [coachDisplayOptions, values.coach_display],
  );

  const sessionDatesDisplayOptions = React.useMemo(
    () => [
      {
        label: t(
          'forms.themePersonalization.sessionDatesDisplayOptions.showEndingTime',
        ),
        value: MarketPlaceSessionTimeDisplay.DEFAULT,
      },
      {
        label: t(
          'forms.themePersonalization.sessionDatesDisplayOptions.onlyShowStartingTime',
        ),
        value: MarketPlaceSessionTimeDisplay.ONLY_STARTING_TIME,
      },
      {
        label: t(
          'forms.themePersonalization.sessionDatesDisplayOptions.showDuration',
        ),
        value: MarketPlaceSessionTimeDisplay.STARTING_TIME_AND_DURATION,
      },
    ],
    [t],
  );

  const sessionDatesDisplayCurrent = React.useMemo(
    () =>
      sessionDatesDisplayOptions.find(
        (element) => element.value === values.session_time_display,
      ),
    [sessionDatesDisplayOptions, values.session_time_display],
  );

  const daysFormatDisplayOptions = React.useMemo(
    () => [
      {
        label: t('forms.themePersonalization.daysFormatSelector.fullWord'),
        value: MarketPlaceDaysFormatDisplay.DEFAULT,
      },
      {
        label: t('forms.themePersonalization.daysFormatSelector.threeLetters'),
        value: MarketPlaceDaysFormatDisplay.THREE_LETTERS,
      },
      {
        label: t('forms.themePersonalization.daysFormatSelector.oneLetter'),
        value: MarketPlaceDaysFormatDisplay.ONE_LETTER,
      },
    ],
    [t],
  );

  const daysFormatDisplayCurrent = React.useMemo(
    () =>
      daysFormatDisplayOptions.find(
        (element) => element.value === values.days_format_display,
      ),
    [daysFormatDisplayOptions, values.days_format_display],
  );

  return (
    <Form>
      <div className={classes.main}>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.bookingTitle')}
          </Typography>
          <SwitchField
            label={t('forms.themePersonalization.hiddenFromMarketplace')}
            name="show_studio_on_general_app"
          />
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={values.allow_guest}
                  disabled={
                    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                    !theme.allow_guest_activatable
                  }
                  onChange={() => {
                    values.allow_guest
                      ? setShowDialogGuest(true)
                      : setFieldValue('allow_guest', true);
                  }}
                />
              }
              label={t('forms.allowGuest.title')}
            />
            {theme.allow_guest_activatable && values.allow_guest && (
              <div className={classes.frequencyContainer}>
                <IntegerField
                  InputProps={{
                    inputProps: { min: 1, step: 1, max: 200 },
                  }}
                  name="allow_guest_max_number"
                />
                <div className={classes.frequencyText}>
                  <Typography align="left" variant="body1">
                    {t('forms.allowGuest.frequencies.text')}
                  </Typography>
                </div>
                <Select
                  className={classes.frequencySelector}
                  defaultValue={guestFrequencyOptions.find(
                    (element) => element.value === values.allow_guest_frequency,
                  )}
                  onChange={(option) =>
                    // @ts-expect-error
                    setFieldValue('allow_guest_frequency', option.value)
                  }
                  options={guestFrequencyOptions}
                  placeholder={t('forms.allowGuest.frequencies.placeholder')}
                />
              </div>
            )}
            {showDialogGuest && (
              <Dialog open={showDialogGuest}>
                <DialogTitle>
                  {t('forms.allowGuest.dialog.dialogTitle')}
                </DialogTitle>
                <DialogContent>
                  <div className={classes.dialogContent}>
                    <div className={classes.dialogIconContainer}>
                      <ErrorOutlineIcon color="error" />
                    </div>
                    <Typography align="left" variant="body1">
                      {t('forms.allowGuest.dialog.dialogContent')}
                    </Typography>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowDialogGuest(false)}>
                    {t('forms.allowGuest.dialog.dialogButtonCancel')}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDialogGuest(false);
                      setFieldValue('allow_guest', false);
                    }}
                    style={{ color: 'red' }}
                  >
                    {t('forms.allowGuest.dialog.dialogButtonConfirm')}
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </div>

          <SwitchField
            label={t('forms.themePersonalization.hideBuyablePassIfSuperfluous')}
            name="hide_unnecessary_compatible_purchase_method"
          />

          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={values.basket_expiration_days > 0}
                  onChange={() => {
                    setFieldValue(
                      'basket_expiration_days',
                      values.basket_expiration_days ? 0 : 10,
                    );
                  }}
                />
              }
              label={t(
                'forms.themePersonalization.basket_expiration_days.label',
              )}
            />
            {values.basket_expiration_days > 0 && (
              <div className={classes.borderLeft}>
                <IntegerField
                  disabled={values.basket_expiration_days === 0}
                  helperText={t(
                    'forms.themePersonalization.basket_expiration_days.helperText',
                  )}
                  InputProps={{
                    inputProps: { min: 1, step: 1, max: 100 },
                  }}
                  label={t(
                    'forms.themePersonalization.basket_expiration_days.placeholder',
                  )}
                  name="basket_expiration_days"
                />
              </div>
            )}
          </div>
          <div>
            <Typography className={classes.radioLabel}>
              {t('forms.themePersonalization.default_booking_ordering.title')}
            </Typography>
            <div className={classes.borderLeft}>
              <RadioGroupField
                choices={[
                  {
                    label: t(
                      'forms.themePersonalization.default_booking_ordering.date',
                    ),
                    value: BOOKING_DATE_ORDER,
                  },
                  {
                    label: t(
                      'forms.themePersonalization.default_booking_ordering.firstname',
                    ),
                    value: BOOKING_FIRSTNAME_ORDER,
                  },
                  {
                    label: t(
                      'forms.themePersonalization.default_booking_ordering.lastname',
                    ),
                    value: BOOKING_LASTNAME_ORDER,
                  },
                ]}
                name="default_booking_ordering"
              />
            </div>
          </div>
        </div>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.bookingLimitation')}
          </Typography>
          <FeatureListProvider>
            {(featureList: FeatureList) => (
              <>
                <SwitchField
                  disabled={hasUpsell(featureList, UPSELL_IDENTIFIER_SPIVI)}
                  label={t(
                    'forms.themePersonalization.acceptDoubleBookingMetaActivity',
                  )}
                  name="accept_double_booking"
                />
                <SwitchField
                  disabled={hasUpsell(featureList, UPSELL_IDENTIFIER_SPIVI)}
                  label={t(
                    'forms.themePersonalization.acceptDoubleBookingWorkshop',
                  )}
                  name="accept_double_booking_workshop"
                />
                {hasUpsell(featureList, UPSELL_IDENTIFIER_SPIVI) && (
                  <Typography color="textSecondary" variant="caption">
                    {t(
                      'forms.themePersonalization.doubleBookingDisabledWithSpivi',
                    )}
                  </Typography>
                )}
              </>
            )}
          </FeatureListProvider>

          <FormControlLabel
            control={
              <Switch
                checked={values.max_future_booking > 0}
                onChange={() => {
                  setFieldValue(
                    'max_future_booking',
                    values.max_future_booking ? 0 : 10,
                  );
                }}
              />
            }
            label={t('forms.themePersonalization.maxFutureBooking.label')}
          />
          {values.max_future_booking > 0 && (
            <div className={classes.borderLeft}>
              <div className={classes.verticalInput}>
                <IntegerField
                  helperText={t(
                    'forms.themePersonalization.maxFutureBooking.numberCheck.helperText',
                  )}
                  InputProps={{
                    inputProps: { min: 1, step: 1, max: 50 },
                  }}
                  label={t(
                    'forms.themePersonalization.maxFutureBooking.numberCheck.placeholder',
                  )}
                  name="max_future_booking"
                />
              </div>
            </div>
          )}
          <FormControlLabel
            control={
              <Switch
                checked={values.max_future_workshop > 0}
                onChange={() => {
                  setFieldValue(
                    'max_future_workshop',
                    values.max_future_workshop ? 0 : 10,
                  );
                }}
              />
            }
            label={t('forms.themePersonalization.maxFutureWorkshop.label')}
          />
          {values.max_future_workshop > 0 && (
            <div className={classes.borderLeft}>
              <div className={classes.verticalInput}>
                <IntegerField
                  helperText={t(
                    'forms.themePersonalization.maxFutureWorkshop.numberCheck.helperText',
                  )}
                  InputProps={{
                    inputProps: { min: 1, step: 1, max: 50 },
                  }}
                  label={t(
                    'forms.themePersonalization.maxFutureWorkshop.numberCheck.placeholder',
                  )}
                  name="max_future_workshop"
                />
              </div>
            </div>
          )}
          <SwitchField
            disabled={
              !(values.max_future_booking || values.max_future_workshop)
            }
            helperText={t(
              'forms.themePersonalization.waitingListAccountsForMaxFutureBookings.helperText',
            )}
            label={t(
              'forms.themePersonalization.waitingListAccountsForMaxFutureBookings.label',
            )}
            name="booking_option_included_in_max_future_booking"
          />
        </div>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.attendanceTitle')}
          </Typography>
          <SwitchField
            label={t('forms.themePersonalization.coach_can_edit_attendance')}
            name="coach_can_edit_attendance"
          />
          <div>
            <Typography className={classes.radioLabel}>
              {t('forms.themePersonalization.default_attendance.title')}
            </Typography>
            <div className={classes.borderLeft}>
              <RadioGroupField
                choices={[
                  {
                    label: t(
                      'forms.themePersonalization.default_attendance.missing',
                    ),
                    value: false,
                  },
                  {
                    label: t(
                      'forms.themePersonalization.default_attendance.present',
                    ),
                    value: true,
                  },
                ]}
                name="default_attendance"
              />
            </div>
          </div>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.noShow.title')}
          </Typography>
          {theme.is_roll_call_mandatory ? (
            <div>
              <Alert className={classes.alert} severity="info">
                {t('forms.themePersonalization.noShow.alert')}
              </Alert>

              <Typography className={classes.textWithInput}>
                <Trans
                  components={[
                    <TextField
                      className={classes.numberTextField}
                      InputProps={{
                        inputProps: {
                          min: 0,
                        },
                      }}
                      name="no_show_validated_time"
                      type="number"
                    />,
                    <HoursDaysIntervalRecurrenceSelectField
                      displayPeriod
                      className={classes.intervalSelectorField}
                      name="no_show_validated_interval"
                      variant="outlined"
                    />,
                  ]}
                  i18nKey="forms.themePersonalization.noShow.daysBeforeNoShow"
                  t={t}
                />
              </Typography>
              <Typography color="textSecondary" variant="caption">
                {t(
                  'forms.themePersonalization.noShow.daysBeforeNoShowHelpText',
                )}
              </Typography>
              {errors?.no_show_validated_time && (
                <Alert className={classes.alert} severity="error">
                  {t(errors.no_show_validated_time)}
                </Alert>
              )}
              <Typography className={classes.textWithInput}>
                <Trans
                  components={[
                    <TextField
                      className={classes.numberTextField}
                      InputProps={{
                        inputProps: {
                          min: 0,
                        },
                      }}
                      name="no_show_email_time"
                      type="number"
                    />,
                    <HoursDaysIntervalRecurrenceSelectField
                      displayPeriod
                      className={classes.intervalSelectorField}
                      name="no_show_email_interval"
                      variant="outlined"
                    />,
                  ]}
                  i18nKey="forms.themePersonalization.noShow.sendMail"
                  t={t}
                />
              </Typography>
              <Typography color="textSecondary" variant="caption">
                {t('forms.themePersonalization.noShow.sendMailHelpText')}
              </Typography>
              {errors?.no_show_email_time && (
                <Alert className={classes.alert} severity="error">
                  {t(errors.no_show_email_time)}
                </Alert>
              )}
            </div>
          ) : (
            <Alert className={classes.alert} severity="info">
              {t('forms.themePersonalization.noShow.notAvailable')}
            </Alert>
          )}
        </div>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.subscriptionPersonalizationTitle')}
          </Typography>
          <div className={classes.horizontalGroup}>
            <SwitchField
              disabled={theme.franchisor}
              label={t(
                'forms.themePersonalization.displayStopSubscriptionFromMemberSide.label',
              )}
              name="display_stop_subscription_from_member_side"
              onChange={handleOnChangeStopSubscription}
            />
            <a
              className={classes.link}
              href={getIntercomLink('stopSubscriptionOnMemberSide')}
              rel="noreferrer"
              target="_blank"
            >
              <HelpOutlineIcon />
            </a>
          </div>
          <FormHelperText>
            <div>
              {t(
                'forms.themePersonalization.displayStopSubscriptionFromMemberSide.helperText.simple',
              )}
            </div>
            <div>
              {t(
                'forms.themePersonalization.displayStopSubscriptionFromMemberSide.helperText.lawCompliance',
              )}
            </div>
            <div>
              {theme.franchisor &&
                t(
                  'forms.themePersonalization.displayStopSubscriptionFromMemberSide.helperText.disabled',
                )}
            </div>
          </FormHelperText>
        </div>
        <StopSubscriptionInfoModal
          link={getIntercomLink('stopSubscriptionOnMemberSide')}
          onClose={handleCancelSwitchStopSubscription}
          onValidate={handleValidateSwitchStopSubscription}
          open={isStopSubscriptionModalOpen}
        />

        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.calendarPersonalizationTitle')}
          </Typography>
          <SwitchField
            label={t('forms.themePersonalization.offersFilling')}
            name="show_offers_filling"
          />

          <SwitchField
            label={t('forms.themePersonalization.cancelledOffersCustomer')}
            name="show_cancelled_offers_customer"
          />
          <SwitchField
            label={t('forms.themePersonalization.showPastSessionsCalendar')}
            name="show_past_sessions_calendar"
          />
          <SwitchField
            label={t('forms.themePersonalization.startWeekOnToday')}
            name="start_calendar_week_on_today"
          />
          <SwitchField
            label={t('forms.themePersonalization.hideCoach')}
            name="hideCoach"
          />
          <div className={classes.selector}>
            <InputLabel shrink>
              {t('forms.themePersonalization.coachDisplayOptions.label')}
            </InputLabel>
            <Select
              isDisabled={values.hideCoach}
              name="coach_display"
              onChange={handleOnChangeCoachDisplay}
              options={coachDisplayOptions}
              placeholder={t(
                'forms.themePersonalization.coachDisplayOptions.showCoachFullNameWithPicture',
              )}
              value={coachDisplayCurrent}
              variant="outlined"
            />
          </div>
          <SwitchField
            label={t('forms.themePersonalization.cancelledOffersManager')}
            name="show_cancelled_offers_manager"
          />
          <SwitchField
            label={t('forms.themePersonalization.hideMemberForCoach')}
            name="hide_member_details_in_app_private_booking_for_coach"
          />
          <SwitchField
            label={t('forms.themePersonalization.workshopsCustomer')}
            name="show_workshops_customer"
          />
          <SwitchField
            label={t(
              'forms.themePersonalization.hideSessionWithTagsNotEligible',
            )}
            name="hide_sessions_with_tags_when_not_eligible"
          />
          <SwitchField
            label={t('forms.themePersonalization.showGenderOffer')}
            name="show_booked_gender_offer"
          />
          <SwitchField
            label={t('forms.themePersonalization.showEstablishment')}
            name="show_establishment"
          />
          <SwitchField
            label={t('forms.themePersonalization.showLevel')}
            name="show_level"
          />
          <SwitchField
            label={t('forms.themePersonalization.showActivityColor')}
            name="show_activity_color"
          />
          <SwitchField
            label={t('forms.themePersonalization.showFreeSessionLabel')}
            name="show_free_session_label"
          />
          <SwitchField
            label={t('forms.themePersonalization.displayActivityPrice')}
            name="display_credit_price_for_offer"
          />
          <SwitchField
            label={t('forms.themePersonalization.hideBookButton.switchLabel', {
              bookButtonTranslation: t(
                'translation:marketplace.bookButton.book',
              ),
            })}
            name="hide_book_button"
          />
          <div className={classes.selector}>
            <InputLabel shrink>
              {t('forms.themePersonalization.sessionDatesDisplayOptions.label')}
            </InputLabel>
            <Select
              name="session_time_display"
              onChange={handleOnChangeSessionTimeDisplay}
              options={sessionDatesDisplayOptions}
              placeholder={t(
                'forms.themePersonalization.sessionDatesDisplayOptions.showEndingTime',
              )}
              value={sessionDatesDisplayCurrent}
            />
          </div>
          <div className={classes.selector}>
            <InputLabel shrink>
              {t('forms.themePersonalization.daysFormatSelector.label')}
            </InputLabel>
            <Select
              name="days_format_display"
              onChange={handleOnChangeDayFormatDisplay}
              options={daysFormatDisplayOptions}
              placeholder={t(
                'forms.themePersonalization.daysFormatSelector.fullWord',
              )}
              value={daysFormatDisplayCurrent}
            />
          </div>
        </div>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.schedule.title')}
          </Typography>
          <div>
            <FormControlLabel
              control={
                <div className={classes.timeField}>
                  <TimeField name="schedule_timerange_begin" />
                </div>
              }
              label={t('forms.themePersonalization.schedule.begin')}
              labelPlacement="start"
            />
          </div>
          <div>
            <FormControlLabel
              control={
                <div className={classes.timeField}>
                  <TimeField name="schedule_timerange_end" />
                </div>
              }
              label={t('forms.themePersonalization.schedule.end')}
              labelPlacement="start"
            />
          </div>
          {errors?.schedule_timerange_end && (
            <Typography className={classes.error}>
              {t('forms.themePersonalization.schedule.alert')}
            </Typography>
          )}
        </div>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.offerBalance')}
          </Typography>
          <SwitchField
            label={t('forms.themePersonalization.checkBalance.checkbox')}
            name="is_checking_balance"
          />
          {values.is_checking_balance && (
            <div className={classes.borderLeft}>
              <div className={classes.verticalInput}>
                <IntegerField
                  helperText={t(
                    'forms.themePersonalization.checkBalance.numberCheck.helperText',
                  )}
                  InputProps={{
                    inputProps: { min: 2, step: 1, max: 10 },
                  }}
                  label={t(
                    'forms.themePersonalization.checkBalance.numberCheck.placeholder',
                    { number: values.nb_to_check_balance },
                  )}
                  name="nb_to_check_balance"
                />
              </div>
              <div className={classes.verticalInput}>
                <IntegerField
                  fullWidth
                  InputProps={{
                    inputProps: { min: 1, step: 1, max: 10 },
                  }}
                  label={t(
                    'forms.themePersonalization.checkBalance.shiftRatio.placeholder',
                  )}
                  name="gender_max_shift_for_booking"
                />
              </div>
              <Typography variant="body2">
                {t(
                  'forms.themePersonalization.checkBalance.shiftRatio.explain',
                  {
                    numberCheck: values.nb_to_check_balance,
                    gender_max_shift_for_booking:
                      values.gender_max_shift_for_booking,
                  },
                )}
              </Typography>
            </div>
          )}
          <div className={classes.section} id="express-checkout">
            <Typography className={classes.namesHeader}>
              {t('forms.themePersonalization.expressCheckout.title')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={values.one_click_checkout_enabled}
                  onChange={(event) => {
                    if (
                      event.target.checked &&
                      values.requires_email_confirmation_when_signing_up
                    ) {
                      setFieldValue(
                        'requires_email_confirmation_when_signing_up',
                        false,
                      );
                    }
                    setFieldValue(
                      'one_click_checkout_enabled',
                      event.target.checked,
                    );
                  }}
                />
              }
              label={t(
                'forms.themePersonalization.expressCheckout.oneClickBooking.label',
              )}
            />
            <Typography color="textSecondary" variant="caption">
              {t(
                'forms.themePersonalization.expressCheckout.oneClickBooking.helperText',
              )}
            </Typography>
          </div>
          <div className={classes.section}>
            <Typography className={classes.namesHeader}>
              {t('forms.themePersonalization.signup.title')}
            </Typography>
            <div className={classes.fieldWithHelperText}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.requires_email_confirmation_when_signing_up}
                    onChange={(event) => {
                      if (
                        event.target.checked &&
                        values.one_click_checkout_enabled
                      ) {
                        setFieldValue('one_click_checkout_enabled', false);
                      }
                      setFieldValue(
                        'requires_email_confirmation_when_signing_up',
                        event.target.checked,
                      );
                    }}
                  />
                }
                label={t(
                  'forms.themePersonalization.signup.emailConfirmationAtSignUp.label',
                )}
              />
              <Typography color="textSecondary" variant="caption">
                {t(
                  'forms.themePersonalization.signup.emailConfirmationAtSignUp.helperText',
                )}
              </Typography>
            </div>
            {values.requires_email_confirmation_when_signing_up && (
              <div className={classes.textFieldWithHelperText}>
                <TextField
                  className={classes.textField}
                  name="confirm_email_url_redirection"
                  placeholder={t(
                    'forms.themePersonalization.signup.urlRedirection',
                  )}
                  size="small"
                  variant="outlined"
                />
                {errors?.confirm_email_url_redirection && (
                  <Typography
                    className={clsx(classes.error, classes.helperText)}
                  >
                    {t('forms.themePersonalization.signup.urlError')}
                  </Typography>
                )}
                <Typography
                  className={classes.helperText}
                  color="textSecondary"
                  variant="caption"
                >
                  {t('forms.themePersonalization.signup.urlHelperText')}
                </Typography>
              </div>
            )}
          </div>
          {showMarketingDoubleOptInSetting && (
            <div className={classes.section}>
              <Typography className={classes.namesHeader}>
                {t('b2b_theme:personalization.marketing.title')}
              </Typography>
              <div className={classes.fieldWithHelperText}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.is_marketing_double_opt_in_enabled}
                      onChange={(event) => {
                        setFieldValue(
                          'is_marketing_double_opt_in_enabled',
                          event.target.checked,
                        );
                      }}
                    />
                  }
                  label={t(
                    'b2b_theme:personalization.marketing.form.doubleOptIn.label',
                  )}
                />
                <Typography color="textSecondary" variant="caption">
                  {t(
                    'b2b_theme:personalization.marketing.form.doubleOptIn.description',
                  )}
                </Typography>
              </div>
            </div>
          )}
          <div className={classes.section}>
            <Typography className={classes.namesHeader}>
              {t('forms.themePersonalization.resetPassword.title')}
            </Typography>
            {/* @ts-expect-error */}
            <Typography className={classes.container}>
              {t('forms.themePersonalization.resetPassword.helperText')}
            </Typography>
            <div className={classes.textFieldWithHelperText}>
              <TextField
                className={classes.textField}
                name="reset_password_url_redirection"
                placeholder={t(
                  'forms.themePersonalization.resetPassword.urlRedirection',
                )}
                size="small"
                variant="outlined"
              />
              {errors?.reset_password_url_redirection && (
                <Typography className={clsx(classes.error, classes.helperText)}>
                  {t('forms.themePersonalization.resetPassword.urlError')}
                </Typography>
              )}
              <Typography
                className={classes.helperText}
                color="textSecondary"
                variant="caption"
              >
                {t('forms.themePersonalization.resetPassword.urlHelperText')}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <Button
        className={classes.confirm}
        color="primary"
        disabled={isSubmitting || !isValid}
        onClick={() => handleSubmit()}
        variant="contained"
      >
        {t('forms.submit')}
      </Button>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  namesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: `${theme.spacing(2)}px 0`,
  },
  radioLabel: {
    marginTop: theme.spacing(2),
    fontSize: 16,
  },
  link: {
    textDecoration: 'none',
    display: 'flex',
    color: 'black',
    '&:focus, &:hover, &:visited, &:link, &:active': {
      textDecoration: 'none',
      color: 'black',
    },
  },
  horizontalGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.palette.text.primary,
  },
  horizontalInput: {
    marginRight: theme.spacing(3),
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderColor: theme.palette.primary.main,
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  verticalInput: {
    marginBottom: theme.spacing(2),
  },
  timeField: {
    marginLeft: theme.spacing(4),
  },
  error: {
    color: theme.palette.error.main,
  },
  confirm: {
    marginTop: theme.spacing(2),
  },
  dialogContent: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    border: 'solid 1px red',
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogIconContainer: {
    marginRight: theme.spacing(3),
  },
  frequencyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing(4),
  },
  frequencySelector: {
    textAlign: 'left',
    width: 180,
  },
  frequencyText: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  fieldWithHelperText: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  textFieldWithHelperText: {
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    width: '400px',
    paddingBottom: theme.spacing(1),
  },
  helperText: {
    marginLeft: theme.spacing(2),
  },
  numberTextField: {
    width: theme.spacing(5),
    marginTop: -theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  intervalSelectorField: {
    height: theme.spacing(5),
    marginTop: -theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
  },
  textWithInput: {
    marginTop: theme.spacing(3),
  },
  selector: {
    width: '50%',
  },
}));

const ThemePersonalizeFormSchema = Yup.object().shape({
  show_offers_filling: Yup.boolean().required(),
  accept_double_booking: Yup.boolean().required(),
  accept_double_booking_workshop: Yup.boolean().required(),
  show_studio_on_general_app: Yup.boolean().required(),
  coach_can_edit_attendance: Yup.boolean().required(),
  default_attendance: Yup.boolean().required(),
  show_cancelled_offers_manager: Yup.boolean().required(),
  display_stop_subscription_from_member_side: Yup.boolean().required(),
  show_cancelled_offers_customer: Yup.boolean().required(),
  hideCoach: Yup.boolean().required(),
  show_workshops_customer: Yup.boolean().required(),
  show_booked_gender_offer: Yup.boolean().required(),
  is_checking_balance: Yup.boolean().required(),
  hide_member_details_in_app_private_booking_for_coach:
    Yup.boolean().required(),
  allow_guest: Yup.boolean().required(),

  gender_max_shift_for_booking: Yup.number().required(),
  max_future_booking: Yup.number().required(),
  max_future_workshop: Yup.number().required(),
  booking_option_included_in_max_future_booking: Yup.boolean().required(),
  basket_expiration_days: Yup.number().required(),
  nb_to_check_balance: Yup.number().required(),
  allow_guest_max_number: Yup.number().required(),

  allow_guest_frequency: Yup.string().required(),
  default_booking_ordering: Yup.string().required(),
  schedule_timerange_begin: Yup.string().required(),
  schedule_timerange_end: Yup.string().test(
    'is-after-start',
    'errors.end_before_start',
    function checkIsAfterStart(schedule_timerange_end) {
      const { schedule_timerange_begin } = this.parent;
      const getMinutes = (date: string) => {
        const dateTime = DateTime.fromISO(date);
        return dateTime.hour * 60 + dateTime.minute;
      };

      return (
        getMinutes(schedule_timerange_begin) <
        getMinutes(schedule_timerange_end)
      );
    },
  ),
  requires_email_confirmation_when_signing_up: Yup.boolean().required(),
  one_click_checkout_enabled: Yup.boolean().required(),
  confirm_email_url_redirection: Yup.string().test(
    'is-url-format',
    'forms.themePersonalization.signup.urlError',
    (val) => {
      if (!val || regexHTTP.test(val)) return true;
      return false;
    },
  ),
  reset_password_url_redirection: Yup.string().test(
    'is-url-format',
    'forms.themePersonalization.resetPassword.urlError',
    (val) => {
      return !val || regexHTTP.test(val);
    },
  ),
  no_show_validated_time: Yup.number()
    .min(0)
    .when('is_roll_call_mandatory', {
      is: true,
      then: Yup.number()
        .min(0, 'forms.themePersonalization.noShow.errorValidatedTime')
        .required(),
    }),
  no_show_email_time: Yup.number()
    .min(0)
    .when('is_roll_call_mandatory', {
      is: true,
      then: Yup.number()
        .min(0, 'forms.themePersonalization.noShow.errorEmailTime')
        .required()
        .test(
          'is-before-no-show',
          'forms.themePersonalization.noShow.error',
          function checkIsAfterNoShow() {
            let no_show_validated_time_hour =
              this.parent.no_show_validated_time;
            if (this.parent.no_show_validated_interval === 'day') {
              no_show_validated_time_hour *= 24;
            }
            let no_show_email_time_hour = this.parent.no_show_email_time;
            if (this.parent.no_show_email_interval === 'day') {
              no_show_email_time_hour *= 24;
            }
            if (no_show_validated_time_hour > no_show_email_time_hour) {
              return true;
            }

            return false;
          },
        ),
    }),
  no_show_validated_interval: Yup.string().when('is_roll_call_mandatory', {
    is: true,
    then: Yup.string().required(),
  }),
  no_show_email_interval: Yup.string().when('is_roll_call_mandatory', {
    is: true,
    then: Yup.string().required(),
  }),
  show_establishment: Yup.boolean().required(),
  show_level: Yup.boolean().required(),
  show_activity_color: Yup.boolean().required(),
  session_time_display: Yup.number().required(),
  coach_display: Yup.number().required(),
  days_format_display: Yup.number().required(),
  show_free_session_label: Yup.boolean().required(),
  display_credit_price_for_offer: Yup.boolean().required(),
  hide_book_button: Yup.boolean().required(),
  show_past_sessions_calendar: Yup.boolean().required(),
  start_calendar_week_on_today: Yup.boolean().required(),
  is_marketing_double_opt_in_enabled: Yup.boolean().required(),
});

const ThemePersonalizeFormFormikHOC = withFormik<Props, FormikValues>({
  // @ts-expect-error
  mapPropsToValues: ({ theme }) => {
    const defaulScheduletBegin = DateTime.now().set({ hour: 6 }).toISO();
    const defaultScheduleEnd = DateTime.now().set({ hour: 23 }).toISO();

    let initial_no_show_validated_time =
      theme?.no_show_validated_number_of_hours;
    let initial_no_show_validated_interval = 'hour';
    if (
      initial_no_show_validated_time &&
      initial_no_show_validated_time % 24 === 0
    ) {
      initial_no_show_validated_interval = 'day';
      initial_no_show_validated_time /= 24;
    }

    let initial_no_show_email_time = theme?.no_show_email_sent_number_of_hours;
    let initial_no_show_email_interval = 'hour';
    if (initial_no_show_email_time && initial_no_show_email_time % 24 === 0) {
      initial_no_show_email_interval = 'day';
      initial_no_show_email_time /= 24;
    }

    if (theme) {
      return {
        show_offers_filling: theme.show_offers_filling,
        accept_double_booking: theme.accept_double_booking,
        accept_double_booking_workshop: theme.accept_double_booking_workshop,
        allow_guest: theme.allow_guest,
        allow_guest_frequency: theme.allow_guest_frequency,
        allow_guest_max_number: theme.allow_guest_max_number,
        hide_unnecessary_compatible_purchase_method:
          theme.hide_unnecessary_compatible_purchase_method,
        show_studio_on_general_app: !theme.hidden_from_marketplace,
        coach_can_edit_attendance: theme.coach_can_edit_attendance,
        default_attendance: theme.default_attendance,
        show_cancelled_offers_manager: theme.show_cancelled_offers_manager,
        display_stop_subscription_from_member_side:
          theme.display_stop_subscription_from_member_side,
        show_cancelled_offers_customer: theme.show_cancelled_offers_customer,
        hideCoach: theme.hideCoach,
        show_workshops_customer: theme.show_workshops_customer,
        show_booked_gender_offer: theme.show_booked_gender_offer,
        is_checking_balance: theme.is_checking_balance,
        hide_member_details_in_app_private_booking_for_coach:
          theme.hide_member_details_in_app_private_booking_for_coach,
        gender_max_shift_for_booking: theme.gender_max_shift_for_booking,
        max_future_booking: theme.max_future_booking,
        // @ts-expect-error
        max_future_workshop: theme.max_future_workshop,
        booking_option_included_in_max_future_booking:
          // @ts-expect-error
          theme.booking_option_included_in_max_future_booking,
        default_booking_ordering: theme.default_booking_ordering,
        basket_expiration_days: theme.basket_expiration_days,
        nb_to_check_balance: theme.nb_to_check_balance,
        schedule_timerange_begin:
          theme.schedule_timerange_begin !== ''
            ? DateTime.fromFormat(
                theme.schedule_timerange_begin,
                'yyyy-MM-dd HH:mm',
              ).toISO()
            : defaulScheduletBegin,
        schedule_timerange_end:
          theme.schedule_timerange_end !== ''
            ? DateTime.fromFormat(
                theme.schedule_timerange_end,
                'yyyy-MM-dd HH:mm',
              ).toISO()
            : defaultScheduleEnd,
        hide_sessions_with_tags_when_not_eligible:
          theme.hide_sessions_with_tags_when_not_eligible,
        requires_email_confirmation_when_signing_up:
          theme.requires_email_confirmation_when_signing_up,
        confirm_email_url_redirection: theme.confirm_email_url_redirection,
        reset_password_url_redirection: theme.reset_password_url_redirection,
        is_roll_call_mandatory: theme.is_roll_call_mandatory,
        no_show_validated_time: initial_no_show_validated_time,
        no_show_validated_interval: initial_no_show_validated_interval,
        no_show_email_time: initial_no_show_email_time,
        no_show_email_interval: initial_no_show_email_interval,
        show_establishment: theme.show_establishment,
        show_level: theme.show_level,
        show_activity_color: theme.show_activity_color,
        session_time_display: theme.session_time_display,
        coach_display: theme.coach_display,
        days_format_display: theme.days_format_display,
        show_free_session_label: theme.show_free_session_label,
        hide_book_button: theme.hide_book_button,
        show_past_sessions_calendar: theme.show_past_sessions_calendar,
        // @ts-expect-error
        start_calendar_week_on_today: theme.start_calendar_week_on_today,
        display_credit_price_for_offer: theme.display_credit_price_for_offer,
        one_click_checkout_enabled: theme.one_click_checkout_enabled,
        is_marketing_double_opt_in_enabled:
          theme.is_marketing_double_opt_in_enabled,
      };
    }
    return {
      show_offers_filling: false,
      accept_double_booking: false,
      accept_double_booking_workshop: false,
      allow_guest: true,
      allow_guest_frequency: 'week',
      allow_guest_max_number: 1,
      hide_unnecessary_compatible_purchase_method: false,

      show_studio_on_general_app: true,
      coach_can_edit_attendance: false,
      default_attendance: false,
      show_cancelled_offers_manager: false,
      display_stop_subscription_from_member_side: false,
      show_cancelled_offers_customer: false,
      hideCoach: false,
      show_workshops_customer: false,
      show_booked_gender_offer: false,
      is_checking_balance: false,
      hide_member_details_in_app_private_booking_for_coach: false,

      gender_max_shift_for_booking: 0,
      max_future_booking: 0,
      max_future_workshop: 0,
      booking_option_included_in_max_future_booking: false,
      default_booking_ordering: BOOKING_DATE_ORDER,
      basket_expiration_days: 0,
      nb_to_check_balance: 0,

      hide_sessions_with_tags_when_not_eligible: true,
      schedule_timerange_begin: defaulScheduletBegin,
      schedule_timerange_end: defaultScheduleEnd,
      requires_email_confirmation_when_signing_up: false,
      confirm_email_url_redirection: '',
      reset_password_url_redirection: '',
      show_establishment: true,
      show_level: true,
      show_activity_color: true,
      session_time_display: MarketPlaceSessionTimeDisplay.DEFAULT,
      coach_display: MarketPlaceCoachDisplay.DEFAULT,
      days_format_display: MarketPlaceDaysFormatDisplay.DEFAULT,
      show_free_session_label: false,
      hide_book_button: false,
      show_past_sessions_calendar: true,
      start_calendar_week_on_today: false,
      display_credit_price_for_offer: false,
      one_click_checkout_enabled: false,
      is_marketing_double_opt_in_enabled: false,
    };
  },
  validationSchema: ThemePersonalizeFormSchema,
  handleSubmit: (values, { props: { onSubmit, theme }, setSubmitting }) => {
    const data = new FormData();
    const keys: (keyof FormikValues)[] = [
      'show_offers_filling',
      'accept_double_booking',
      'accept_double_booking_workshop',
      'allow_guest',
      'allow_guest_frequency',
      'allow_guest_max_number',
      'show_studio_on_general_app',
      'max_future_booking',
      'max_future_workshop',
      'booking_option_included_in_max_future_booking',
      'default_booking_ordering',
      'coach_can_edit_attendance',
      'default_attendance',
      'show_cancelled_offers_customer',
      'hideCoach',
      'show_cancelled_offers_manager',
      'display_stop_subscription_from_member_side',
      'hide_member_details_in_app_private_booking_for_coach',
      'show_workshops_customer',
      'basket_expiration_days',
      'show_booked_gender_offer',
      'is_checking_balance',
      'nb_to_check_balance',
      'gender_max_shift_for_booking',
      'schedule_timerange_begin',
      'schedule_timerange_end',
      'hide_unnecessary_compatible_purchase_method',
      'hide_sessions_with_tags_when_not_eligible',
      'requires_email_confirmation_when_signing_up',
      'confirm_email_url_redirection',
      'reset_password_url_redirection',
      'no_show_validated_time',
      'no_show_email_time',
      'show_establishment',
      'show_level',
      'show_activity_color',
      'session_time_display',
      'coach_display',
      'days_format_display',
      'show_free_session_label',
      'display_credit_price_for_offer',
      'hide_book_button',
      'show_past_sessions_calendar',
      // @ts-expect-error
      'start_calendar_week_on_today',
      'one_click_checkout_enabled',
      'is_marketing_double_opt_in_enabled',
    ];
    keys.forEach((key) => {
      if (key === 'show_studio_on_general_app') {
        // @ts-expect-error
        data.append('hidden_from_marketplace', !values[key]);
      } else if (key === 'no_show_validated_time') {
        if (theme.is_roll_call_mandatory) {
          let no_show_validated_number_of_hours = values[key];
          if (values.no_show_validated_interval === 'day') {
            no_show_validated_number_of_hours *= 24;
          }
          data.append(
            'no_show_validated_number_of_hours',
            no_show_validated_number_of_hours.toString(),
          );
        } else {
          data.append('no_show_validated_number_of_hours', '1');
        }
      } else if (key === 'no_show_email_time') {
        if (theme.is_roll_call_mandatory) {
          let no_show_email_sent_number_of_hours = values[key];
          if (values.no_show_email_interval === 'day') {
            no_show_email_sent_number_of_hours *= 24;
          }
          data.append(
            'no_show_email_sent_number_of_hours',
            no_show_email_sent_number_of_hours.toString(),
          );
        } else {
          data.append('no_show_email_sent_number_of_hours', '0');
        }
      } else if (key === 'display_stop_subscription_from_member_side') {
        // While display_stop_subscription_from_member_side is a backend property managing the franchisor case
        // the real database field to update is stop_subscription_from_member_side_enabled
        data.append(
          'stop_subscription_from_member_side_enabled',
          values[key] ? '1' : '0',
        );
      } else {
        // @ts-expect-error
        data.append(key, values[key]);
      }
    });
    onSubmit(theme.company, data, {
      onSuccess: () => setSubmitting(false),
      onError: () => {
        setSubmitting(false);
      },
    });
  },
});

export default ThemePersonalizeFormFormikHOC(ThemePersonalizeForm);
