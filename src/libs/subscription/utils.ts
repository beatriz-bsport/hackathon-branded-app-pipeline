import { DateTime } from 'luxon';
import { SubscriptionPause } from './types';

export function isPaused(pausesArray?: Array<SubscriptionPause>) {
  if (!pausesArray?.length) return false;
  return pausesArray.reduce(
    (acc, p) =>
      acc ||
      (DateTime.now() >= DateTime.fromISO(p.from_date).startOf('day') &&
        DateTime.now() <= DateTime.fromISO(p.until_date).endOf('day')),
    false,
  );
}

export const computeProrataPriceForSubscription = (
  first_BillingDate: string,
  monthBillingDay: number,
  recurrentPrice: string,
): string => {
  const reccurentPriceFloat = parseFloat(recurrentPrice);
  const firstBillingDate = DateTime.fromISO(first_BillingDate);
  const secondBillingDate = getNextBillingDate(
    firstBillingDate,
    monthBillingDay,
  );
  const daysLeft = Math.abs(
    firstBillingDate.diff(secondBillingDate, 'days').days,
  );

  if (daysLeft === 0) {
    return reccurentPriceFloat.toFixed(2);
  }

  const pricePerDay = reccurentPriceFloat / firstBillingDate.daysInMonth;
  return (pricePerDay * daysLeft).toFixed(2);
};

function getNextBillingDate(
  currentDate: DateTime,
  monthBillingDay: number,
): DateTime {
  // Determine the effective billing day to avoid exceeding the max day of the month (28/29/30/31).
  const effectiveBillingDay = Math.min(
    monthBillingDay,
    currentDate.daysInMonth,
  );

  if (currentDate.day === effectiveBillingDay) {
    return currentDate;
  }

  // Clone the currentDate to avoid updating the original currentDate as it is passed by reference.
  let nextBillingDate = currentDate.set({ day: effectiveBillingDay });
  if (nextBillingDate.startOf('day') <= currentDate.startOf('day')) {
    nextBillingDate = nextBillingDate.plus({ months: 1 });
    nextBillingDate = nextBillingDate.set({
      day: Math.min(effectiveBillingDay, nextBillingDate.daysInMonth),
    });
  }
  return nextBillingDate;
}
