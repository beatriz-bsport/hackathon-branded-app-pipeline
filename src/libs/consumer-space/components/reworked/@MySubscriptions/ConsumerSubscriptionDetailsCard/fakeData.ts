import { faker } from '@faker-js/faker';
import moment from 'moment-timezone';

export const fakeFailedInvoices = (count: number) =>
  faker.helpers.multiple(
    () => {
      return {
        uuid: faker.string.uuid(),
        date: moment().format(),
        next_retry_date: moment().format(),
        payments: [
          {
            uuid: faker.string.uuid(),
            price: faker.number.int({ min: 1000, max: 10000 }),
            payment_note: 'Your card was denied.',
          },
        ],
      };
    },
    { count },
  );

export const fakeSuccessfulInvoices = [
  {
    amount_paid_cts: faker.number.int({ min: 1000, max: 10000 }).toString(),
    date: moment().format(),
    uuid: faker.string.uuid(),
  },
  {
    amount_paid_cts: faker.number.int({ min: 1000, max: 10000 }).toString(),
    date: moment().format(),
    uuid: faker.string.uuid(),
  },
  {
    amount_paid_cts: faker.number.int({ min: 1000, max: 10000 }).toString(),
    date: moment().format(),
    uuid: faker.string.uuid(),
  },
];
