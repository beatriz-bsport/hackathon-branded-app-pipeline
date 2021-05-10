import {
  BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
  BONUS_COACH_PAYMENT_RULE_FIXED_VLAUE,
  BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING,
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';

export const bonusCoachPaymentRuleConstructor = (
  coach_payment_rule_id: number | null,
  params: {
    applicability: number | null,
    kind: number | null,
    bonus: number | null,
    lower_interval: number | null,
    upper_interval: number | null,
  },
) => {
  return {
    ...params,
    coach_payment_rule: coach_payment_rule_id,
    applicability:
      params.applicability ||
      BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
    kind: params.kind || BONUS_COACH_PAYMENT_RULE_FIXED_VLAUE,
    bonus: params.bonus || 0,
    lower_interval: params.lower_interval || 0,
    upper_interval: params.upper_interval || null,
  };
};

export const TestBonusesIntervalConformity = (bonusesList) => {
  const bonuses_fixed_values = bonusesList.filter(
    (bonus) => bonus.kind === BONUS_COACH_PAYMENT_RULE_FIXED_VLAUE,
  );
  const bonues_for_every_bookings = bonusesList.filter(
    (bonus) => bonus.kind === BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING,
  );
  const conformity1 = checkConformity(bonuses_fixed_values);
  const conformity2 = checkConformity(bonues_for_every_bookings);
  return conformity1 && conformity2;
};

export const checkConformity = (bonuses) => {
  for (let index = 0; index < bonuses.length - 1; index += 1) {
    if (bonuses[index].upper_interval >= bonuses[index + 1].lower_interval) {
      return false;
    }
  }
  return true;
};
export const computePerformanceSynthese = (CoachesWithPerformances) => {
  const synthese = [
    COACH_PERFORMANCE_FOR_SESSION,
    COACH_PERFORMANCE_FOR_APPOINTMENT,
  ].map((kind) =>
    CoachesWithPerformances.map((coachwithPerf) =>
      (coachwithPerf.performance[kind] || []).reduce(
        (accumulator, perf) => {
          accumulator.payment += parseFloat(perf.coach_total_payment) || 0;
          accumulator.confirmedBookings +=
            parseFloat(perf.confirmed_bookings) || 0;
          accumulator.cancelledBookings +=
            parseFloat(perf.cancelled_bookings) || 0;
          return accumulator;
        },
        {
          id: coachwithPerf.id,
          name: coachwithPerf.name,
          nbSessions:
            ((coachwithPerf.performance[COACH_PERFORMANCE_FOR_SESSION] &&
              coachwithPerf.performance[COACH_PERFORMANCE_FOR_SESSION]
                .length) ||
              0) +
            ((coachwithPerf.performance[COACH_PERFORMANCE_FOR_APPOINTMENT] &&
              coachwithPerf.performance[COACH_PERFORMANCE_FOR_APPOINTMENT]
                .length) ||
              0),
          payment: 0,
          bonus: 0,
          confirmedBookings: 0,
          cancelledBookings: 0,
        },
      ),
    ),
  );
  const syntheseaccu = synthese[0]
    .concat(synthese[1])
    .reduce(function (newArr, synth) {
      const index = newArr.findIndex((toto) => toto.id === synth.id);
      if (index && index !== -1) {
        newArr.splice(index, index, {
          ...newArr[index],
          nbSessions: newArr[index].nbSessions + synth.nbSessions,
          payment: newArr[index].payment + synth.payment,
          bonus: newArr[index].bonus + synth.bonus,
          confirmedBookings:
            newArr[index].confirmedBookings + synth.confirmedBookings,
          cancelledBookings:
            newArr[index].cancelledBookings + synth.cancelledBookings,
        });
      } else {
        newArr.push(synth);
      }
      return newArr;
    }, []);
  return syntheseaccu;
};
