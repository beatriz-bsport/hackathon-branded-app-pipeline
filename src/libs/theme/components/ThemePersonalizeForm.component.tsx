import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles, Switch, Theme } from '@material-ui/core';

import {
  BOOKING_DATE_ORDER,
  BOOKING_FIRSTNAME_ORDER,
  BOOKING_LASTNAME_ORDER,
} from '@bsport/common/lib/master-data/settings';
import Config from '../../../config';

import { OptionCallback } from '../../../state/types';
import type { CompanyTheme } from '../types';
import {
  IntegerField,
  RadioGroupField,
  TimeField,
  SwitchField,
} from '#components/forms';

interface FormikValues {
  show_offers_filling: boolean;
  accept_double_booking: boolean;
  allow_guest: boolean;
  hide_unnecessary_compatible_purchase_method: boolean;
  hidden_from_marketplace: boolean;
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
}
type Props = {
  theme: CompanyTheme;
  onSubmit: (id: number, data: FormData, options: OptionCallback) => void;
};

const ThemePersonalizeForm: React.FC<FormikProps<FormikValues>> = ({
  isSubmitting,
  dirty,
  isValid,
  handleSubmit,
  setFieldValue,
  values,
  errors,
}) => {
  const { t } = useTranslation(['theme']);
  const classes = useStyles();

  return (
    <Form>
      <div className={classes.main}>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.themePersonalization.bookingTitle')}
          </Typography>
          <SwitchField
            name="hidden_from_marketplace"
            label={t('forms.themePersonalization.hiddenFromMarketplace')}
          />
          <SwitchField
            name="accept_double_booking"
            label={t('forms.themePersonalization.acceptDoubleBooking')}
          />
          <SwitchField
            disabled={Config.REACT_APP_SENTRY_ENVIRONMENT === 'production'}
            name="allow_guest"
            label={t('forms.acceptGuest')}
          />

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
        </div>
      </div>
      <Button
        disabled={isSubmitting || !dirty || !isValid}
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
}));

const ThemePersonalizeFormSchema = Yup.object().shape({
  show_offers_filling: Yup.boolean().required(),
  accept_double_booking: Yup.boolean().required(),
  allow_guest: Yup.boolean(),
  hidden_from_marketplace: Yup.boolean().required(),
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

  gender_max_shift_for_booking: Yup.number().required(),
  max_future_booking: Yup.number().required(),
  basket_expiration_days: Yup.number().required(),
  nb_to_check_balance: Yup.number().required(),

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

    if (theme) {
      return {
        show_offers_filling: theme.show_offers_filling,
        accept_double_booking: theme.accept_double_booking,
        allow_guest: theme.allow_guest,
        hide_unnecessary_compatible_purchase_method:
          theme.hide_unnecessary_compatible_purchase_method,
        hidden_from_marketplace: theme.hidden_from_marketplace,
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
      };
    }
    return {
      show_offers_filling: false,
      accept_double_booking: false,
      allow_guest: false,
      hide_unnecessary_compatible_purchase_method: false,
      hidden_from_marketplace: false,
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
    };
  },
  validationSchema: ThemePersonalizeFormSchema,
  handleSubmit: (values, { props: { onSubmit, theme }, setSubmitting }) => {
    const data = new FormData();
    const keys: (keyof FormikValues)[] = [
      'show_offers_filling',
      'accept_double_booking',
      'allow_guest',
      'hidden_from_marketplace',
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
    ];
    keys.forEach((key) => data.append(key, values[key]));

    onSubmit(theme.company, data, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default ThemePersonalizeFormFormikHOC(ThemePersonalizeForm);
