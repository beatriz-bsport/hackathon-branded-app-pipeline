// @ts-nocheck
import React from 'react';
import DelayedNumericInput, { Props } from './DelayedNumericInput.component';

import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Input/DelayedNumericInput',
  component: DelayedNumericInput,
  args: {
    error: false,
    helperText: 'helper text',
    value: 0,
    isPositive: false,
    InputProps: {
      inputProps: { min: null, max: null },
    },
  },
};

const Template = (args: Props) => (
  <DelayedNumericInput
    {...args}
    onChange={action('onChange')}
    onBlur={action('onBlur')}
  />
);

export const Default = Template.bind({});

export const IsPositive = Template.bind({});
IsPositive.args = {
  isPositive: true,
};

export const Error = Template.bind({});
Error.args = {
  isPositive: true,
  error: true,
  value: -1,
};
