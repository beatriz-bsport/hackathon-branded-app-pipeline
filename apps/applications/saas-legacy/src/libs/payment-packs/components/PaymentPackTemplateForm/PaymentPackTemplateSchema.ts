import * as Yup from 'yup';
import { offPeakScheduleSchemaValidation } from '#src/libs/payment-packs/components/PaymentPackForm/PaymentPackForm.component';
import { ALMOST_100 } from '#src/constants';
import {
  VALID_BY_DATERANGE,
  VALID_BY_DURATION,
} from '#src/libs/payment-packs/components/PaymentPackTemplateForm/constants';

const PaymentPackTemplateSchema = Yup.object().shape({
  name: Yup.string().required(),
  price: Yup.number()
    .required('paymentPack:addPaymentPack.requiredField')
    .min(0),
  tax: Yup.number()
    .required('paymentPack:addPaymentPack.requiredField')
    .min(0)
    .max(ALMOST_100),
  credit_number: Yup.string().required(
    'paymentPack:addPaymentPack.requiredField',
  ),
  credits: Yup.number().when('credit_number', {
    is: 'limited',
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(0)
      .nullable(),
    otherwise: Yup.number().nullable(),
  }),
  theorical_margin_value: Yup.number().when('credit_number', {
    is: 'unlimited',
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(0)
      .nullable(),
    otherwise: Yup.number(),
  }),
  timeType: Yup.string().required(),
  expiration_days_before_first_use: Yup.number(),
  start_date_method: Yup.string()
    .required('paymentPack:form.paymentPack.error.start_date_method_type')
    .typeError('paymentPack:form.paymentPack.error.start_date_method_type'),
  duration_days: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  duration_months: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  duration_years: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  lower_date: Yup.date().when('timeType', {
    is: VALID_BY_DATERANGE,
    then: Yup.date().required(),
    otherwise: Yup.date().nullable(),
  }),
  upper_date: Yup.date().when('timeType', {
    is: VALID_BY_DATERANGE,
    then: Yup.date().required(),
    otherwise: Yup.date().nullable(),
  }),
  manager_only: Yup.boolean(),
  max_bookings_per_day: Yup.number().min(0).nullable(),
  max_bookings_per_week: Yup.number().min(0).nullable(),
  max_bookings_per_month: Yup.number().min(0).nullable(),
  max_purchase_per_member: Yup.number().min(0).nullable(),
  new_member_only: Yup.boolean(),
  full_vod_access: Yup.boolean(),
  only_vod_access: Yup.boolean(),
  apply_penalties: Yup.boolean().test(
    'required',
    'paymentPack:form.paymentPack.penalty.errorNoPenaltyRule',
    function testRequired() {
      if (
        this.parent.apply_penalties &&
        !this.parent.penalty_active &&
        !this.parent.no_show_penalty_active
      ) {
        return false;
      }
      return true;
    },
  ),
  penalty_active: Yup.boolean(),
  penalty_mode_franchisor: Yup.number(),
  penalty_nb_late_cancellations: Yup.number().when('penalty_active', {
    is: true,
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(1, 'paymentPack:addPaymentPack.minusZero'),
    otherwise: Yup.number(),
  }),

  penalty_nb_days: Yup.number().when('penality', {
    is: true,
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(1, 'paymentPack:addPaymentPack.minusZero'),
    otherwise: Yup.number(),
  }),
  penalty_kind: Yup.string(),
  penalty_days_blocked: Yup.number().test(
    'required',
    'paymentPack:addPaymentPack.requiredField',
    function testRequired(item) {
      if (this.parent.penalty_active && this.parent.penalty_kind === 'block') {
        return typeof item === 'number' && item > 0;
      }

      return true;
    },
  ),
  penalty_account_value: Yup.number().test(
    'required',
    'paymentPack:addPaymentPack.requiredField',
    function testRequired(item) {
      if (
        this.parent.penalty_active &&
        this.parent.penalty_kind === 'account'
      ) {
        return typeof item === 'number' && item > 0;
      }

      return true;
    },
  ),

  no_show_penalty_mode_franchisor: Yup.number(),
  no_show_penalty_threshold: Yup.number().when('no_show_penalty_active', {
    is: true,
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(1, 'paymentPack:addPaymentPack.minusZero'),
    otherwise: Yup.number(),
  }),
  no_show_penalty_time_window_days: Yup.number().when(
    'no_show_penalty_active',
    {
      is: true,
      then: Yup.number()
        .required('paymentPack:addPaymentPack.requiredField')
        .min(1, 'paymentPack:addPaymentPack.minusZero'),
      otherwise: Yup.number(),
    },
  ),
  no_show_penalty_kind: Yup.string(),
  no_show_penalty_days_blocked: Yup.number().test(
    'required',
    'paymentPack:addPaymentPack.requiredField',
    function testRequired(item) {
      if (
        this.parent.no_show_penalty_active &&
        this.parent.no_show_penalty_kind === 'block'
      ) {
        return typeof item === 'number' && item > 0;
      }

      return true;
    },
  ),
  unusable_by_staff: Yup.boolean(),
  no_show_penalty_amount: Yup.number().test(
    'required',
    'paymentPack:addPaymentPack.requiredField',
    function testRequired(item) {
      if (
        this.parent.no_show_penalty_active &&
        this.parent.no_show_penalty_kind === 'account'
      ) {
        return typeof item === 'number' && item > 0;
      }
      return true;
    },
  ),
  expiration_date: Yup.date().nullable(),
  description: Yup.string().nullable(),
  off_peak_schedule: offPeakScheduleSchemaValidation,
});

export default PaymentPackTemplateSchema;
