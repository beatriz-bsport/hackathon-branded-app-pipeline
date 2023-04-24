// @ts-nocheck
import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import moment from 'moment-timezone';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';

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
} from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import {
  BOOKING_DATE_ORDER,
  BOOKING_FIRSTNAME_ORDER,
  BOOKING_LASTNAME_ORDER,
} from '@bsport/common/lib/master-data/settings';
import classNames from 'classnames';
import { Alert } from '@material-ui/lab';
import Config from '../../../config';

import { OptionCallback } from '../../../state/types';
import type { CompanyTheme } from '../types';
import {
  IntegerField,
  RadioGroupField,
  TimeField,
  TextField,
  SwitchField,
  HoursDaysIntervalRecurrenceSelectField,
} from '#components/forms';

interface FormikValues {
  show_offers_filling: boolean;
  accept_double_booking: boolean;
  allow_guest: boolean;
  allow_guest_max_number: number;
  allow_guest_frequency: string;
  hide_unnecessary_compatible_purchase_method: boolean;
  show_studio_on_general_app: boolean;
  coach_can_edit_attendance: boolean;
  default_attendance: boolean;
  show_cancelled_offers_manager: boolean;
  show_cancelled_offers_customer: boolean;
  hideCoach: boolean;
  show_workshops_customer: boolean;
  show_booked_gender_offer: boolean;
  is_checking_balance: boolean;
  hide_member_details_in_app_private_booking_for_coach: boolean;
  gender_max_shift_for_booking: number;
  max_future_booking: number;
  basket_expiration_days: number;
  nb_to_check_balance: number;
  default_booking_ordering: string;
  schedule_timerange_begin: string;
  schedule_timerange_end: string;
  hide_sessions_with_tags_when_not_eligible: boolean;
  requires_email_confirmation_when_signing_up: boolean;
  confirm_email_url_redirection: boolean;
  is_roll_call_mandatory: boolean;
  no_show_validated_time: number;
  no_show_email_time: number;
  no_show_validated_interval: string;
  no_show_email_interval: string;
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
  theme,
}) => {
  const { t } = useTranslation(['theme']);
  const classes = useStyles();

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
  return (
    <Form>
      <div className={classes.main}>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.bookingTitle')}
          </Typography>
          <SwitchField
            name="show_studio_on_general_app"
            label={t('forms.themePersonalization.hiddenFromMarketplace')}
          />
          <SwitchField
            name="accept_double_booking"
            label={t('forms.themePersonalization.acceptDoubleBooking')}
          />
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={values.allow_guest}
                  onChange={() => {
                    values.allow_guest
                      ? setShowDialogGuest(true)
                      : setFieldValue('allow_guest', true);
                  }}
                  disabled={
                    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                    !theme.allow_guest_activatable
                  }
                />
              }
              label={t('forms.allowGuest.title')}
            />
            {theme.allow_guest_activatable && values.allow_guest && (
              <div className={classes.frequencyContainer}>
                <IntegerField
                  name="allow_guest_max_number"
                  InputProps={{
                    inputProps: { min: 1, step: 1, max: 200 },
                  }}
                />
                <div className={classes.frequencyText}>
                  <Typography variant="body1" align="left">
                    {t('forms.allowGuest.frequencies.text')}
                  </Typography>
                </div>
                <Select
                  options={guestFrequencyOptions}
                  placeholder={t('forms.allowGuest.frequencies.placeholder')}
                  className={classes.frequencySelector}
                  onChange={(option) =>
                    setFieldValue('allow_guest_frequency', option.value)
                  }
                  defaultValue={guestFrequencyOptions.find(
                    (element) => element.value === values.allow_guest_frequency,
                  )}
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
                    <Typography variant="body1" align="left">
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

          <div>
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
                    name="max_future_booking"
                    helperText={t(
                      'forms.themePersonalization.maxFutureBooking.numberCheck.helperText',
                    )}
                    label={t(
                      'forms.themePersonalization.maxFutureBooking.numberCheck.placeholder',
                    )}
                    InputProps={{
                      inputProps: { min: 1, step: 1, max: 50 },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <SwitchField
            name="hide_unnecessary_compatible_purchase_method"
            label={t('forms.themePersonalization.hideBuyablePassIfSuperfluous')}
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
                  name="basket_expiration_days"
                  helperText={t(
                    'forms.themePersonalization.basket_expiration_days.helperText',
                  )}
                  label={t(
                    'forms.themePersonalization.basket_expiration_days.placeholder',
                  )}
                  disabled={values.basket_expiration_days === 0}
                  InputProps={{
                    inputProps: { min: 1, step: 1, max: 100 },
                  }}
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
                name="default_booking_ordering"
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
              />
            </div>
          </div>
        </div>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.attendanceTitle')}
          </Typography>
          <SwitchField
            name="coach_can_edit_attendance"
            label={t('forms.themePersonalization.coach_can_edit_attendance')}
          />
          <div>
            <Typography className={classes.radioLabel}>
              {t('forms.themePersonalization.default_attendance.title')}
            </Typography>
            <div className={classes.borderLeft}>
              <RadioGroupField
                name="default_attendance"
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
              />
            </div>
          </div>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.noShow.title')}
          </Typography>
          {theme.is_roll_call_mandatory ? (
            <div>
              <Alert severity="info" className={classes.alert}>
                {t('forms.themePersonalization.noShow.alert')}
              </Alert>

              <Typography className={classes.textWithInput}>
                <Trans
                  t={t}
                  i18nKey="forms.themePersonalization.noShow.daysBeforeNoShow"
                  components={[
                    <TextField
                      name="no_show_validated_time"
                      type="number"
                      className={classes.numberTextField}
                      InputProps={{
                        inputProps: {
                          min: 0,
                        },
                      }}
                    />,
                    <HoursDaysIntervalRecurrenceSelectField
                      name="no_show_validated_interval"
                      variant="outlined"
                      displayPeriod
                      className={classes.intervalSelectorField}
                    />,
                  ]}
                />
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {t(
                  'forms.themePersonalization.noShow.daysBeforeNoShowHelpText',
                )}
              </Typography>
              {errors?.no_show_validated_time && (
                <Alert severity="error" className={classes.alert}>
                  {t(errors.no_show_validated_time)}
                </Alert>
              )}
              <Typography className={classes.textWithInput}>
                <Trans
                  t={t}
                  i18nKey="forms.themePersonalization.noShow.sendMail"
                  components={[
                    <TextField
                      name="no_show_email_time"
                      type="number"
                      className={classes.numberTextField}
                      InputProps={{
                        inputProps: {
                          min: 0,
                        },
                      }}
                    />,
                    <HoursDaysIntervalRecurrenceSelectField
                      name="no_show_email_interval"
                      variant="outlined"
                      displayPeriod
                      className={classes.intervalSelectorField}
                    />,
                  ]}
                />
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {t('forms.themePersonalization.noShow.sendMailHelpText')}
              </Typography>
              {errors?.no_show_email_time && (
                <Alert severity="error" className={classes.alert}>
                  {t(errors.no_show_email_time)}
                </Alert>
              )}
            </div>
          ) : (
            <Alert severity="info" className={classes.alert}>
              {t('forms.themePersonalization.noShow.notAvailable')}
            </Alert>
          )}
        </div>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.calendarPersonalizationTitle')}
          </Typography>
          <SwitchField
            name="show_offers_filling"
            label={t('forms.themePersonalization.offersFilling')}
          />

          <SwitchField
            name="show_cancelled_offers_customer"
            label={t('forms.themePersonalization.cancelledOffersCustomer')}
          />
          <SwitchField
            name="hideCoach"
            label={t('forms.themePersonalization.hideCoach')}
          />
          <SwitchField
            name="show_cancelled_offers_manager"
            label={t('forms.themePersonalization.cancelledOffersManager')}
          />
          <SwitchField
            name="hide_member_details_in_app_private_booking_for_coach"
            label={t('forms.themePersonalization.hideMemberForCoach')}
          />
          <SwitchField
            name="show_workshops_customer"
            label={t('forms.themePersonalization.workshopsCustomer')}
          />
          <SwitchField
            name="hide_sessions_with_tags_when_not_eligible"
            label={t(
              'forms.themePersonalization.hideSessionWithTagsNotEligible',
            )}
          />
          <SwitchField
            name="show_booked_gender_offer"
            label={t('forms.themePersonalization.showGenderOffer')}
          />
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
            name="is_checking_balance"
            label={t('forms.themePersonalization.checkBalance.checkbox')}
          />
          {values.is_checking_balance && (
            <div className={classes.borderLeft}>
              <div className={classes.verticalInput}>
                <IntegerField
                  name="nb_to_check_balance"
                  helperText={t(
                    'forms.themePersonalization.checkBalance.numberCheck.helperText',
                  )}
                  label={t(
                    'forms.themePersonalization.checkBalance.numberCheck.placeholder',
                    { number: values.nb_to_check_balance },
                  )}
                  InputProps={{
                    inputProps: { min: 2, step: 1, max: 10 },
                  }}
                />
              </div>
              <div className={classes.verticalInput}>
                <IntegerField
                  fullWidth
                  name="gender_max_shift_for_booking"
                  label={t(
                    'forms.themePersonalization.checkBalance.shiftRatio.placeholder',
                  )}
                  InputProps={{
                    inputProps: { min: 1, step: 1, max: 10 },
                  }}
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
          <div className={classes.section}>
            <Typography className={classes.namesHeader}>
              {t('forms.themePersonalization.signup.title')}
            </Typography>
            <div className={classes.fieldWithHelperText}>
              <SwitchField
                name="requires_email_confirmation_when_signing_up"
                label={t('forms.themePersonalization.signup.label')}
              />
              <Typography variant="caption" color="textSecondary">
                {t('forms.themePersonalization.signup.helperText')}
              </Typography>
            </div>
            {values.requires_email_confirmation_when_signing_up && (
              <div className={classes.textFieldWithHelperText}>
                <TextField
                  name="confirm_email_url_redirection"
                  variant="outlined"
                  size="small"
                  className={classes.textField}
                  placeholder={t(
                    'forms.themePersonalization.signup.urlRedirection',
                  )}
                />
                {errors?.confirm_email_url_redirection && (
                  <Typography
                    className={classNames(classes.error, classes.helperText)}
                  >
                    {t('forms.themePersonalization.signup.urlError')}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className={classes.helperText}
                >
                  {t('forms.themePersonalization.signup.urlHelperText')}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button
        disabled={isSubmitting || !isValid}
        variant="contained"
        color="primary"
        onClick={() => handleSubmit()}
        className={classes.confirm}
      >
        {t('forms.submit')}
      </Button>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    display: 'grid',
    gap: theme.spacing(4),
    gridTemplateColumns: 'repeat(auto-fill, minmax(700px, 1fr) ) ',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minWidth: 700,
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
}));

const ThemePersonalizeFormSchema = Yup.object().shape({
  show_offers_filling: Yup.boolean().required(),
  accept_double_booking: Yup.boolean().required(),
  show_studio_on_general_app: Yup.boolean().required(),
  coach_can_edit_attendance: Yup.boolean().required(),
  default_attendance: Yup.boolean().required(),
  show_cancelled_offers_manager: Yup.boolean().required(),
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
      const getMinutes = (date: string) =>
        moment(date).minutes() + moment(date).hours() * 60;

      return (
        getMinutes(schedule_timerange_begin) <
        getMinutes(schedule_timerange_end)
      );
    },
  ),
  requires_email_confirmation_when_signing_up: Yup.boolean().required(),
  confirm_email_url_redirection: Yup.string().test(
    'is-url-format',
    'forms.themePersonalization.signup.urlError',
    (val) => {
      if (!val || regexHTTP.test(val)) return true;
      return false;
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
});

const ThemePersonalizeFormFormikHOC = withFormik<Props, FormikValues>({
  mapPropsToValues: ({ theme }) => {
    const defaulScheduletBegin = moment()
      .hours(6)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .format();

    const defaultScheduleEnd = moment()
      .hours(23)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .format();

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
        allow_guest: theme.allow_guest,
        allow_guest_frequency: theme.allow_guest_frequency,
        allow_guest_max_number: theme.allow_guest_max_number,
        hide_unnecessary_compatible_purchase_method:
          theme.hide_unnecessary_compatible_purchase_method,
        show_studio_on_general_app: !theme.hidden_from_marketplace,
        coach_can_edit_attendance: theme.coach_can_edit_attendance,
        default_attendance: theme.default_attendance,
        show_cancelled_offers_manager: theme.show_cancelled_offers_manager,
        show_cancelled_offers_customer: theme.show_cancelled_offers_customer,
        hideCoach: theme.hideCoach,
        show_workshops_customer: theme.show_workshops_customer,
        show_booked_gender_offer: theme.show_booked_gender_offer,
        is_checking_balance: theme.is_checking_balance,
        hide_member_details_in_app_private_booking_for_coach:
          theme.hide_member_details_in_app_private_booking_for_coach,

        gender_max_shift_for_booking: theme.gender_max_shift_for_booking,
        max_future_booking: theme.max_future_booking,
        default_booking_ordering: theme.default_booking_ordering,
        basket_expiration_days: theme.basket_expiration_days,
        nb_to_check_balance: theme.nb_to_check_balance,

        schedule_timerange_begin:
          theme.schedule_timerange_begin !== ''
            ? theme.schedule_timerange_begin
            : defaulScheduletBegin,
        schedule_timerange_end:
          theme.schedule_timerange_end !== ''
            ? theme.schedule_timerange_end
            : defaultScheduleEnd,
        hide_sessions_with_tags_when_not_eligible:
          theme.hide_sessions_with_tags_when_not_eligible,
        requires_email_confirmation_when_signing_up:
          theme.requires_email_confirmation_when_signing_up,
        confirm_email_url_redirection: theme.confirm_email_url_redirection,
        is_roll_call_mandatory: theme.is_roll_call_mandatory,
        no_show_validated_time: initial_no_show_validated_time,
        no_show_validated_interval: initial_no_show_validated_interval,
        no_show_email_time: initial_no_show_email_time,
        no_show_email_interval: initial_no_show_email_interval,
      };
    }
    return {
      show_offers_filling: false,
      accept_double_booking: false,
      allow_guest: true,
      allow_guest_frequency: 'week',
      allow_guest_max_number: 1,
      hide_unnecessary_compatible_purchase_method: false,

      show_studio_on_general_app: true,
      coach_can_edit_attendance: false,
      default_attendance: false,
      show_cancelled_offers_manager: false,
      show_cancelled_offers_customer: false,
      hideCoach: false,
      show_workshops_customer: false,
      show_booked_gender_offer: false,
      is_checking_balance: false,
      hide_member_details_in_app_private_booking_for_coach: false,

      gender_max_shift_for_booking: 0,
      max_future_booking: 0,
      default_booking_ordering: BOOKING_DATE_ORDER,
      basket_expiration_days: 0,
      nb_to_check_balance: 0,

      hide_sessions_with_tags_when_not_eligible: true,
      schedule_timerange_begin: defaulScheduletBegin,
      schedule_timerange_end: defaultScheduleEnd,
      requires_email_confirmation_when_signing_up: false,
      confirm_email_url_redirection: '',
    };
  },
  validationSchema: ThemePersonalizeFormSchema,
  handleSubmit: (values, { props: { onSubmit, theme }, setSubmitting }) => {
    const data = new FormData();
    const keys: (keyof FormikValues)[] = [
      'show_offers_filling',
      'accept_double_booking',
      'allow_guest',
      'allow_guest_frequency',
      'allow_guest_max_number',
      'show_studio_on_general_app',
      'max_future_booking',
      'default_booking_ordering',
      'coach_can_edit_attendance',
      'default_attendance',
      'show_cancelled_offers_customer',
      'hideCoach',
      'show_cancelled_offers_manager',
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
      'no_show_validated_time',
      'no_show_email_time',
    ];
    keys.forEach((key) => {
      if (key === 'show_studio_on_general_app') {
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
      } else {
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
