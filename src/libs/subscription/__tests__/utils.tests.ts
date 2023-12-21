import moment from 'moment-timezone';

import { computeProrataPriceForSubscription } from '../utils';

describe('Subscription Prorata computation', () => {
  it('Check prorate price computation when done during month several days before', () => {
    const firstBillingDate = moment('2023-03-24');
    const monthBillingDay = 31;
    const recurrentPrice = '100';

    const firstInvoicePrice = computeProrataPriceForSubscription(
      firstBillingDate,
      monthBillingDay,
      recurrentPrice,
    );
    // Expected result is 100 / 31 * 7
    expect(parseFloat(firstInvoicePrice)).toBe(22.58);
  });

  it('Check prorate price computation when done during month one day before', () => {
    const firstBillingDate = moment('2023-03-30');
    const monthBillingDay = 31;
    const recurrentPrice = '100';

    const firstInvoicePrice = computeProrataPriceForSubscription(
      firstBillingDate,
      monthBillingDay,
      recurrentPrice,
    );
    // Expected result is 100 / 31 * 1
    expect(parseFloat(firstInvoicePrice)).toBe(3.23);
  });

  it('Check prorate price computation when done for the same day as the billing day', () => {
    const firstBillingDate = moment('2023-03-31');
    const monthBillingDay = 31;
    const recurrentPrice = '100';

    const firstInvoicePrice = computeProrataPriceForSubscription(
      firstBillingDate,
      monthBillingDay,
      recurrentPrice,
    );
    // Expected result is the actual contact reccurent price
    expect(parseFloat(firstInvoicePrice)).toBe(100);
  });

  it('Check prorate price when done on the last day of the month and end of year.', () => {
    const firstBillingDate = moment('2023-12-31');
    const monthBillingDay = 1;
    const recurrentPrice = '31000';

    const firstInvoicePrice = computeProrataPriceForSubscription(
      firstBillingDate,
      monthBillingDay,
      recurrentPrice,
    );
    // Expected result is 31000 / 31 * 1
    expect(parseFloat(firstInvoicePrice)).toBe(1000);
  });

  it('Check prorate price during a leap year when the billing-day is beyond the month`s end.', () => {
    const firstBillingDate = moment('2024-02-20');
    const monthBillingDay = 31;
    const recurrentPrice = '29000';

    const firstInvoicePrice = computeProrataPriceForSubscription(
      firstBillingDate,
      monthBillingDay,
      recurrentPrice,
    );
    // Expected result is 29000 / 29 (29 days in February 2024, leap year) * 9
    expect(parseFloat(firstInvoicePrice)).toBe(9000);
  });

  it('Check prorate price when billing-day is before the first billing date.', () => {
    const firstBillingDate = moment('2023-01-20');
    const monthBillingDay = 15;
    const recurrentPrice = '31000';

    const firstInvoicePrice = computeProrataPriceForSubscription(
      firstBillingDate,
      monthBillingDay,
      recurrentPrice,
    );
    // Expected result is 31000 / 31 * 26
    expect(parseFloat(firstInvoicePrice)).toBe(26000);
  });

  it('Check prorate price passing a non-existing date.', () => {
    const firstBillingDate = moment('2023-02-31');
    const monthBillingDay = 1;
    const recurrentPrice = '1';

    const firstInvoicePrice = computeProrataPriceForSubscription(
      firstBillingDate,
      monthBillingDay,
      recurrentPrice,
    );
    // Expected result is NaN because the date given doesn't exist.
    expect(parseFloat(firstInvoicePrice)).toBe(NaN);
  });

  it('Check prorate price passing a non-number price.', () => {
    const firstBillingDate = moment('2023-02-31');
    const monthBillingDay = 1;
    const recurrentPrice = 'abc';

    const firstInvoicePrice = computeProrataPriceForSubscription(
      firstBillingDate,
      monthBillingDay,
      recurrentPrice,
    );
    // Expected result is NaN because the date given doesn't exist.
    expect(parseFloat(firstInvoicePrice)).toBe(NaN);
  });
});
