import React from 'react';
import './styles.css';

import classNames from 'classnames';

import { Color } from './types';

export type Props = {
  children?: React.ReactNode;
  amount: number | string;
  formatPriceWithCurrency: (amount: number | string) => string;
  color?: Color;
  classes?: { [key: string]: string };
};

export const Price: React.FC<Props> = ({
  children,
  amount,
  color,
  formatPriceWithCurrency,
  classes,
}) => {
  const price = formatPriceWithCurrency(amount);

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
