import React from 'react';
import './styles.css';

import classNames from 'classnames';

import { Color } from './types';

export type Props = {
  children?: React.ReactNode;
  amount: number | string;
  formatPriceWithCurrency: (
    price: number | string,
    isExcludingTax?: boolean,
    tax?: number,
  ) => string;
  color?: Color;
  classes?: { [key: string]: string };
  isExcludingTax: boolean;
  tax: number;
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
      className={classNames('bs-price__container', {
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

export default Price;
