import {
  CONTRACT_MAX_COMMITMENT_VALUE_ALLOWED,
  CONTRACT_MAX_NB_INTERVAL_ALLOWED,
} from '#src/libs/subscription/constants';
import * as Yup from 'yup';
import { InvoicingType, ObjectType } from './types';

export const SubscriptionContractFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
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
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
          nb_interval <= 12
        );
      },
    )
    .test(
      'Must-be-more-than-one-for-fixed-billing-day',
      'contract.form.nb_interval.restrictionForFixedBillingDay',
      function checkNbIntervalForFixedBillingDay(nb_interval) {
        return (
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
          nb_interval > 1
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
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
          recurrence_basis === 1
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
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
          interval === 'month'
        );
      },
    ),
  recurrent_price: Yup.number().min(0),
  flat_fee: Yup.number().min(0),
  payment_pack: Yup.number()
    .integer()
    .nullable()
    .test(
      'is-nullable',
      'contract.form.error.missingPaymentPack',
      function checkPaymentPackIsNullable(payment_pack) {
        const { object_type } = this.parent;
        return object_type !== ObjectType.paymentPack || !!payment_pack;
      },
    ),
  private_pass: Yup.number()
    .integer()
    .nullable()
    .test(
      'is-nullable',
      'contract.form.error.missingPrivatePass',
      function checkPrivatePassIsNullable(private_pass) {
        const { object_type } = this.parent;
        return object_type !== ObjectType.privatePass || !!private_pass;
      },
    ),
  payment_combo: Yup.number()
    .integer()
    .nullable()
    .test(
      'is-nullable',
      'contract.form.error.missingPaymentCombo',
      function checkPaymentComboIsNullable(payment_combo) {
        const { object_type } = this.parent;
        return object_type !== ObjectType.paymentCombo || !!payment_combo;
      },
    ),
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
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
          !!month_billing_day
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
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
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
});
