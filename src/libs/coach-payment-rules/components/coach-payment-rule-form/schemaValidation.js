import * as Yup from 'yup';
import { TestBonusesIntervalConformity } from '../../utils';

export const bonusCoachPaymentRuleSchema = Yup.object().shape({
  coach_payment_rule: Yup.number().nullable(true),
  applicability: Yup.number(),
  kind: Yup.number(),
  bonus: Yup.number()
    .min(0)
    .max(999999)
    .test('bonus-gt-zero', 'bonus_gt_zero', function (item) {
      return item >= 0.1
        ? true
        : this.createError({
            path: this.path,
            message:
              'paymentRules:coach_payment_rules.Errors.invalidBonusAmount',
          });
    }),
  lower_interval: Yup.number()
    .min(1, 'paymentRules:coach_payment_rules.lowerIntervalTypeError')
    .max(999999)
    .typeError('paymentRules:coach_payment_rules.lowerIntervalTypeError')
    .test('interval-check', 'Invalid interval', function (item) {
      const valid_interval = this.parent.upper_interval > item;
      return valid_interval
        ? true
        : this.createError({
            path: this.path,
            message:
              'paymentRules:coach_payment_rules.Errors.invalidLowerInterval',
          });
    }),
  upper_interval: Yup.number()
    .min(0)
    .max(999999)
    .nullable(true)
    .typeError('paymentRules:coach_payment_rules.Errors.invalideUpperInterval'),
});

export const bonusCoachPaymentRuleArraySchema = Yup.array(
  bonusCoachPaymentRuleSchema,
).test('intervals-conformity', 'Invalid Intervals', function (items) {
  const test = TestBonusesIntervalConformity(items);
  return test;
});
export const coachPaymentRuleFieldsSchema = Yup.object().shape({
  name: Yup.string().required(
    'paymentRules:coach_payment_rules.Errors.nameRequired',
  ),
  base_remuneration: Yup.number()
    .min(0)
    .max(999999)
    .required(
      'paymentRules:coach_payment_rules.Errors.baseRemunerationRequired',
    )
    .typeError(
      'paymentRules:coach_payment_rules.Errors.baseRemunerationTypeError',
    ),
  base_remuneration_for_cancellation: Yup.number().min(0).max(999999),
  percentage_base_confirmed_bookings: Yup.number()
    .min(0)
    .max(100)
    .required(
      'paymentRules:coach_payment_rules.Errors.percentagebaseRemunerationRequired',
    )
    .typeError(
      'paymentRules:coach_payment_rules.Errors.percentagebaseRemunerationTypeError',
    ),
  min_remuneration: Yup.number().required().min(0).max(999999),
  max_remuneration: Yup.number()
    .min(0)
    .max(999999)
    .required()
    .test(
      'max-superior-to-min',
      'paymentRules:coach_payment_rules.Errors.invalidMaximum',
      function (item) {
        return item > this.parent.min_remuneration;
      },
    ),
  exclude_default_tax_rate_from_margin_rate: Yup.boolean(),
  exclude_cancelled_from_confirmed_bookings: Yup.boolean().test(
    'exlude_cancelled_from_confirmed_bookings',
    'paymentRules:coach_payment_rules.Errors.invalidCancelledBookingRules',
    function (item) {
      if (item && this.parent.remuneration_on_cancellation) {
        return (
          this.parent.bonus_for_cancelled_bookings.length !== 0 ||
          this.parent.percentage_base_cancelled_bookings !== 0 ||
          this.parent.base_remuneration_for_cancellation !== 0
        );
      }
      return true;
    },
  ),
  excluded_payment_packs: Yup.array().of(Yup.number()),
  bonus_for_confirmed_bookings: bonusCoachPaymentRuleArraySchema,
  bonus_for_cancelled_bookings: bonusCoachPaymentRuleArraySchema,
});

export default coachPaymentRuleFieldsSchema;
