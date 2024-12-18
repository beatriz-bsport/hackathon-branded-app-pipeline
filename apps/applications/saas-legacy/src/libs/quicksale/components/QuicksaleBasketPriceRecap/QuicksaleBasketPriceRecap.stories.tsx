import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { fakerEN as faker } from '@faker-js/faker';

import QuicksaleBasketPriceRecap from './QuicksaleBasketPriceRecap.component';
import { generateRandomPrice } from '../../../../utils/factories';

const actionData = {
  attachCoupon: action('attachCoupon'),
};

const basketTotalPrice = generateRandomPrice(faker);

export default {
  title: 'Components/Quicksale/QuicksaleBasketPriceRecap',
  component: QuicksaleBasketPriceRecap,
  argTypes: {
    attachCoupon: actionData.attachCoupon,
  },
} as ComponentMeta<typeof QuicksaleBasketPriceRecap>;

const Template: ComponentStory<typeof QuicksaleBasketPriceRecap> = (args) => {
  const [modifiedPrice, setModifiedPrice] = React.useState(basketTotalPrice);
  return (
    <div style={{ background: 'white' }}>
      <QuicksaleBasketPriceRecap
        {...args}
        modifiedPrice={modifiedPrice}
        setModifiedPrice={setModifiedPrice}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  basketTotalPrice,
  partialPayment:
    Math.random() > 0.5
      ? generateRandomPrice(faker, { max: basketTotalPrice - 1 })
      : undefined,
  loading: false,
};
