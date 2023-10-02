import React from 'react';
import ExpiredSpotDialog, { type Props } from '.';

const Template = (args: Props) => <ExpiredSpotDialog {...args} />;

export const Dialog = Template.bind({});
Dialog.args = {
  open: true,
  handleClose: () => {},
  loading: false,
};

export const LoadingDialog = Template.bind({});
LoadingDialog.args = {
  open: true,
  handleClose: () => {},
  loading: true,
};

export default {
  title: 'Library/checkout/ExpiredSpotDialog',
  component: ExpiredSpotDialog,
};
