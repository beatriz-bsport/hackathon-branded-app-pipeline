import React, { useState } from 'react';

import { fakerEN as faker } from '@faker-js/faker';
import { ComponentMeta } from '@storybook/react';

import TextField, { Props, TextFieldSize } from '.';
import { MuiThemeToCssVarsHOC } from '#src/hocs/marketplace-css.hoc';

import './styles-storybook.css';

const TextFieldTemplate = (args: Props) => {
  const [value, setValue] = useState('');
  return (
    <TextField
      value={value}
      onChange={(event) => setValue(event.target.value)}
      {...args}
    />
  );
};

const TextFieldWithValueTemplate = (args: Props) => {
  const [value, setValue] = useState(faker.lorem.words(2));
  return (
    <TextField
      value={value}
      onChange={(event) => setValue(event.target.value)}
      {...args}
    />
  );
};

const baseArgs = {
  label: faker.lorem.word(6),
  isDisabled: false,
  fullWidth: false,
  isRequired: false,
  isError: false,
  classes: {
    root: '',
    label: '',
    input: '',
    helperText: '',
  },
  id: '',
  inputId: '',
  type: 'text',
  variant: 'outlined',
};

export const TextFieldOutlined = TextFieldTemplate.bind({});
TextFieldOutlined.args = baseArgs;

export const TextFieldStandard = TextFieldTemplate.bind({});
TextFieldStandard.args = { ...baseArgs, variant: 'standard' };

export const TextFieldRequired = TextFieldTemplate.bind({});
TextFieldRequired.args = { ...baseArgs, isRequired: true };

export const TextFieldWithValue = TextFieldWithValueTemplate.bind({});
TextFieldWithValue.args = baseArgs;

export const TextFieldPassword = TextFieldWithValueTemplate.bind({});
TextFieldPassword.args = {
  ...baseArgs,
  type: 'password',
  withPasswordToggle: true,
};

export const TextFieldError = TextFieldTemplate.bind({});
TextFieldError.args = {
  ...baseArgs,
  helperText: faker.lorem.sentences(2),
  isError: true,
  value: faker.string.sample(),
};

export const TextFieldDisabled = TextFieldTemplate.bind({});
TextFieldDisabled.args = { ...baseArgs, isDisabled: true };

export const TextFieldSmall = TextFieldTemplate.bind({});
TextFieldSmall.args = { ...baseArgs, size: TextFieldSize.SMALL };

export const TextFieldLarge = TextFieldTemplate.bind({});
TextFieldLarge.args = { ...baseArgs, size: TextFieldSize.LARGE };

export default {
  title: 'Components/CssOnly/TextField',
  component: TextField,
  decorators: [
    (Story) => (
      <MuiThemeToCssVarsHOC>
        <div className="bs-text-field-storybook-story__container">
          <Story />
        </div>
      </MuiThemeToCssVarsHOC>
    ),
  ],
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: [undefined, TextFieldSize.SMALL, TextFieldSize.LARGE],
      },
    },
    variant: {
      control: {
        type: 'select',
        options: ['outlined', 'filled', 'standard'],
        default: 'outlined',
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['text', 'email', 'tel', 'pasword'],
      },
    },
    withPasswordToggle: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    onClick: {
      action: 'onClick',
    },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
} as ComponentMeta<typeof TextField>;
