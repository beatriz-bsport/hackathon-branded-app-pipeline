import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

const NOW = DateTime.now().toISO();

export const fakeFailedInvoices = (count: number) =>
  faker.helpers.multiple(
    () => {
      return {
        uuid: faker.string.uuid(),
        date: NOW,
        next_retry_date: NOW,
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
    date: NOW,
    uuid: faker.string.uuid(),
    stripe_invoice_pdf: faker.internet.url(),
  },
  {
    amount_paid_cts: faker.number.int({ min: 1000, max: 10000 }).toString(),
    date: NOW,
    uuid: faker.string.uuid(),
    stripe_invoice_pdf: faker.internet.url(),
  },
  {
    amount_paid_cts: faker.number.int({ min: 1000, max: 10000 }).toString(),
    date: NOW,
    uuid: faker.string.uuid(),
    stripe_invoice_pdf: faker.internet.url(),
  },
];
