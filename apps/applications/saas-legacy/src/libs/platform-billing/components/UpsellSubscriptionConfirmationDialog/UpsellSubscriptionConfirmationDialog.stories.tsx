import React from 'react';
import UpsellSubscriptionConfirmationDialog, { type Props } from '.';

const Template = (args: Props) => (
  <UpsellSubscriptionConfirmationDialog {...args} />
);

export const Main = Template.bind({});
Main.args = {
  message: 'You have successfully subscribed to {add-on}',
  onClose: () => {},
  open: true,
};

export default {
  title: 'Library/platform-billing/UpsellSubscriptionConfirmationDialog',
  component: UpsellSubscriptionConfirmationDialog,
};
