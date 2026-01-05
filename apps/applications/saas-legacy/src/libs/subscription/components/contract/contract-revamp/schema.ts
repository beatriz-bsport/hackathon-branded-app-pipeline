import {
  CONTRACT_MAX_COMMITMENT_VALUE_ALLOWED,
  CONTRACT_MAX_NB_INTERVAL_ALLOWED,
} from '#src/libs/subscription/constants';
import * as Yup from 'yup';
import { InvoicingType, ObjectType } from './types';
import { ALMOST_100 } from '#src/constants';
import {
  START_ON_FIRST_ATTENDANCE,
  START_ON_FIRST_BOOKING,
} from '@bsport/common/lib/master-data/payment-pack';
import { offPeakScheduleSchemaValidation } from '#src/libs/payment-packs/components/PaymentPackForm/PaymentPackForm.component';
import { emptyPaymentPackDetailsForms } from './constants';

export const paymentPackDetailsSchema = Yup.object().shape({
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
  penalty_nb_late_cancellations: Yup.number().when('penalty_active', {
    is: true,
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(1, 'paymentPack:addPaymentPack.minusZero'),
    otherwise: Yup.number(),
  }),
  penalty_nb_days: Yup.number().when('penalty_active', {
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
  expiration_days_before_first_use: Yup.number().when('validity', {
    is: 'givenNumber',
    then: Yup.number().test(
      'required',
      'paymentPack:addPaymentPack.requiredField',
      function testExpirationDate(item) {
        if (
          this.parent.start_date_method === `${START_ON_FIRST_BOOKING}` ||
          this.parent.start_date_method === `${START_ON_FIRST_ATTENDANCE}`
        ) {
          return typeof item === 'number';
        }

        return true;
      },
    ),
    otherwise: Yup.number(),
  }),
  max_bookings_per_day: Yup.number().min(0).nullable(),
  max_bookings_per_week: Yup.number().min(0).nullable(),
  max_bookings_per_month: Yup.number().min(0).nullable(),
  max_purchase_per_member: Yup.number().min(0).nullable(),
  categories: Yup.array().of(Yup.number()),
  establishments: Yup.array().of(Yup.number()),
  metaActivities: Yup.array().of(Yup.number()),
  full_vod_access: Yup.boolean(),
  only_vod_access: Yup.boolean(),
  allow_guest_pass: Yup.boolean(),
  applies_for_payroll: Yup.boolean().required(),
  off_peak_schedule: offPeakScheduleSchemaValidation,
  bookkeeping_account: Yup.number().nullable(),
  grants_door_access: Yup.boolean(),
});

export const SubscriptionContractFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  tax: Yup.number()
    .required('paymentPack:addPaymentPack.requiredField')
    .min(0)
    .max(ALMOST_100),
  nb_interval: Yup.number()
    .integer('common:form.validation.number')
    .min(1, 'common:positiveNumber')
    .required('common:form.requiredField')
    .test(
      'Must-be-less-than-twelve-for-fixed-billing-day',
      'contract.form.nb_interval.restrictionForFixedBillingDay',
      function checkNbIntervalForFixedBillingDay(nb_interval) {
        if (!nb_interval) {
          return false;
        }
        return (
          this.parent.invoicing_type ===
            InvoicingType.SAME_DAY_AS_SUBSCRIPTION || nb_interval <= 12
        );
      },
    )
    .test(
      'Must-be-more-than-one-for-fixed-billing-day',
      'contract.form.nb_interval.restrictionForFixedBillingDay',
      function checkNbIntervalForFixedBillingDay(nb_interval) {
        return (
          this.parent.invoicing_type ===
            InvoicingType.SAME_DAY_AS_SUBSCRIPTION || nb_interval > 1
        );
      },
    )
    .max(CONTRACT_MAX_NB_INTERVAL_ALLOWED, 'contract.form.nb_interval.error'),

  recurrence_basis: Yup.number()
    .integer()
    .min(1)
    .required()
    .test(
      'Must-be-one-for-fixed-billing-day',
      'Fixed Billing Day must be one',
      function checkNbIntervalForFixedBillingDay(recurrence_basis) {
        return (
          this.parent.invoicing_type ===
            InvoicingType.SAME_DAY_AS_SUBSCRIPTION || recurrence_basis === 1
        );
      },
    ),
  interval: Yup.string()
    .required()
    .test(
      'Must-be-month-if-month-billing-day-not-null',
      'Interval must be month',
      function checkIntervalBasedOnMonthBillingDay(interval) {
        return (
          this.parent.invoicing_type ===
            InvoicingType.SAME_DAY_AS_SUBSCRIPTION || interval === 'month'
        );
      },
    ),
  recurrent_price: Yup.number().min(0),
  flat_fee: Yup.number().min(0),
  description: Yup.string().required(),
  contract: Yup.string().required(),
  manager_only: Yup.boolean(),
  auto_renewal: Yup.boolean(),
  unusable_by_staff: Yup.boolean(),
  invoicing_type: Yup.string(),
  month_billing_day: Yup.number()
    .min(1)
    .max(31)
    .nullable()
    .test(
      'Must-set-if-fixed-day-invoicing-type',
      'missing',
      function checkIntervalBasedOnMonthBillingDay(month_billing_day) {
        return (
          this.parent.invoicing_type ===
            InvoicingType.SAME_DAY_AS_SUBSCRIPTION || !!month_billing_day
        );
      },
    ),
  highlighted_as_recommended: Yup.boolean(),
  tags_on_first_billing: Yup.array().of(Yup.number().integer()),
  nb_interval_after_auto_renewal: Yup.number()
    .integer('common:form.validation.number')
    .min(1, 'common:positiveNumber')
    .nullable()
    .test(
      'Must-be-less-than-twelve-for-fixed-billing-day',
      'contract.form.nb_interval.errorForFixedBillingDay',
      function checkNbIntervalForFixedBillingDay(
        nb_interval_after_auto_renewal,
      ) {
        return (
          this.parent.invoicing_type ===
            InvoicingType.SAME_DAY_AS_SUBSCRIPTION ||
          !nb_interval_after_auto_renewal ||
          nb_interval_after_auto_renewal <= 12
        );
      },
    )
    .max(CONTRACT_MAX_NB_INTERVAL_ALLOWED, 'contract.form.nb_interval.error'),
  has_mandatory_commitment_period: Yup.boolean().required().default(false),
  commitment_period_value: Yup.number()
    .integer('common:form.validation.number')
    .min(1, 'common:positiveNumber')
    .max(
      CONTRACT_MAX_COMMITMENT_VALUE_ALLOWED,
      'contract.form.commitmentPeriod.error',
    )
<<<<<<< HEAD
    .nullable()
    .test(
      'required-when-commitment-enabled',
      'contract.form.commitmentPeriod.valueRequired',
      function checkCommitmentValue(commitment_period_value) {
        return (
          !this.parent.has_mandatory_commitment_period ||
          !!commitment_period_value
        );
      },
    ),
  commitment_period_unit: Yup.string()
    .nullable()
    .test(
      'required-when-commitment-enabled',
      'contract.form.commitmentPeriod.unitRequired',
      function checkCommitmentUnit(commitment_period_unit) {
        return (
          !this.parent.has_mandatory_commitment_period ||
          !!commitment_period_unit
        );
      },
    ),
=======
    .nullable(),
  commitment_period_unit: Yup.string().nullable(),
  payment_pack_details: paymentPackDetailsSchema
    .nullable()
    .default(emptyPaymentPackDetailsForms),
>>>>>>> 342c6d0f2f (feat(contract): Prepare assets for payment pack details form)
});
