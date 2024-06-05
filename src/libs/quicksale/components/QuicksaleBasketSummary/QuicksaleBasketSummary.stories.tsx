import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import QuicksaleBasketSummary from './QuicksaleBasketSummary.component';
import {
  basketFactory,
  checkoutItemsFactory,
} from '#src/libs/checkout/factories';
import { MemberFactory } from '#src/libs/member/factories/Member';

const actionData = {
  openMemberAuthenticationModal: action('openMemberAuthenticationModal'),
  onCouponRemove: action('onCouponRemove'),
};

const coupons = checkoutItemsFactory(Math.random() > 0.5 ? 1 : 0);

export default {
  title: 'Components/Quicksale/QuicksaleBasketSummary',
  component: QuicksaleBasketSummary,
  argTypes: {
    openMemberAuthenticationModal: actionData.openMemberAuthenticationModal,
    onCouponRemove: actionData.onCouponRemove,
  },
} as ComponentMeta<typeof QuicksaleBasketSummary>;

const Template: ComponentStory<typeof QuicksaleBasketSummary> = (args) => {
  const [invoiceFootNote, setInvoiceFootNote] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString());
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 400, height: '70vh' }}>
        <QuicksaleBasketSummary
          {...args}
          date={date}
          setDate={setDate}
          invoiceFootNote={invoiceFootNote}
          setInvoiceFootNote={setInvoiceFootNote}
        />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  basket: basketFactory(10),
  member: MemberFactory({}),
  coupons,
};
