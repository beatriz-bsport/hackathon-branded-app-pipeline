import { DateTime } from 'luxon';
import {
  MaxoutBooking,
  PaymentPack,
  MaxoutData,
} from './available-payment.type';

export const getMaxoutInfoForPaymentPack = (
  paymentPack: PaymentPack,
  dates: DateTime[],
  existingMaxoutData?: MaxoutBooking,
): MaxoutData => {
  if (
    getIsMaxoutDayForConsumerPaymentPack(paymentPack, dates, existingMaxoutData)
  )
    return {
      exceedsBookingMaxout: true,
      maxoutInfo: { period: 'day', nb: paymentPack.max_bookings_per_day },
    };

  if (
    getIsMaxoutWeekForConsumerPaymentPack(
      paymentPack,
      dates,
      existingMaxoutData,
    )
  )
    return {
      exceedsBookingMaxout: true,
      maxoutInfo: { period: 'week', nb: paymentPack.max_bookings_per_week },
    };

  if (
    getIsMaxoutMonthForConsumerPaymentPack(
      paymentPack,
      dates,
      existingMaxoutData,
    )
  )
    return {
      exceedsBookingMaxout: true,
      maxoutInfo: { period: 'month', nb: paymentPack.max_bookings_per_month },
    };

  return { exceedsBookingMaxout: false, maxoutInfo: null };
};

const getIsMaxoutDayForConsumerPaymentPack = (
  paymentPack: PaymentPack,
  dates: DateTime[],
  existingMaxoutData?: MaxoutBooking,
): boolean => {
  if (paymentPack.max_bookings_per_day === null) {
    return false;
  }

  const bookingAvailableByDay: { [key: string]: number } = {};
  dates.forEach((date) => {
    const key = date.toISODate();
    if (key in bookingAvailableByDay) {
      bookingAvailableByDay[key] -= 1;
      return;
    }

    const existingMaxoutDayData = (existingMaxoutData?.days ?? []).find(
      (maxoutEntry) => maxoutEntry.start_date === key,
    );

    const initialBookingAvailable =
      existingMaxoutDayData?.booking_available ??
      paymentPack.max_bookings_per_day;

    bookingAvailableByDay[key] = initialBookingAvailable - 1;
  });

  return Object.values(bookingAvailableByDay).some(
    (bookingAvailable) => bookingAvailable < 0,
  );
};

const getIsMaxoutWeekForConsumerPaymentPack = (
  paymentPack: PaymentPack,
  dates: DateTime[],
  existingMaxoutData?: MaxoutBooking,
): boolean => {
  if (paymentPack.max_bookings_per_week === null) {
    return false;
  }

  const bookingAvailableByWeek: { [key: string]: number } = {};
  dates.forEach((date) => {
    const key = date.startOf('week').toISODate();
    if (key in bookingAvailableByWeek) {
      bookingAvailableByWeek[key] -= 1;
      return;
    }

    const existingMaxoutWeekData = (existingMaxoutData?.weeks ?? []).find(
      (maxoutEntry) => maxoutEntry.start_date === key,
    );

    const initialBookingAvailable =
      existingMaxoutWeekData?.booking_available ??
      paymentPack.max_bookings_per_week;

    bookingAvailableByWeek[key] = initialBookingAvailable - 1;
  });

  return Object.values(bookingAvailableByWeek).some(
    (bookingAvailable) => bookingAvailable < 0,
  );
};

const getIsMaxoutMonthForConsumerPaymentPack = (
  paymentPack: PaymentPack,
  dates: DateTime[],
  existingMaxoutData?: MaxoutBooking,
): boolean => {
  if (paymentPack.max_bookings_per_month === null) {
    return false;
  }

  const bookingAvailableByMonth: { [key: string]: number } = {};
  dates.forEach((date) => {
    const key = date.startOf('month').toISODate();
    if (key in bookingAvailableByMonth) {
      bookingAvailableByMonth[key] -= 1;
      return;
    }

    const existingMaxoutMonthData = (existingMaxoutData?.months ?? []).find(
      (maxoutEntry) =>
        date >= DateTime.fromISO(maxoutEntry.start_date) &&
        date <= DateTime.fromISO(maxoutEntry.end_date),
    );

    const initialBookingAvailable =
      existingMaxoutMonthData?.booking_available ??
      paymentPack.max_bookings_per_month;

    bookingAvailableByMonth[key] = initialBookingAvailable - 1;
  });

  return Object.values(bookingAvailableByMonth).some(
    (bookingAvailable) => bookingAvailable < 0,
  );
};
