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
) => {
  const reccurentPriceFloat = parseFloat(recurrentPrice);
  const from_date = moment(first_BillingDate);
  const currentDay = getCurrentDayFromMomentDateTime(from_date);
  const daysInCurrentMonth = from_date.daysInMonth();

  const secondBillingDate = getNextBillingDate(from_date, monthBillingDay);
  const previousBillingDate = getPreviousBillingDate(
    from_date,
    monthBillingDay,
  );

  const daySpanBetweenPreviousAndSecond = Math.max(
    Math.abs(secondBillingDate.diff(previousBillingDate, 'day')),
    0,
  );

  const daySpanBetweenFirstAndSecond =
    Math.abs(previousBillingDate.diff(from_date, 'day')) + 1;

  if (currentDay === Math.min(monthBillingDay, daysInCurrentMonth)) {
    return reccurentPriceFloat.toFixed(2);
  }
  if (daySpanBetweenPreviousAndSecond === 0) {
    return parseFloat('0').toFixed(2);
  }

  return (
    reccurentPriceFloat -
    (reccurentPriceFloat / daySpanBetweenPreviousAndSecond) *
      (daySpanBetweenFirstAndSecond || 1)
  ).toFixed(2);
};

const getNextBillingDate = (from_date: Moment, monthBillingDay: number) => {
  const previousDay = getCurrentDayFromMomentDateTime(from_date);
  const previousMonth = from_date.month();
  const previousYear = from_date.year();
  const daysInPreviousMonth = from_date.daysInMonth();

  if (previousDay < Math.min(monthBillingDay, daysInPreviousMonth)) {
    return generateMomentDatetimeFromYearMonthDay(
      previousYear,
      previousMonth + 1,
      Math.min(monthBillingDay, daysInPreviousMonth),
    );
  }

  const nextMonth =
    previousMonth + 1 < 11 ? previousMonth + 1 : previousMonth + 1 - 11;

  const nextYear = previousMonth + 1 < 11 ? previousYear : previousYear + 1;

  const daysInNextMonth = moment(
    generateMomentDatetimeFromYearMonthDay(nextYear, nextMonth + 1, 15),
  ).daysInMonth();

  return generateMomentDatetimeFromYearMonthDay(
    nextYear,
    nextMonth + 1,
    Math.min(monthBillingDay, daysInNextMonth),
  );
};

const getPreviousBillingDate = (from_date: Moment, monthBillingDay: number) => {
  const currentDay = getCurrentDayFromMomentDateTime(from_date);
  const currentMonth = from_date.month();
  const currentYear = from_date.year();

  const daysInCurrentMonth = from_date.daysInMonth();

  if (currentDay === Math.min(monthBillingDay, daysInCurrentMonth)) {
    return from_date;
  }

  if (currentDay < Math.min(monthBillingDay, daysInCurrentMonth)) {
    const previousMonth =
      currentMonth - 1 >= 0 ? currentMonth - 1 : 12 + currentMonth;
    const previousYear = currentMonth - 1 >= 0 ? currentYear : currentYear - 1;

    const daysInPreviousMonth = moment(
      generateMomentDatetimeFromYearMonthDay(
        previousYear,
        previousMonth + 1,
        15,
      ),
    ).daysInMonth();

    return generateMomentDatetimeFromYearMonthDay(
      previousYear,
      previousMonth + 1,
      Math.min(monthBillingDay, daysInPreviousMonth),
    );
  }
  return generateMomentDatetimeFromYearMonthDay(
    currentYear,
    currentMonth + 1,
    Math.min(monthBillingDay, daysInCurrentMonth),
  );
};
