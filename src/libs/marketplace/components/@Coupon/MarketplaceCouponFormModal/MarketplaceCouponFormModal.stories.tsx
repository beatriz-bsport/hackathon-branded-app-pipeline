import React from 'react';
import { Props, MarketplaceCouponFormModalForStorybook } from '.';

const CouponFormModalTemplate = (args: Props) => (
  // @ts-ignore
  <MarketplaceCouponFormModalForStorybook {...args} />
);

export const OpenDialog = CouponFormModalTemplate.bind({});
OpenDialog.args = {
  isOpen: true,
  onDialogClose: () => {},
};

export default {
  title:
    'Components/Marketplace/Subscriptions/Modals/MarketplaceCouponFormModal',
  component: MarketplaceCouponFormModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
