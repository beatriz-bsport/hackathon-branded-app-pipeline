import * as Yup from 'yup';
import { TestBonusesIntervalConformity } from '../../utils';

export const bonusCoachPaymentRuleSchema = Yup.object().shape({
  coach_payment_rule: Yup.number().nullable(true),
  applicability: Yup.number(),
  kind: Yup.number(),
  bonus: Yup.number()
    .min(0)
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
    .min(0, 'paymentRules:coach_payment_rules.lowerIntervalTypeError')
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
    .required(
      'paymentRules:coach_payment_rules.Errors.baseRemunerationRequired',
    )
    .typeError(
      'paymentRules:coach_payment_rules.Errors.baseRemunerationTypeError',
    ),
  percentage_base_confirmed_bookings: Yup.number()
    .min(0)
    .max(100)
    .required(
      'paymentRules:coach_payment_rules.Errors.percentagebaseRemunerationRequired',
    )
    .typeError(
      'paymentRules:coach_payment_rules.Errors.percentagebaseRemunerationTypeError',
    ),
  min_remuneration: Yup.number().required(),
  max_remuneration: Yup.number().required(),
  tax_rate: Yup.number()
    .min(0)
    .max(100)
    .required('paymentRules:coach_payment_rules.Errors.taxeRateRequired')
    .typeError('paymentRules:coach_payment_rules.Errors.taxeRateTypeError'),
  exclude_cancelled_from_confirmed_bookings: Yup.boolean(),
  excluded_payment_packs: Yup.array().of(Yup.number()),
  bonus_for_confirmed_bookings: bonusCoachPaymentRuleArraySchema,
  bonus_for_cancelled_bookings: bonusCoachPaymentRuleArraySchema,
});

export default coachPaymentRuleFieldsSchema;
