// @ts-nocheck
import FactoryBot from 'ya-factorybot';
import { faker } from '@faker-js/faker';

import { PaymentPack } from '#libs/payment-packs/types';

faker.locale = 'fr';

FactoryBot.define('PaymentPackCategory', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(2),
  company_id: 1,
  category_ordering: () => Math.floor(Math.random() * 10),
});

FactoryBot.define('PaymentPack', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  price: Math.floor(Math.random() * 100),
  credits: Math.floor(Math.random() * 30),
  unlimited: Math.random() < 0.5,
  duration_days: Math.floor(Math.random() * 30),
  duration_months: Math.floor(Math.random() * 12),
  duration_years: Math.floor(Math.random() * 3),
  start_date_method: Math.floor(Math.random() * 4),
});

FactoryBot.define('PaymentPackWithDateRange', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  price: Math.floor(Math.random() * 100),
  credits: Math.floor(Math.random() * 30),
  unlimited: Math.random() < 0.5,
  validity_daterange: `{"bounds": "[)", "lower": "2023-04-27", "upper": "2023-06-10"}`,
  start_date_method: Math.floor(Math.random() * 4),
});

export const PaymentPackStorybookFactory = (
  id?: number,
  manager_only?: boolean,
) => {
  const paymentPack: Partial<PaymentPack> = {
    id: id || Math.floor(Math.random() * 1000),
    name: faker.hacker.phrase(),
    price: Math.floor(Math.random() * 100),
    credits: Math.floor(Math.random() * 30),
    unlimited: Math.random() < 0.5,
    manager_only,
    metaActivities: [],
  };
  return paymentPack;
};

export const PaymentPackStorybookListFactory = (
  nb: number,
  manager_only?: boolean,
) => {
  const paymentPackIds = [...Array(nb).keys()];
  return paymentPackIds.map((id) => {
    return PaymentPackStorybookFactory(id + 1, !!manager_only);
  });
};

FactoryBot.define('PaymentPackFullDetails', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  price: Math.floor(Math.random() * 100),
  credits: Math.floor(Math.random() * 30),
  unlimited: Math.random() < 0.5,
  duration_days: Math.floor(Math.random() * 30),
  duration_months: Math.floor(Math.random() * 12),
  duration_years: Math.floor(Math.random() * 3),
  start_date_method: Math.floor(Math.random() * 4),
  new_member_only: Math.random() < 0.5,
  full_vod_access: Math.random() < 0.5,
  is_universal_pass: Math.random() < 0.5,
  onsite_payment_available: Math.random() < 0.5,
  only_vod_access: Math.random() < 0.5,
  max_bookings_per_day: Math.floor(Math.random() * 10),
  max_bookings_per_week: Math.floor(Math.random() * 10),
  max_bookings_per_month: Math.floor(Math.random() * 10),
  max_purchase_per_member: Math.floor(Math.random() * 10),
  categories: Array.from({ length: Math.floor(Math.random() * 10) }, () =>
    Math.floor(Math.random() * 999),
  ),
  establishments: Array.from({ length: Math.floor(Math.random() * 10) }, () =>
    Math.floor(Math.random() * 999),
  ),
  metaActivities: Array.from({ length: Math.floor(Math.random() * 10) }, () =>
    Math.floor(Math.random() * 999),
  ),
  penalty_active: Math.random() < 0.5,
  penalty_kind: Math.floor(Math.random() * 1),
  penalty_days_blocked: Math.floor(Math.random() * 30),
  penalty_nb_late_cancellations: Math.floor(Math.random() * 30),
  penalty_nb_days: Math.floor(Math.random() * 30),
  penalty_account_value: Math.floor(Math.random() * 30),
  description: () => faker.random.words(100),
  off_peak_schedule: {
    '1': [['08:00', '12:00']],
    '2': [['08:00', '12:00']],
    '3': [['08:00', '12:00']],
    '4': [['08:00', '12:00']],
    '5': [['08:00', '12:00']],
    '6': [['08:00', '12:00']],
    '7': [['00:00', '23:59']],
  },
});

export default FactoryBot;
