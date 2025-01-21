import React from 'react';

import clsx from 'clsx';

import { Color } from './types';

import './styles.css';

export type Props = {
  children?: React.ReactNode;
  amount: number | string;
  formatPriceWithCurrency: (
    price: number | string,
    isExcludingTax?: boolean,
    tax?: number | string,
  ) => string;
  color?: Color;
  classes?: { [key: string]: string | boolean };
  isExcludingTax: boolean;
  tax?: number | string;
};

export const Price: React.FC<Props> = ({
  children,
  amount,
  color,
  formatPriceWithCurrency,
  classes,
  isExcludingTax,
  tax,
}) => {
  const price = formatPriceWithCurrency(amount, isExcludingTax, tax);

  return (
    <div
      className={clsx('bs-price__container', {
        default: !color,
        [`${color}`]: color,
        ...classes,
      })}
    >
      <span>{price}</span>
      {children}
    </div>
  );
};

export default React.memo(Price);
