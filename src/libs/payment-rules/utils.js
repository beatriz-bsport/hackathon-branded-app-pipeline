import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';
import { PAYMENT_RULE_CALCULATION_BOOKINGS } from '@bsport/common/lib/master-data/payment-rule';

const findBonusValue = (booking, bonusIntervalList) => {
  let computedBonus = 0;
  bonusIntervalList.map((bonusInterval) => {
    if (booking < bonusInterval.max && booking >= bonusInterval.min) {
      computedBonus = bonusInterval.bonusValue;
    }
    return null;
  });
  return computedBonus;
};

export function computeBonus(session, rate) {
  const nbBookings = rate.only_attendant
    ? session.nb_attendances
    : session.nb_bookings;
  const bonusIntervalList = (rate.bonuses || []).reduce(
    (bInterval, bonus, idx) => {
      if (idx === rate.bonuses.length - 1 && rate.bonuses.length === 1) {
        return [
          {
            min: bonus.threshold,
            max: 10000,
            bonusValue: bonus.variable_bonus,
          },
        ];
      }
      if (idx === rate.bonuses.length - 1) return bInterval;
      return [
        ...bInterval,
        {
          min: bonus.threshold,
          bonusValue: bonus.variable_bonus,
          max:
            (idx >= rate.bonuses.length && 100000) ||
            rate.bonuses[idx + 1].threshold,
        },
      ];
    },
    [],
  );
  let sumBonus = 0;
  // eslint-disable-next-line
  for (let b = 1; b <= nbBookings; b++) {
    sumBonus += parseFloat(findBonusValue(b, bonusIntervalList));
  }
  return sumBonus;
}

export function setRateForSession(session, rates, defaultRate) {
  return {
    ...session,
    rate: rates.find((r) => r.id === session.payment_rule_id) || defaultRate,
  };
}

export function computeSessionPayment(session) {
  const base =
    session.rate.calculation_method === PAYMENT_RULE_CALCULATION_BOOKINGS
      ? +session.rate.base_price
      : (session.rate.base_percent *
          (session.rate.only_attendant
            ? session.sum_margin_value_attendant
            : session.sum_margin_value) *
          (session.rate.include_tax ? 1 : 1 / 1.2)) /
        100;
  return {
    ...session,
    base,
    bonus: computeBonus(session, session.rate),
    nb_accountable_bookings: session.rate.only_attendant
      ? session.nb_attendances
      : session.nb_bookings,
  };
}

export function computePerformance(performance, allRates, defaultRate) {
  if (!defaultRate || !performance) {
    return { sessions: [], total: 0, nbBookings: 0, nbSessions: 0 };
  }

  const rates = (allRates || []).map((rate) => ({
    ...rate,
    bonuses: sortBy(rate.bonuses, 'threshold'),
  }));

  const sessions = performance
    .map((s) => setRateForSession(s, rates, defaultRate))
    .map(computeSessionPayment);

  const nbBookings = sumBy(sessions, 'nb_accountable_bookings');
  const base = sumBy(sessions, 'base');
  const bonus = sumBy(sessions, 'bonus');

  return {
    sessions,
    nbBookings,
    nbSessions: sessions.length,
    total: base + bonus,
  };
}
