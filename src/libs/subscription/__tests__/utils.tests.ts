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
});
