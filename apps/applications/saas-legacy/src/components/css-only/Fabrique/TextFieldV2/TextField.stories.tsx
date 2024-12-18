import React, { ChangeEvent, useState } from 'react';

import { fakerEN as faker } from '@faker-js/faker';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TextFieldSizeEnum } from './constants';
import type { Props } from '.';
import { TextFieldStorybook } from '.';
import { Star06 } from '#src/components/untitledui';

// displayName must be overriden for preview code to actually work on mdx document.
TextFieldStorybook.displayName = 'TextField';

const starIcon = <Star06 stroke="currentColor" />;

const TextFieldStorybookTemplate: ComponentStory<typeof TextFieldStorybook> = (
  args: Props,
) => {
  const [value, setValue] = useState(args.value ?? '');
  return (
    <TextFieldStorybook
      value={value}
      id="textfield-storybook"
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        setValue(event.target.value)
      }
      {...args}
    />
  );
};

const TextFieldWithClearTemplate = (args: Props) => {
  const [value, setValue] = useState(
    'Text to make button clear appear on the right side',
  );
  return (
    <TextFieldStorybook
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue('')}
      {...args}
      id="textfield-storybook"
    />
  );
};

const TextFieldWithMultipleSelectorsTemplate = (args: Props) => {
  const [value, setValue] = useState(args.value ?? faker.lorem.words(2));
  const [secondValue, setSecondValue] = useState(faker.lorem.words(3));
  const [thirdValue, setThirdValue] = useState('');

  return (
    <>
      <TextFieldStorybook
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onClear={() => setValue('')}
        id="textfield-1"
        {...args}
      />
      <TextFieldStorybook
        value={secondValue}
        onChange={(event) => setSecondValue(event.target.value)}
        onClear={() => setSecondValue('')}
        id="textfield-2"
        {...args}
      />
      <TextFieldStorybook
        value={thirdValue}
        onChange={(event) => setThirdValue(event.target.value)}
        onClear={() => setThirdValue('')}
        id="textfield-3"
        {...args}
      />
    </>
  );
};

const baseArgs = {
  isDisabled: false,
  isRequired: false,
  isError: false,
  size: TextFieldSizeEnum.SM,
  placeholder: 'Placeholder',
  label: 'Label',
};

export const Textfielddefault = TextFieldStorybookTemplate.bind({});
Textfielddefault.args = { ...baseArgs, placeholder: 'Default' };

export const Textfieldrequired = TextFieldStorybookTemplate.bind({});
Textfieldrequired.args = {
  ...baseArgs,
  label: 'Required',
  isRequired: true,
};

export const Textfieldwithclear = TextFieldWithClearTemplate.bind({});
Textfieldwithclear.args = baseArgs;

export const Textfielderror = TextFieldStorybookTemplate.bind({});
Textfielderror.args = {
  ...baseArgs,
  helperText: faker.lorem.sentences(2),
  errorMessage: faker.lorem.sentences(2),
  isError: true,
};

export const Textfieldcaption = TextFieldStorybookTemplate.bind({});
Textfieldcaption.args = {
  ...baseArgs,
  helperText: faker.lorem.paragraphs(5),
  placeholder: 'Caption text',
};

export const Textfielddisabled = TextFieldStorybookTemplate.bind({});
Textfielddisabled.args = {
  ...baseArgs,
  placeHolder: 'Disabled',
  isDisabled: true,
  onClear: () => {},
};

export const Textfieldsmall = TextFieldStorybookTemplate.bind({});
Textfieldsmall.args = { ...baseArgs, size: TextFieldSizeEnum.SM };

export const Textfieldlarge = TextFieldStorybookTemplate.bind({});
Textfieldlarge.args = { ...baseArgs, size: TextFieldSizeEnum.LG };

export const Textfieldwithrighticon = TextFieldStorybookTemplate.bind({});
Textfieldwithrighticon.args = { ...baseArgs, rightIcon: starIcon };

export const Textfieldwithlefticon = TextFieldStorybookTemplate.bind({});
Textfieldwithlefticon.args = { ...baseArgs, leftIcon: starIcon };

export const Textfieldwithrighticonandclear = TextFieldWithClearTemplate.bind(
  {},
);
Textfieldwithrighticonandclear.args = {
  ...baseArgs,
  rightIcon: starIcon,
};

export const Textfieldwithalliconsandclear = TextFieldWithClearTemplate.bind(
  {},
);
Textfieldwithalliconsandclear.args = {
  ...baseArgs,
  rightIcon: starIcon,
  leftIcon: starIcon,
};

export const Textfieldmultiplefield =
  TextFieldWithMultipleSelectorsTemplate.bind({});
Textfieldmultiplefield.args = baseArgs;

export default {
  title: 'Fabrique/TextField/Stories',
  component: TextFieldStorybook,
  argTypes: {
    size: {
      description: 'Size of the textfield component',
      control: {
        type: 'inline-radio',
      },
      options: [TextFieldSizeEnum.SM, TextFieldSizeEnum.LG],
    },
    label: {
      control: 'text',
      description: 'Label of the textfield',
    },
    classes: {
      description: 'Override or extend the styles applied to the component.',
    },
    name: { description: 'Name of the input field' },
    value: { description: 'Value of the input field', control: 'text' },
    isDisabled: {
      description: 'If true, the component is disabled',
      control: 'boolean',
    },
    id: {
      description:
        'When clicking on the label, this ID allows us to redirect this click as if we were clicking on the input',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder value',
      control: 'text',
    },
    type: {
      description: 'Type of input',
      control: {
        type: 'inline-radio',
      },
      options: ['text', 'email', 'tel', 'password', 'date'],
    },
    isError: {
      description: 'If true, displays input field as if there is an error',
      control: 'boolean',
    },
    isRequired: {
      description: 'If true, the input field is required',
      control: 'boolean',
    },
    leftIcon: {
      description:
        'When this option is provided, a left icon will appear on the textfield',
    },
    rightIcon: {
      description:
        'When this option is provided, a right icon will appear on the textfield',
    },
    helperText: {
      description: 'Caption below the textfield',
      control: 'text',
    },
    errorMessage: {
      description: 'Error message displayed below the textfield',
      control: 'text',
    },
  },
} as ComponentMeta<typeof TextFieldStorybook>;
