import React, { memo } from 'react';
import Typography from '#src/components/css-only/Fabrique/Typography';
import { getPriceDetails } from '#src/libs/theme/utils';
import { useTheme } from '#src/pages/marketplace/passes/hooks/useTheme';
import clsx from 'clsx';
import './style.css';

type PriceProps = {
  price: number;
  tax?: number;
};

/**
 * Component that displays a formatted price with currency symbol, main amount, and fractional amount.
 *
 * @component
 * @param {number} price - The price to display.
 * @param {number} tax  - The tax.
 * @returns {JSX.Element} The formatted price component.
 */

const Price: React.FC<PriceProps> = ({ price, tax }) => {
  const { is_tax_excluded_in_marketplace: isExcludingTax } = useTheme();
  const { integerAmount, fractionalAmount, symbol } = getPriceDetails(
    price,
    tax,
    isExcludingTax,
  );
  return (
    <div className="bs-marketplace-card-price">
      <Typography
        className={clsx(
          'bs-marketplace-card-price__main-amount',
          'bs-marketplace-card-price__typography',
        )}
        variant="title-lg"
      >
        {symbol}
      </Typography>
      <Typography
        className={clsx(
          'bs-marketplace-card-price__main-amount',
          'bs-marketplace-card-price__typography',
        )}
        variant="title-lg"
      >
        {integerAmount}
      </Typography>
      <Typography
        className={clsx(
          'bs-marketplace-card-price__fractional-amount',
          'bs-marketplace-card-price__typography',
        )}
        variant="body-md"
      >
        {fractionalAmount}
      </Typography>
    </div>
  );
};

export default memo(Price);
