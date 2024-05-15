import React from 'react';
import withFormik from '@bbbtech/storybook-formik';
import { DateTime } from 'luxon';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import ConsumerExtensionCreateDialog from '.';
import ConsumerExtensionCreateForm from './ConsumerExtensionCreateForm.component';

export default {
  title: 'Components/ConsumerExtensionCreateDialog',
  decorators: [withFormik],
  component: ConsumerExtensionCreateDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    open: {
      description: 'If true the dialog is open',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    isLoading: {
      description: 'If true the submit button is disabled',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    timezone: {
      description: 'The timezone used to set the new pack validity date',
      control: { type: 'text' },
      defaultValue: false,
    },
    onClose: {
      description: 'The function fired once cancel button has been clicked',
      action: 'onClose',
    },
    onSubmit: {
      description: 'The function fired once submit button has been clicked',
      action: 'onSubmit',
    },
  },
} as ComponentMeta<typeof ConsumerExtensionCreateDialog>;

const Template: ComponentStory<typeof ConsumerExtensionCreateDialog> = (
  args: React.ComponentProps<typeof ConsumerExtensionCreateDialog>,
) => <ConsumerExtensionCreateDialog {...args} />;

const FormTemplate: ComponentStory<typeof ConsumerExtensionCreateForm> = (
  args: React.ComponentProps<typeof ConsumerExtensionCreateForm>,
) => <ConsumerExtensionCreateForm {...args} />;

export const Dialog = Template.bind({});
Dialog.args = {
  open: false,
  isLoading: false,
  onClose: () => {},
  onSubmit: () => {},
};

export const FormOnly = FormTemplate.bind({});
FormOnly.args = {
  minEndingDate: DateTime.now().startOf('month').toISODate(),
  maxEndingDate: DateTime.now().endOf('month').toISODate(),
  nbDays: 1,
  note: '',
};
