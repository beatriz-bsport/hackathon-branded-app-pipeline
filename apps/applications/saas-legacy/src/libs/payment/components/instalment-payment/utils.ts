import { DateTime } from 'luxon';
import { IntervalType } from '../../types';

export const buildSchedulePlan = (
  interval: IntervalType,
  nbInterval: number,
  totalPriceCts: number,
  anchorDate: string,
  recurrence_basis: number = 1,
) => {
  if (!interval) return [];
  const amount_instalment_cts = parseInt(`${totalPriceCts / nbInterval}`, 10);
  const schedule = Array.from(Array(nbInterval).keys()).map((i) => ({
    future_date: DateTime.fromISO(anchorDate)
      .plus({ [interval]: i * recurrence_basis })
      .toISODate(),
    amount_cts: amount_instalment_cts,
  }));

  const missingMoneyCts = totalPriceCts - amount_instalment_cts * nbInterval;

  if (missingMoneyCts > 0) {
    schedule[schedule.length - 1].amount_cts =
      schedule[schedule.length - 1].amount_cts + missingMoneyCts;
  }
  return schedule;
};
