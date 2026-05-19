import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getAvailableContracts } from '../master-data/available-payment';
import type {
  ContractWithPaymentPack,
  OfferREST,
  OfferStatus,
  PaymentPack,
} from '../master-data/available-payment.type';

// bookable_status value for a bookable offer (matches OFFER_BOOKABLE_STATUS_BOOKABLE = 0)
const BOOKABLE = 0;
const FIXED_NOW = new Date('2026-05-04T12:00:00+02:00');

const makeOfferStatusById = (
  offers: OfferREST[],
): { [id: number]: OfferStatus } =>
  Object.fromEntries(
    offers.map((o) => [
      o.id,
      { bookable_status: BOOKABLE } as unknown as OfferStatus,
    ]),
  );

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
  duration_months: 1, // ensures end = baseDate + 1 month - 1 day ≥ offer date
  ...overrides,
});

const createContract = (
  overrides: Partial<ContractWithPaymentPack> = {},
): ContractWithPaymentPack => ({
  id: 1,
  company: 1,
  name: 'Monthly sub',
  description: '',
  contract: '',
  manage_only: false,
  auto_renewal: false,
  tax: '20',
  flat_fee: 0,
  recurrent_price: 50,
  nb_interval: 12,
  disabled: false,
  interval: 'month',
  recurrence_basis: 1,
  allPaymentPacks: [createPaymentPack()],
  ...overrides,
});

const createOffer = (overrides: Partial<OfferREST> = {}): OfferREST =>
  ({
    id: 1,
    date_start: DateTime.now().plus({ months: 1 }).toISO(),
    credit_price: 1,
    timezone_name: 'Europe/Paris',
    ...overrides,
  }) as OfferREST;

// Helper to get a date ISO string offset from now
const futureDate = (months = 0, weeks = 0, days = 0) =>
  DateTime.now().plus({ months, weeks, days }).toISO()!;

describe('getAvailableContracts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns contract when single offer fits within PP credits', () => {
    const offer = createOffer();
    const contract = createContract({
      allPaymentPacks: [createPaymentPack({ credits: 5 })],
    });

    const result = getAvailableContracts(
      [contract],
      [],
      offer,
      'Europe/Paris',
      makeOfferStatusById([offer]),
    );

    expect(result).toHaveLength(1);
  });

  it('keeps contract when offers span multiple months but each month fits', () => {
    const baseOffer = createOffer({
      id: 1,
      date_start: futureDate(1),
      credit_price: 2,
    });
    const selectedOffers = [
      createOffer({
        id: 2,
        date_start: futureDate(2),
        credit_price: 2,
      }),
      createOffer({
        id: 3,
        date_start: futureDate(3),
        credit_price: 2,
      }),
    ];
    const contract = createContract({
      interval: 'month',
      allPaymentPacks: [createPaymentPack({ credits: 3 })],
    });

    const result = getAvailableContracts(
      [contract],
      selectedOffers,
      baseOffer,
      'Europe/Paris',
      makeOfferStatusById([baseOffer, ...selectedOffers]),
    );

    expect(result).toHaveLength(1);
  });

  it('filters out contract when one month exceeds PP credits', () => {
    const baseOffer = createOffer({
      id: 1,
      date_start: futureDate(1, 1), // middle of month 2 — avoids boundary
      credit_price: 2,
    });
    const selectedOffers = [
      createOffer({
        id: 2,
        date_start: futureDate(1, 2), // also in month 2 (same interval as baseOffer)
        credit_price: 2,
      }),
      createOffer({
        id: 3,
        date_start: futureDate(2, 1), // middle of month 3 — different interval
        credit_price: 1,
      }),
    ];
    const contract = createContract({
      interval: 'month',
      allPaymentPacks: [createPaymentPack({ credits: 3 })],
    });

    const result = getAvailableContracts(
      [contract],
      selectedOffers,
      baseOffer,
      'Europe/Paris',
      makeOfferStatusById([baseOffer, ...selectedOffers]),
    );

    expect(result).toHaveLength(0);
  });

  it('keeps contract with unlimited PP regardless of credits', () => {
    const baseOffer = createOffer({ credit_price: 100 });
    const selectedOffers = [
      createOffer({
        id: 2,
        date_start: futureDate(1, 0, 1),
        credit_price: 100,
      }),
    ];
    const contract = createContract({
      allPaymentPacks: [createPaymentPack({ unlimited: true, credits: 0 })],
    });

    const result = getAvailableContracts(
      [contract],
      selectedOffers,
      baseOffer,
      'Europe/Paris',
      makeOfferStatusById([baseOffer, ...selectedOffers]),
    );

    expect(result).toHaveLength(1);
  });

  it('does not filter on guest constraint (not applicable at this level)', () => {
    // mustAllowBookingForGuest is always false when computed internally by getOfferContraints
    // (no additionalGuestCount/isBookingForInviteeOnly params exposed here)
    const offer = createOffer();
    const contract = createContract({
      allPaymentPacks: [createPaymentPack({ allow_guest_pass: false })],
    });

    const result = getAvailableContracts(
      [contract],
      [],
      offer,
      'Europe/Paris',
      makeOfferStatusById([offer]),
    );

    expect(result).toHaveLength(1);
  });

  it('groups by week for weekly contracts', () => {
    const baseOffer = createOffer({
      id: 1,
      date_start: futureDate(0, 1), // next week
      credit_price: 1,
    });
    const selectedOffers = [
      createOffer({
        id: 2,
        date_start: futureDate(0, 2), // week after
        credit_price: 1,
      }),
    ];
    const contract = createContract({
      interval: 'week',
      nb_interval: 52,
      allPaymentPacks: [
        createPaymentPack({ credits: 1, duration_months: 0, duration_days: 7 }),
      ],
    });

    const result = getAvailableContracts(
      [contract],
      selectedOffers,
      baseOffer,
      'Europe/Paris',
      makeOfferStatusById([baseOffer, ...selectedOffers]),
    );

    expect(result).toHaveLength(1);
  });

  it('filters out weekly contract when one week exceeds credits', () => {
    const baseOffer = createOffer({
      id: 1,
      date_start: futureDate(0, 1), // next week Monday
      credit_price: 1,
    });
    const selectedOffers = [
      createOffer({
        id: 2,
        date_start: futureDate(0, 1, 1), // next week Tuesday (same week)
        credit_price: 1,
      }),
    ];
    const contract = createContract({
      interval: 'week',
      nb_interval: 52,
      allPaymentPacks: [
        createPaymentPack({ credits: 1, duration_months: 0, duration_days: 7 }),
      ],
    });

    const result = getAvailableContracts(
      [contract],
      selectedOffers,
      baseOffer,
      'Europe/Paris',
      makeOfferStatusById([baseOffer, ...selectedOffers]),
    );

    expect(result).toHaveLength(0);
  });

  it('filters out contract when offer falls outside all intervals (nb_interval too small)', () => {
    const offer = createOffer({ date_start: futureDate(6) });
    const contract = createContract({
      interval: 'month',
      nb_interval: 2, // only covers next 2 months
      allPaymentPacks: [createPaymentPack({ credits: 5 })],
    });
    const result = getAvailableContracts(
      [contract],
      [],
      offer,
      'Europe/Paris',
      makeOfferStatusById([offer]),
    );
    expect(result).toHaveLength(0);
  });

  it('handles multiple contracts: keeps compatible ones, filters incompatible', () => {
    const offer = createOffer({ credit_price: 2 });
    const compatible = createContract({
      id: 1,
      allPaymentPacks: [createPaymentPack({ credits: 5 })],
    });
    const incompatible = createContract({
      id: 2,
      allPaymentPacks: [createPaymentPack({ credits: 1 })],
    });
    const result = getAvailableContracts(
      [compatible, incompatible],
      [],
      offer,
      'Europe/Paris',
      makeOfferStatusById([offer]),
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 1 });
  });

  it('annotates exceedsBookingMaxout on the result when PP has a booking limit', () => {
    const offer = createOffer();
    const selectedOffer = createOffer({
      id: 2,
      date_start: futureDate(1, 0, 1),
      credit_price: 1,
    });
    // Two offers in the same month → exceeds the 1/month limit
    const contract = createContract({
      allPaymentPacks: [
        createPaymentPack({ credits: 5, max_bookings_per_month: 1 }),
      ],
    });
    const result = getAvailableContracts(
      [contract],
      [selectedOffer],
      offer,
      'Europe/Paris',
      makeOfferStatusById([offer, selectedOffer]),
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ exceedsBookingMaxout: true });
  });

  it('uses second PP in list when first PP validity does not cover the interval', () => {
    const offer = createOffer({ date_start: futureDate(2) });
    const tooShortPack = createPaymentPack({
      id: 1,
      credits: 5,
      duration_months: 1,
    });
    const coveringPack = createPaymentPack({
      id: 2,
      credits: 5,
      duration_months: 3,
    });
    const contract = createContract({
      allPaymentPacks: [tooShortPack, coveringPack],
    });
    const result = getAvailableContracts(
      [contract],
      [],
      offer,
      'Europe/Paris',
      makeOfferStatusById([offer]),
    );
    expect(result).toHaveLength(1);
  });

  it('handles recurrence_basis > 1 (bi-monthly grouping)', () => {
    const baseOffer = createOffer({
      id: 1,
      date_start: futureDate(1),
      credit_price: 1,
    });
    const selectedOffer = createOffer({
      id: 2,
      date_start: futureDate(3), // second bi-monthly interval
      credit_price: 1,
    });
    const contract = createContract({
      interval: 'month',
      recurrence_basis: 2,
      nb_interval: 6,
      allPaymentPacks: [createPaymentPack({ credits: 2, duration_months: 2 })],
    });
    const result = getAvailableContracts(
      [contract],
      [selectedOffer],
      baseOffer,
      'Europe/Paris',
      makeOfferStatusById([baseOffer, selectedOffer]),
    );
    expect(result).toHaveLength(1);
  });
});
