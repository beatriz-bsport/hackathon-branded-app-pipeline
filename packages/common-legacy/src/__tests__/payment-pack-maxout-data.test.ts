import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';

import { getMaxoutInfoForPaymentPack } from '../master-data/payment-pack-maxout-data';
import {
  MaxoutBooking,
  PaymentPack,
} from '../master-data/available-payment.type';

const createPaymentPack = (
  overrides: Partial<PaymentPack> = {},
): PaymentPack => ({
  id: 1,
  name: 'Test Pack',
  price: 100,
  base_price: 100,
  tax: '20',
  credits: 10,
  unlimited: false,
  nb_consumer_payment_packs: 0,
  max_bookings_per_day: null,
  max_bookings_per_week: null,
  max_bookings_per_month: null,
  max_purchase_per_member: null,
  expiration_days_before_first_use: 30,
  theorical_margin_value: 0,
  disabled: false,
  start_date_method: 0,
  manager_only: false,
  new_member_only: false,
  company: 1,
  SCTS: [],
  metaActivities: [],
  editable: true,
  establishments: [],
  categories: [],
  category: null,
  barcode: '',
  onsite_payment_available: true,
  full_vod_access: false,
  only_vod_access: false,
  allow_guest_pass: false,
  penatly_active: false,
  penalty_nd_late_cancellations: 0,
  penalty_nb_days: 0,
  penalty_kind: 0,
  penalty_days_blocked: 0,
  penalty_account_value: 0,
  start_on_first_user: false,
  notifications: [],
  whitelist_tags: [],
  blacklist_tags: [],
  ...overrides,
});

describe('getMaxoutInfoForPaymentPack', () => {
  it('delegates to getMaxoutInfoForPaymentPack', () => {
    const paymentPack = createPaymentPack({ max_bookings_per_day: 2 });
    const dates = [
      DateTime.fromISO('2025-01-15'),
      DateTime.fromISO('2025-01-15'),
      DateTime.fromISO('2025-01-15'),
    ];

    const result = getMaxoutInfoForPaymentPack(paymentPack, dates);

    expect(result.exceedsBookingMaxout).toBe(true);
    expect(result.maxoutInfo?.period).toBe('day');
  });

  it('when no limits are set, returns no maxout', () => {
    const paymentPack = createPaymentPack();
    const dates = [DateTime.fromISO('2025-01-15')];

    const result = getMaxoutInfoForPaymentPack(paymentPack, dates);

    expect(result).toEqual({ exceedsBookingMaxout: false, maxoutInfo: null });
  });

  describe('day limit', () => {
    it('does not exceed when under limit', () => {
      const paymentPack = createPaymentPack({ max_bookings_per_day: 3 });
      const dates = [
        DateTime.fromISO('2025-01-15'),
        DateTime.fromISO('2025-01-15'),
      ];

      const result = getMaxoutInfoForPaymentPack(paymentPack, dates);

      expect(result.exceedsBookingMaxout).toBe(false);
    });

    it('exceeds when bookings on same day surpass limit', () => {
      const paymentPack = createPaymentPack({ max_bookings_per_day: 2 });
      const dates = [
        DateTime.fromISO('2025-01-15'),
        DateTime.fromISO('2025-01-15'),
        DateTime.fromISO('2025-01-15'),
      ];

      const result = getMaxoutInfoForPaymentPack(paymentPack, dates);

      expect(result).toEqual({
        exceedsBookingMaxout: true,
        maxoutInfo: { period: 'day', nb: 2 },
      });
    });

    it('considers existing bookings from maxout data', () => {
      const paymentPack = createPaymentPack({ max_bookings_per_day: 2 });
      const dates = [DateTime.fromISO('2025-01-15')];
      const existingMaxoutData: MaxoutBooking = {
        days: [
          {
            start_date: '2025-01-15',
            end_date: '2025-01-15',
            booking_available: 0,
          },
        ],
        weeks: [],
        months: [],
      };

      const result = getMaxoutInfoForPaymentPack(
        paymentPack,
        dates,
        existingMaxoutData,
      );

      expect(result.exceedsBookingMaxout).toBe(true);
    });
  });

  describe('week limit', () => {
    it('does not exceed when bookings spread across weeks', () => {
      const paymentPack = createPaymentPack({ max_bookings_per_week: 1 });
      const dates = [
        DateTime.fromISO('2025-01-06'), // Monday week 2
        DateTime.fromISO('2025-01-13'), // Monday week 3
      ];

      const result = getMaxoutInfoForPaymentPack(paymentPack, dates);

      expect(result.exceedsBookingMaxout).toBe(false);
    });

    it('exceeds when bookings in same week surpass limit', () => {
      const paymentPack = createPaymentPack({ max_bookings_per_week: 2 });
      const dates = [
        DateTime.fromISO('2025-01-06'), // Monday
        DateTime.fromISO('2025-01-07'), // Tuesday
        DateTime.fromISO('2025-01-08'), // Wednesday - same week
      ];

      const result = getMaxoutInfoForPaymentPack(paymentPack, dates);

      expect(result).toEqual({
        exceedsBookingMaxout: true,
        maxoutInfo: { period: 'week', nb: 2 },
      });
    });

    it('considers existing bookings from maxout data', () => {
      const paymentPack = createPaymentPack({ max_bookings_per_week: 2 });
      const dates = [DateTime.fromISO('2025-01-07')]; // Tuesday
      const existingMaxoutData: MaxoutBooking = {
        days: [],
        weeks: [
          {
            start_date: '2025-01-06',
            end_date: '2025-01-12',
            booking_available: 0,
          },
        ],
        months: [],
      };

      const result = getMaxoutInfoForPaymentPack(
        paymentPack,
        dates,
        existingMaxoutData,
      );

      expect(result.exceedsBookingMaxout).toBe(true);
    });
  });

  describe('month limit', () => {
    it('does not exceed when bookings spread across months', () => {
      const paymentPack = createPaymentPack({ max_bookings_per_month: 1 });
      const dates = [
        DateTime.fromISO('2025-01-01'), // January 1
        DateTime.fromISO('2025-02-01'), // February 1
      ];

      const result = getMaxoutInfoForPaymentPack(paymentPack, dates);

      expect(result.exceedsBookingMaxout).toBe(false);
    });

    it('exceeds when bookings in same month surpass limit', () => {
      const paymentPack = createPaymentPack({ max_bookings_per_month: 2 });
      const dates = [
        DateTime.fromISO('2025-01-01'), // January 1
        DateTime.fromISO('2025-01-12'), // January 12
        DateTime.fromISO('2025-01-23'), // January 23 - same month
      ];

      const result = getMaxoutInfoForPaymentPack(paymentPack, dates);

      expect(result).toEqual({
        exceedsBookingMaxout: true,
        maxoutInfo: { period: 'month', nb: 2 },
      });
    });

    it('considers existing bookings from maxout data', () => {
      const paymentPack = createPaymentPack({ max_bookings_per_month: 2 });
      const dates = [DateTime.fromISO('2025-01-01')]; // January 1
      const existingMaxoutData: MaxoutBooking = {
        days: [],
        weeks: [],
        months: [
          {
            start_date: '2025-01-01',
            end_date: '2025-01-31',
            booking_available: 0,
          },
        ],
      };

      const result = getMaxoutInfoForPaymentPack(
        paymentPack,
        dates,
        existingMaxoutData,
      );

      expect(result.exceedsBookingMaxout).toBe(true);
    });
  });

  describe('priority order', () => {
    it('returns day maxout when both day and week limits are exceeded', () => {
      const paymentPack = createPaymentPack({
        max_bookings_per_day: 1,
        max_bookings_per_week: 2,
        max_bookings_per_month: 2,
      });
      const dates = [
        DateTime.fromISO('2025-01-15'),
        DateTime.fromISO('2025-01-15'),
        DateTime.fromISO('2025-01-16'),
      ];

      const result = getMaxoutInfoForPaymentPack(paymentPack, dates);

      expect(result.maxoutInfo?.period).toBe('day');
    });
  });
});
