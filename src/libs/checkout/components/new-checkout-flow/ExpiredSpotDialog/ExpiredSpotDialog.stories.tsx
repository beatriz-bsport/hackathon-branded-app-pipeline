import React from 'react';
import ExpiredSpotDialog, { type Props } from '.';

const Template = (args: Props) => <ExpiredSpotDialog {...args} />;

export const Dialog = Template.bind({});
Dialog.args = {
  open: true,
  handleClose: () => {},
  redirectToSpotSelection: () => {},
};

export default {
  title: 'Library/checkout/ExpiredSpotDialog',
  component: ExpiredSpotDialog,
};
