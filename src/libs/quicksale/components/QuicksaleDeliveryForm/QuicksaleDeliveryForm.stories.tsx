import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import QuicksaleDeliveryForm from './QuicksaleDeliveryForm.component';
import { QuicksaleDeliveryType } from '#libs/quicksale/constants';
import { BasketAddress } from '#libs/checkout/types';

export default {
  title: 'Components/Quicksale/QuicksaleDeliveryForm',
  component: QuicksaleDeliveryForm,
} as ComponentMeta<typeof QuicksaleDeliveryForm>;

const Template: ComponentStory<typeof QuicksaleDeliveryForm> = (args) => {
  const [deliveryType, setDeliveryType] = React.useState<QuicksaleDeliveryType>(
    QuicksaleDeliveryType.OnSpot,
  );
  const [basketAddress, setBasketAddress] = React.useState<BasketAddress>(null);
  return (
    <QuicksaleDeliveryForm
      {...args}
      deliveryType={deliveryType}
      setDeliveryType={setDeliveryType}
      basketAddress={basketAddress}
      setBasketAddress={setBasketAddress}
    />
  );
};

export const Default = Template.bind({});
