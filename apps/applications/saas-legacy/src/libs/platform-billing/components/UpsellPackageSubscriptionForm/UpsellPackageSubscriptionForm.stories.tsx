import React from 'react';

import UpsellPackageSubscriptionForm, { type Props } from '.';
import { UpsellPackage } from '#src/libs/company/types';

const Template = (args: Props) => <UpsellPackageSubscriptionForm {...args} />;

export const Main = Template.bind({});
Main.args = {
  upsellPackage: {
    id: 1,
    name: 'Add-on title',
    description:
      'Add a description. Add a description. Add a description. Add a description. Add a description.',
    is_recurrent: true,
    upsell_identifier: 1,
    readable_identifier: '1',
    price_cts: 300,
    hidden: false,
    tax: 'Tax prop',
  } as UpsellPackage,
  onClose: () => {},
  onSubscribe: () => {},
  loading: false,
};

export default {
  title: 'Library/platform-billing/UpsellPackageSubscriptionForm',
  component: UpsellPackageSubscriptionForm,
};
