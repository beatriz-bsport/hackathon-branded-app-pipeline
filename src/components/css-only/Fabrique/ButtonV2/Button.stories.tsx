import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ButtonStorybook } from './Button.component';

import { ButtonColor, ButtonVariant, ButtonSize } from './constants';
const ButtonStorybookTemplate: ComponentStory<typeof ButtonStorybook> = (
  args,
) => <ButtonStorybook {...args}>{args.children}</ButtonStorybook>;

// displayName must be overriden for preview code to actually work on mdx document.

ButtonStorybook.displayName = 'Button';

export const Buttoncontainedprimary = ButtonStorybookTemplate.bind({});
Buttoncontainedprimary.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.PRIMARY,
  children: 'Primary',
};

export const Buttoncontainedsecondary = ButtonStorybookTemplate.bind({});
Buttoncontainedsecondary.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.SECONDARY,
  children: 'Secondary',
};

export const Buttoncontainedgrey = ButtonStorybookTemplate.bind({});
Buttoncontainedgrey.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.GREY,
  children: 'Grey',
};

export const Buttoncontainedwhite = ButtonStorybookTemplate.bind({});
Buttoncontainedwhite.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.WHITE,
  children: 'White',
};

export const Buttoncontainedinfo = ButtonStorybookTemplate.bind({});
Buttoncontainedinfo.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.INFO,
  children: 'Info',
};

export const Buttoncontainedwarning = ButtonStorybookTemplate.bind({});
Buttoncontainedwarning.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.WARNING,
  children: 'Warning',
};

export const Buttoncontainederror = ButtonStorybookTemplate.bind({});
Buttoncontainederror.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.ERROR,
  children: 'Error',
};

export const Buttonoutlinedprimary = ButtonStorybookTemplate.bind({});
Buttonoutlinedprimary.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.PRIMARY,
  children: 'Primary',
};

export const Buttonoutlinedsecondary = ButtonStorybookTemplate.bind({});
Buttonoutlinedsecondary.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.SECONDARY,
  children: 'Secondary',
};

export const Buttonoutlinedgrey = ButtonStorybookTemplate.bind({});
Buttonoutlinedgrey.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.GREY,
  children: 'Grey',
};

export const Buttonoutlinedwhite = ButtonStorybookTemplate.bind({});
Buttonoutlinedwhite.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.WHITE,
  children: 'White',
};

export const Buttonoutlinedinfo = ButtonStorybookTemplate.bind({});
Buttonoutlinedinfo.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.INFO,
  children: 'Info',
};

export const Buttonoutlinedwarning = ButtonStorybookTemplate.bind({});
Buttonoutlinedwarning.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.WARNING,
  children: 'Warning',
};

export const Buttonoutlinederror = ButtonStorybookTemplate.bind({});
Buttonoutlinederror.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.ERROR,
  children: 'Error',
};

export const Buttontextprimary = ButtonStorybookTemplate.bind({});
Buttontextprimary.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.PRIMARY,
  children: 'Primary',
};

export const Buttontextsecondary = ButtonStorybookTemplate.bind({});
Buttontextsecondary.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.SECONDARY,
  children: 'Secondary',
};

export const Buttontextgrey = ButtonStorybookTemplate.bind({});
Buttontextgrey.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.GREY,
  children: 'Grey',
};

export const Buttontextwhite = ButtonStorybookTemplate.bind({});
Buttontextwhite.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.WHITE,
  children: 'White',
};

export const Buttontextinfo = ButtonStorybookTemplate.bind({});
Buttontextinfo.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.INFO,
  children: 'Info',
};

export const Buttontextwarning = ButtonStorybookTemplate.bind({});
Buttontextwarning.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.WARNING,
  children: 'Warning',
};

export const Buttontexterror = ButtonStorybookTemplate.bind({});
Buttontexterror.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.ERROR,
  children: 'Error',
};

export default {
  title: 'Fabrique/Button/Stories',
  component: ButtonStorybook,
  argTypes: {
    children: {
      description: 'The text to be displayed',
      control: 'text',
    },
    size: {
      description: 'The button size',
      control: { type: 'inline-radio' },
      options: [ButtonSize.LG, ButtonSize.MD, ButtonSize.SM],
    },
    variant: {
      description: 'The button style',
      control: { type: 'inline-radio' },
      options: [
        ButtonVariant.CONTAINED,
        ButtonVariant.OUTLINED,
        ButtonVariant.TEXT,
      ],
    },
    color: {
      description: 'The button color',
      control: { type: 'inline-radio' },
      options: [
        ButtonColor.PRIMARY,
        ButtonColor.SECONDARY,
        ButtonColor.GREY,
        ButtonColor.WHITE,
        ButtonColor.INFO,
        ButtonColor.ERROR,
        ButtonColor.WARNING,
      ],
    },
    isDisabled: {
      description: 'Whether or not the button is disabled',
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof ButtonStorybook>;
