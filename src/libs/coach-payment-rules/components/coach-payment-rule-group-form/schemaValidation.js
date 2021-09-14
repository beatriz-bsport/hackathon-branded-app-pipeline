import * as Yup from 'yup';

export const CoachPaymentRuleGroupSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().required(
    'paymentRules:coach_payment_rules.Errors.nameRequired',
  ),
  session_coach_payment_rule: Yup.number()
    .nullable(true)
    .test(
      'coach_payment_rule',
      'paymentRules:coach_payment_rules.Errors.oneRuleRequired',
      function (item) {
        const test =
          item === null &&
          this.parent.workshop_coach_payment_rule === null &&
          this.parent.private_service_coach_payment_rule === null;
        return !test;
      },
    ),
  workshop_coach_payment_rule: Yup.number().nullable(true),
  private_service_coach_payment_rule: Yup.number().nullable(true),
  private_slots_coach_payment_rules: Yup.array().of(
    Yup.object()
      .shape({
        private_slot: Yup.number()
          .nullable(false)
          .typeError(
            'paymentRules:coach_payment_rules.Errors.invalidPrivateSlot',
          ),
        coach_payment_rule: Yup.number()
          .nullable(false)
          .typeError(
            'paymentRules:coach_payment_rules.Errors.invalidCoachPaymentRule',
          ),
      })
      .test(
        'unique_rule_for_privateSlot',
        'paymentRules:coach_payment_rules.Errors.uniqueRuleForPrivateSlot',
        function (item) {
          const findSimilar = this.parent.filter(
            (specific_rule) => specific_rule.private_slot === item.private_slot,
          );
          const findSimilarIndex = this.parent.indexOf(item);
          const test = findSimilar && findSimilar.length > 1;
          return test
            ? this.createError({
                path: `private_slot_unicity.${findSimilarIndex}`,
                message:
                  'paymentRules:coach_payment_rules.Errors.uniqueRuleForPrivateSlot',
              })
            : true;
        },
      ),
  ),
  associated_coach: Yup.array().of(Yup.number()),
});

export default CoachPaymentRuleGroupSchema;
