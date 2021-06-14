import {
  BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
  BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING,
  BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE,
} from '@bsport/common/lib/master-data/coach_payment_rule';

export const mapInitalPropsToValues = (initial, ruleTypeCreation) => {
  if (initial) {
    const purcentage_base_exists_confirmed_bookings = initial.bonus_coach_payment.find(
      (bonus) =>
        bonus.kind === BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE &&
        bonus.applicability ===
          BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
    );
    const purcentage_base_exists_cancelled_bookings = initial.bonus_coach_payment.find(
      (bonus) =>
        bonus.kind === BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE &&
        bonus.applicability ===
          BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING,
    );
    const purcentage_base_confirmed_bookings = purcentage_base_exists_confirmed_bookings
      ? purcentage_base_exists_confirmed_bookings.bonus
      : 0;
    const purcentage_base_cancelled_bookings = purcentage_base_exists_cancelled_bookings
      ? purcentage_base_exists_cancelled_bookings.bonus
      : 0;
    return {
      ...initial,
      add_overall_base_remuneration:
        parseFloat(initial.base_remuneration) !== 0,
      add_base_remuneration_for_cancellation:
        parseFloat(initial.base_remuneration_for_cancellation) !== 0,
      add_percentage_base_confirmed_bookings: purcentage_base_exists_confirmed_bookings,
      add_percentage_base_cancelled_bookings: purcentage_base_exists_cancelled_bookings,
      excluded_payment_packs: [...initial.excluded_payment_packs],
      percentage_base_confirmed_bookings: purcentage_base_confirmed_bookings,
      percentage_base_cancelled_bookings: purcentage_base_cancelled_bookings,
      remuneration_on_cancellation:
        initial.bonus_coach_payment.find(
          (bonus) =>
            bonus.applicability ===
            BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING,
        ) ||
        parseFloat(initial.base_remuneration_for_cancellation) !== 0 ||
        (!initial.bonus_coach_payment.find(
          (bonus) =>
            bonus.applicability ===
            BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING,
        ) &&
          !initial.exclude_cancelled_from_confirmed_bookings),
      bonus_for_confirmed_bookings: initial.bonus_coach_payment.filter(
        (bonus) =>
          bonus.applicability ===
            BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING &&
          bonus.kind !== BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE,
      ),
      bonus_for_cancelled_bookings: initial.bonus_coach_payment.filter(
        (bonus) =>
          bonus.applicability ===
            BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING &&
          bonus.kind !== BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE,
      ),
    };
  }
  return {
    coach_payment_rule: null,
    kind: ruleTypeCreation,
    name: '',
    add_overall_base_remuneration: false,
    add_percentage_base_confirmed_bookings: false,
    add_percentage_base_cancelled_bookings: false,
    remuneration_on_cancellation: false,
    base_remuneration_for_cancellation: 0,
    exclude_cancelled_from_confirmed_bookings: false,
    base_remuneration: 0,
    percentage_base_confirmed_bookings: 0,
    percentage_base_cancelled_bookings: 0,
    min_remuneration: 0,
    max_remuneration: 1000,
    excluded_payment_packs: [],
    exclude_default_tax_rate_from_margin_rate: false,
    bonus_coach_payment: [],
    bonus_for_confirmed_bookings: [],
    bonus_for_cancelled_bookings: [],
    associated_coach: [],
    private_associated_coach: [],
  };
};

export default mapInitalPropsToValues;
