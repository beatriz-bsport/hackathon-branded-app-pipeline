import React, { ChangeEvent, useState } from 'react';
import type { ComponentMeta } from '@storybook/react';

import NumericInput from './NumericInput.component';

import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Input/NumericInput',
  component: NumericInput,
  argTypes: {
    value: {
      description: 'The text to appear on the input.',
    },
    onChange: {
      action: 'onChange',
      description: 'Function to be called when the value changes.',
    },
    disabled: {
      description: 'True if the input should be disabled.',
    },
    error: {
      description: 'If true, the label will be displayed in an error state.',
    },
    fullWidth: {
      description:
        'If true, the input will take up the full width of its container.',
    },
    helperText: {
      description: 'The helper text content.',
    },
    id: {
      description:
        'The id of the input element. Use this prop to make label and helperText accessible for screen readers.',
    },
    inputClass: {
      description: 'Class of the input.',
    },
    InputProps: {
      description:
        'The props of the input (its step, its max and min values, its style, a startAdornment).',
    },
    isPositive: {
      description:
        'If true, if the input is not empty, its value must be positive.',
    },
    label: {
      description: 'The lable content.',
    },
    margin: {
      description:
        'If dense or normal, will adjust vertical spacing of this and contained components.',
    },
    name: {
      description: 'Name attribute of the input element.',
    },
    placeholder: {
      description:
        'The short hint displayed in the input before the user enters a value.',
    },
    required: {
      description:
        'If true, the label is displayed as required and the input element` will be required.',
    },
    size: {
      description: 'The size of the text field.',
    },
    variant: {
      description: 'The variant to use.',
    },
    onBlur: {
      action: 'onBlur',
      description: 'Callback fired when the value is changed.',
    },
  },
  args: {
    error: false,
    helperText: 'helper text',
    value: 0,
    InputProps: {
      inputProps: { min: null, max: null },
    },
    isPositive: false,
  },
  parameters: {
    layout: 'centered',
    docs: {
      page: null,
    },
    description: {
      component:
        'Input component for numeric data (used in PriceInput and PercentInput for example).',
    },
  },
} as ComponentMeta<typeof NumericInput>;

const Template = (args: React.ComponentProps<typeof NumericInput>) => {
  const [value, setValue] = useState<number>(args.value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    let step = parseFloat(args.InputProps?.inputProps?.step) || 1;
    const roundedValue = Math.round(newValue / step) * step;
    setValue(roundedValue);
    action('onChange')(roundedValue);
  };

  return <NumericInput {...args} value={value} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {};

export const Positive = Template.bind({});
Positive.args = {
  isPositive: true,
};

export const Step = Template.bind({});
Step.args = {
  InputProps: {
    inputProps: {
      min: null,
      max: null,
      step: 0.01,
    },
  },
};
