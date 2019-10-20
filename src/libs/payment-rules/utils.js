import lodash from 'lodash';

export function computeBonus(session, rate) {
  const nbBookings = rate.only_attendant
    ? session.nb_attendances
    : session.nb_bookings;
  const min = rate.bonuses.reduce((m, r) => Math.min(m, r.threshold), 10000000);
  const level = lodash.findLast(rate.bonuses, (r) => r.threshold <= nbBookings);
  const variable = level ? +level.variable_bonus : 0;
  return (nbBookings - min) * variable;
}

export function setRateForSession(session, rates, defaultRate) {
  return {
    ...session,
    rate: rates.find((r) => r.id === session.payment_rule_id) || defaultRate,
  };
}

export function computeSessionPayment(session) {
  return {
    ...session,
    base: +session.rate.base_price,
    bonus: computeBonus(session, session.rate),
    nb_accountable_bookings: session.rate.only_attendant
      ? session.nb_attendances
      : session.nb_bookins,
  };
}

export function computePerformance(performance, allRates, defaultRate) {
  if (!defaultRate || !performance) {
    return { sessions: [], total: 0, nbBookings: 0, nbSessions: 0 };
  }

  const rates = (allRates || []).map((rate) => ({
    ...rate,
    bonuses: lodash.sortBy(rate.bonuses, 'threshold'),
  }));

  const sessions = performance
    .map((s) => setRateForSession(s, rates, defaultRate))
    .map(computeSessionPayment);

  const nbBookings = lodash.sumBy(sessions, 'nb_accountable_bookings');
  const base = lodash.sumBy(sessions, 'base');
  const bonus = lodash.sumBy(sessions, 'bonus');

  return {
    sessions,
    nbBookings,
    nbSessions: sessions.length,
    total: base + bonus,
  };
}
