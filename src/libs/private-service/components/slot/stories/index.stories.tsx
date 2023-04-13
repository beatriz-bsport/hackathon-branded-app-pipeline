// @ts-nocheck
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import PrivateSlotForm from './PrivateSlotForm.component';

const actionsData = {
  onSubmit: action('onSubmit'),
  onCancel: action('onCancel'),
};

export default {
  title: 'Library/PrivateBooking/Form/PrivateSlotForm',
  component: PrivateSlotForm,
  args: {
    onSubmit: actionsData.onSubmit,
    onCancel: actionsData.onCancel,
  },
} as ComponentMeta<typeof PrivateSlotForm>;

const PrivateSlotFormTemplate: ComponentStory<typeof PrivateSlotForm> = (
  args,
) => <PrivateSlotForm {...args} />;

export const EmptyForm = PrivateSlotFormTemplate.bind({});
