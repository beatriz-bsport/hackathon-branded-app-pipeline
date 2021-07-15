import * as Yup from 'yup';

export const CoachPaymentRuleGroupSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().required(
    'paymentRules:coach_payment_rules.Errors.nameRequired',
  ),
  session_coach_payment_rule: Yup.number().nullable(true),
  workshop_coach_payment_rule: Yup.number().nullable(true),
  private_service_coach_payment_rule: Yup.number().nullable(true),
  private_slots_coach_payment_rules: Yup.array().of(
    Yup.object().shape({
      private_slot: Yup.number().nullable(false),
      coach_payment_rule: Yup.number().nullable(false),
    }),
  ),
  associated_coach: Yup.array().of(Yup.number()),
});

export default CoachPaymentRuleGroupSchema;
