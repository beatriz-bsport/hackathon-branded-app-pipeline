import React from 'react';
import { UpsellBlockerDialog } from './UpsellBlocker.component';
import type { ComponentMeta } from '@storybook/react';

import { action } from '@storybook/addon-actions';

import CustomStarIcon from '#components/icons/CustomStarIcon.component';

const actionData = {
  onClick: action('onClick'),
};

const CustomUpsellBlockerDialogTemplate = (
  args: React.ComponentProps<typeof UpsellBlockerDialog>,
) => <UpsellBlockerDialog {...args} />;

export const AudienceBlocker = CustomUpsellBlockerDialogTemplate.bind({});
AudienceBlocker.args = {
  upsellIdentifier: 31,
  CustomIconComponent: <CustomStarIcon />,
  requestUpsellPackage: actionData.onClick,
};

export const SubscribableUpsellBlocker = CustomUpsellBlockerDialogTemplate.bind(
  {},
);
SubscribableUpsellBlocker.args = {
  upsellIdentifier: 33,
  handleOpenSubscriptionForm: actionData.onClick,
  upsellPackage: true,
};

export const RequestAccessUpsellBlocker =
  CustomUpsellBlockerDialogTemplate.bind({});
RequestAccessUpsellBlocker.args = {
  upsellIdentifier: 33,
  requestUpsellPackage: actionData.onClick,
};

export const DefaultUpsellBlocker = CustomUpsellBlockerDialogTemplate.bind({});
DefaultUpsellBlocker.args = {
  upsellIdentifier: 33,
};

export default {
  title: 'Library/PlatformBilling/UpsellBlockerDialog',
  component: UpsellBlockerDialog,
  argTypes: {
    upsellIdentifier: {
      control: 'number',
      description:
        'Identifier of the upsell. It will determine the action when clicking and the texts.',
    },
    featureList: {
      description:
        'List of the upsells the company has. Used to know if the dialog has to be displayed.',
    },
    CustomIconComponent: {
      description: '(Optional) Icon of the dialog.',
    },
    requestUpsellPackage: {
      description: '(Optional) Action to request upsell package.',
    },
    handleOpenSubscriptionForm: {
      description: '(Optional) Action to have no information about the upsell.',
    },
    upsellPackage: {
      description:
        '(Optional) Upsell package corresponding to the upsellIdentifier.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "This component is an abstract app bar. It gets displayed on a 'no pop-up' widget. It is minimal in order to increase loading speed.",
      },
    },
  },
} as ComponentMeta<typeof UpsellBlockerDialog>;
