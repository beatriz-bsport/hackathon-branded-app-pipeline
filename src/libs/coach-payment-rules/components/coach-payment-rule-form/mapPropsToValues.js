import {
  FIXED_BASE_REMUNERATION,
  PERCENTAGE_BASE_REMUNERATION,
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
      excluded_payment_packs: [...initial.excluded_payment_packs],
      percentage_base_confirmed_bookings: purcentage_base_confirmed_bookings,
      percentage_base_cancelled_bookings: purcentage_base_cancelled_bookings,
      base_remuneration_type_confirmed: purcentage_base_exists_confirmed_bookings
        ? PERCENTAGE_BASE_REMUNERATION
        : FIXED_BASE_REMUNERATION,
      base_remuneration_type_cancellation: purcentage_base_exists_cancelled_bookings
        ? PERCENTAGE_BASE_REMUNERATION
        : FIXED_BASE_REMUNERATION,
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
      include_taxe: parseFloat(initial.tax_rate) !== 0,
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
    base_remuneration_type_confirmed: FIXED_BASE_REMUNERATION,
    base_remuneration_type_cancellation: FIXED_BASE_REMUNERATION,
    remuneration_on_cancellation: false,
    exclude_cancelled_from_confirmed_bookings: false,
    include_taxe: false,
    base_remuneration: 0,
    percentage_base_confirmed_bookings: 0,
    percentage_base_cancelled_bookings: 0,
    min_remuneration: 0,
    max_remuneration: 0,
    tax_rate: 0,
    excluded_payment_packs: [],
    bonus_coach_payment: [],
    bonus_for_confirmed_bookings: [],
    bonus_for_cancelled_bookings: [],
    associated_coach: [],
  };
};

export default mapInitalPropsToValues;
