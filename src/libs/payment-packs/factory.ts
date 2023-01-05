import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import moment from 'moment-timezone';

import { DATE_FORMAT } from '../../utils/datetime';
import { PaymentPack } from '#libs/payment-packs/types';

faker.locale = 'fr';

const now = moment().format(DATE_FORMAT);
const oneMonthLater = moment(now).add(1, 'M').format(DATE_FORMAT);

FactoryBot.define('PaymentPackCategory', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
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
  validity_daterange: {
    upper: oneMonthLater,
    lower: now,
  },
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

export default FactoryBot;
