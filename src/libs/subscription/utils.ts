import moment, { Moment } from 'moment-timezone';
import { SubscriptionPause } from './types';

export function isPaused(pausesArray?: Array<SubscriptionPause>) {
  if (!pausesArray?.length) return false;
  return pausesArray.reduce(
    (acc, p) =>
      acc ||
      moment().isBetween(
        moment(p.from_date),
        moment(p.until_date),
        'days',
        '[]',
      ),
    false,
  );
}

export const getCurrentDayFromMomentDateTime = (date: Moment) => date.date();

export const generateMomentDatetimeFromYearMonthDay = (
  year: number,
  month: number,
  day: number,
) => {
  return moment(
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  ).add(12, 'hours');
};

export const computeProrataPriceForSubscription = (
  first_BillingDate: Moment | string,
  monthBillingDay: number,
  recurrentPrice: string,
): string => {
  const reccurentPriceFloat = parseFloat(recurrentPrice);
  const firstBillingDate = moment(first_BillingDate);
  const secondBillingDate = getNextBillingDate(
    firstBillingDate,
    monthBillingDay,
  );
  const daysLeft = Math.abs(firstBillingDate.diff(secondBillingDate, 'day'));

  if (daysLeft === 0) {
    return reccurentPriceFloat.toFixed(2);
  }

  const pricePerDay = reccurentPriceFloat / firstBillingDate.daysInMonth();
  return (pricePerDay * daysLeft).toFixed(2);
};

function getNextBillingDate(
  currentDate: Moment,
  monthBillingDay: number,
): Moment {
  // Determine the effective billing day to avoid exceeding the max day of the month (28/29/30/31).
  const effectiveBillingDay = Math.min(
    monthBillingDay,
    currentDate.daysInMonth(),
  );

  if (currentDate.date() === effectiveBillingDay) {
    return currentDate;
  }

  // Clone the currentDate to avoid updating the original currentDate as it is passed by reference.
  const nextBillingDate = currentDate.clone().date(effectiveBillingDay);
  if (nextBillingDate.isSameOrBefore(currentDate, 'day')) {
    nextBillingDate.add(1, 'months');
    nextBillingDate.date(
      Math.min(effectiveBillingDay, nextBillingDate.daysInMonth()),
    );
  }
  return nextBillingDate;
}
