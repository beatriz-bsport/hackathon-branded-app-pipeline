import React from 'react';
import UpsellBlocker from './UpsellBlocker.component';
import type { ComponentMeta } from '@storybook/react';

import { action } from '@storybook/addon-actions';

import CustomStarIcon from '#components/icons/CustomStarIcon.component';

const actionData = {
  onClick: action('onClick'),
};

const CustomUpsellBlockerTemplate = (
  args: React.ComponentProps<typeof UpsellBlocker>,
) => <UpsellBlocker {...args} />;

export const CadenceBlocker = CustomUpsellBlockerTemplate.bind({});
CadenceBlocker.args = {
  upsellIdentifier: 31,
  CustomIconComponent: <CustomStarIcon />,
  onClick: actionData.onClick,
};

export const DefaultIconBlocker = CustomUpsellBlockerTemplate.bind({});
DefaultIconBlocker.args = {
  upsellIdentifier: 33,
  onClick: actionData.onClick,
};

export default {
  title: 'Library/PlatformBilling/UpsellBlocker',
  component: UpsellBlocker,
  argTypes: {
    upsellIdentifier: {
      control: 'number',
      description:
        'Identifier of the upsell. It will determine the action when clicking and the texts.',
    },
    CustomIconComponent: {
      description: 'Icon of the dialog.',
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
} as ComponentMeta<typeof UpsellBlocker>;
