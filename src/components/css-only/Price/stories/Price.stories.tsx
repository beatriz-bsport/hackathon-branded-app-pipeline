import React from 'react';

import Price, { Props } from '../';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import './stories.styles.css';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

const PriceTemplate = (args: Props) => <Price {...args} />;

const PriceWithIconTemplate = (args: Props) => (
  <Price {...args}>
    <div className="icon">
      <ShoppingCartIcon fontSize="small" />
    </div>
  </Price>
);

const defaultArgs = {
  amount: '250.50',
  formatPriceWithCurrency: getCurrencyDisplayWithPrice,
};

export const JustPrice = PriceTemplate.bind({});
JustPrice.args = defaultArgs;

export const PriceWithIcon = PriceWithIconTemplate.bind({});

const fancyArgs = {
  amount: '250.50',
  formatPriceWithCurrency: (amount: string) => `💸 ${amount} 💸`,
};

PriceWithIcon.args = fancyArgs;

export default {
  title: 'Components/CssOnly/Price',
  component: Price,
  parameters: {
    docs: {
      page: null,
    },
  },
};
