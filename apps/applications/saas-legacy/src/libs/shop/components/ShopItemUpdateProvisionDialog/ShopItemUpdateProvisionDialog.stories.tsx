import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import ShopItemUpdateProvisionDialog from '.';

export default {
  title: 'Library/Shop/ShopItemUpdateProvisionDialog',
  component: ShopItemUpdateProvisionDialog,
  argTypes: {
    isOpen: {
      description: 'If `true`, the dialog is open',
      control: { type: 'boolean' },
    },
    isLoading: {
      description:
        'If `true`, the submit button is disabled (action performing in the background)',
      control: { type: 'boolean' },
    },
    onClose: {
      description: 'Action fired when the cancel button is clicked',
    },
    onSubmit: {
      description: 'Action fired when the submit button is clicked',
    },
  },
} as ComponentMeta<typeof ShopItemUpdateProvisionDialog>;

const Template: ComponentStory<typeof ShopItemUpdateProvisionDialog> = (
  args,
) => <ShopItemUpdateProvisionDialog {...args} />;

export const EmptyForm = Template.bind({});
EmptyForm.args = {};
