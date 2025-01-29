import { formatPriceWithCurrency } from '#src/libs/theme/utils';

describe('formatPriceWithCurrency', () => {
  it('formats price with symbol after for €', () => {
    expect(formatPriceWithCurrency(100, '€')).toBe('100.00 €');
  });

  it('formats price with symbol before for $', () => {
    expect(formatPriceWithCurrency(100, '$')).toBe('$100.00');
  });

  it('formats negative price with symbol after for €', () => {
    expect(formatPriceWithCurrency(-100, '€')).toBe('-100.00 €');
  });

  it('formats negative price with symbol before for $', () => {
    expect(formatPriceWithCurrency(-100, '$')).toBe('-$100.00');
  });

  it('formats price with non-Euro symbol', () => {
    expect(formatPriceWithCurrency(100, 'RON')).toBe('100.00 RON');
  });

  it('handles negative price for non-Euro currency', () => {
    expect(formatPriceWithCurrency(-100, 'RON')).toBe('-100.00 RON');
  });

  it('formats price with space between value and currency symbol for euro-like symbols', () => {
    expect(formatPriceWithCurrency(100, '€')).toBe('100.00 €');
  });

  it('formats negative price with space between value and currency symbol for euro-like symbols', () => {
    expect(formatPriceWithCurrency(-100, '€')).toBe('-100.00 €');
  });
});
