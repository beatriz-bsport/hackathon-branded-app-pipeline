import React from 'react';
import { DateTime } from 'luxon';
import withFormik from '@bbbtech/storybook-formik';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import MassExtensionCreateDialog from '.';
import MassExtensionCreateForm from './MassExtensionCreateForm.component';

export default {
  title: 'Components/MassExtensionCreateDialog',
  decorators: [withFormik],
  component: MassExtensionCreateDialog,
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
    onClose: {
      description: 'The function fired once cancel button has been clicked',
      action: 'onClose',
    },
    onSubmit: {
      description: 'The function fired once submit button has been clicked',
      action: 'onSubmit',
    },
  },
} as ComponentMeta<typeof MassExtensionCreateDialog>;

const Template: ComponentStory<typeof MassExtensionCreateDialog> = (
  args: React.ComponentProps<typeof MassExtensionCreateDialog>,
) => <MassExtensionCreateDialog {...args} />;

const FormTemplate: ComponentStory<typeof MassExtensionCreateForm> = (
  args: React.ComponentProps<typeof MassExtensionCreateForm>,
) => <MassExtensionCreateForm {...args} />;

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
