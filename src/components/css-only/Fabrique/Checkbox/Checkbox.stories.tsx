import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ComponentStory, Meta } from '@storybook/react';

import Checkbox, { CheckboxStorybook, type CheckboxProps } from '.';

CheckboxStorybook.displayName = 'Checkbox';

const defaultArgs = {
  id: 'checkbox-id',
};

const fakeErrorMessage = faker.lorem.sentence(1);

const Template: ComponentStory<typeof Checkbox> = (args: CheckboxProps) => {
  const [checked, setChecked] = React.useState(false);
  const handleChange = () => {
    setChecked((prevState) => !prevState);
  };
  return (
    <CheckboxStorybook {...args} isChecked={checked} onClick={handleChange} />
  );
};

const TemplateMultiple: ComponentStory<typeof Checkbox> = (
  args: CheckboxProps,
) => {
  const [checked, setChecked] = React.useState(false);
  const [multiple, setMultiple] = React.useState(true);

  const handleChange = () => {
    if (multiple) {
      setMultiple((prevState) => !prevState);
      return setChecked((prevState) => !prevState);
    }
    if (checked) {
      return setChecked((prevState) => !prevState);
    }
    return setMultiple((prevState) => !prevState);
  };
  return (
    <CheckboxStorybook
      {...args}
      multiple={multiple}
      isChecked={checked}
      onClick={handleChange}
    />
  );
};

export const Withoutlabel = Template.bind({});
Withoutlabel.args = defaultArgs;

export const Withlabel = Template.bind({});
Withlabel.args = {
  ...defaultArgs,
  label: 'Label',
};

export const Withcaptiontext = Template.bind({});
Withcaptiontext.args = {
  ...defaultArgs,
  label: 'Label',
  captionText: 'Caption text',
};

export const Witherrormessage = Template.bind({});
Witherrormessage.args = {
  ...defaultArgs,
  label: 'Label',
  errorMessage: fakeErrorMessage,
};

export const Multiple = TemplateMultiple.bind({});
Multiple.args = {
  ...defaultArgs,
  label: 'Label',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...defaultArgs,
  label: 'Label',
  isDisabled: true,
};

export const Inversed = Template.bind({});
Inversed.args = {
  ...defaultArgs,
  label: 'Label',
  isInversed: true,
};

export default {
  title: 'Fabrique/CheckBox/Stories',
  component: Checkbox,
  parameters: {
    backgrounds: {
      values: [
        { name: 'dark', value: '#333333' },
        { name: 'white', value: '#FFFFF' },
      ],
    },
  },
  argTypes: {
    className: {
      description: 'Extend the styles applied to the component.',
    },
    onClick: {
      description: 'A callback function to be triggered when clicked.',
    },
    label: {
      description: 'Text to display next to the component.',
      control: 'text',
    },
    captionText: {
      description:
        'Additional text providing context or guidance related to the checkbox.',
      control: 'text',
    },
    multiple: {
      description: 'When set to true, the component appears multiple.',
      control: 'boolean',
    },
    isDisabled: {
      description: 'When set to true, the component appears disabled.',
      control: 'boolean',
      defaultValue: false,
    },
    isInversed: {
      description:
        'When set to true, the component appears with inversed colours.',
      control: 'boolean',
      defaultValue: false,
    },
    errorMessage: {
      description:
        'Additional text providing context or guidance related to the checkbox error.',
      control: 'text',
      defaultValue: '',
    },
  },
} as Meta<typeof CheckboxStorybook>;
