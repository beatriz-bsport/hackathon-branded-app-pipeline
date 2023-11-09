import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RadioButtonStorybook } from '.';
import { RadioButtonSizeEnum } from './constants';

const RadioForStorybookTemplate: ComponentStory<typeof RadioButtonStorybook> = (
  args,
) => {
  const [isChecked, setIsChecked] = React.useState(false);
  const handleOnClick = () => setIsChecked((prevState) => !prevState);
  return (
    <RadioButtonStorybook
      isChecked={isChecked}
      onClick={handleOnClick}
      {...args}
    />
  );
};

const defaultArgs = { isInversed: false, isDisabled: false };

export const Radiodefault = RadioForStorybookTemplate.bind({});
Radiodefault.args = { ...defaultArgs, id: 'radio-default', label: 'Default' };

export const Radioinversed = RadioForStorybookTemplate.bind({});
Radioinversed.args = {
  ...defaultArgs,
  isInversed: true,
  id: 'radio-inversed',
  label: 'Inversed',
};

export const Radiodisabled = RadioForStorybookTemplate.bind({});
Radiodisabled.args = {
  ...defaultArgs,
  isDisabled: true,
  id: 'radio-disabled',
  label: 'Disabled',
};

export const Radiochecked = RadioForStorybookTemplate.bind({});
Radiochecked.args = {
  ...defaultArgs,
  isChecked: true,
  id: 'radio-checked',
  label: 'Checked',
};

export const Radiocheckedinversed = RadioForStorybookTemplate.bind({});
Radiocheckedinversed.args = {
  ...defaultArgs,
  isInversed: true,
  id: 'radio-checked-inversed',
  label: 'Checked inversed',
};

export const Radiowithcaption = RadioForStorybookTemplate.bind({});
Radiowithcaption.args = {
  ...defaultArgs,
  captionText: 'Caption text',
  id: 'radio-captiontext',
  label: 'With caption text',
};

export const Radiowithoutlabel = RadioForStorybookTemplate.bind({});
Radiowithoutlabel.args = {
  ...defaultArgs,
  id: 'radio-no-label',
};

export const Radiosm = RadioForStorybookTemplate.bind({});
Radiosm.args = {
  ...defaultArgs,
  size: RadioButtonSizeEnum.SM,
  id: 'radio-sm',
  label: 'Small size',
};

export const Radiolg = RadioForStorybookTemplate.bind({});
Radiolg.args = {
  ...defaultArgs,
  size: RadioButtonSizeEnum.LG,
  id: 'radio-lg',
  label: 'Large size',
};

export default {
  title: 'Fabrique/RadioButton/Stories',
  component: RadioButtonStorybook,
  argTypes: {
    isDisabled: {
      description: 'Whether or not the component is disabled',
      control: 'boolean',
      defaultValue: 'false',
    },
    isInversed: {
      description: "Whether or not the component's color are inversed",
      control: 'boolean',
      defaultValue: 'false',
    },
    label: {
      description: "Radio's label",
      control: 'text',
      defaultValue: '',
    },
    captionText: {
      description: "Radio's captionText",
      control: 'text',
      defaultValue: '',
    },
    size: {
      description: 'Label and caption text sizes',
      control: 'radio',
      options: [RadioButtonSizeEnum.SM, RadioButtonSizeEnum.LG],
      defaultValue: RadioButtonSizeEnum.SM,
    },
  },
} as ComponentMeta<typeof RadioButtonStorybook>;
