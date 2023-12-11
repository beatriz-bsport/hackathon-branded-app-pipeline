import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { IconButtonStorybook } from './IconButton.component';

import {
  ButtonColor,
  ButtonVariant,
  ButtonSize,
} from '#Fabrique/ButtonV2/constants';
import { Star06 } from '#components/untitledui';

const IconButtonStorybookTemplate: ComponentStory<
  typeof IconButtonStorybook
> = (args) => (
  <IconButtonStorybook {...args}>{args.children}</IconButtonStorybook>
);

// displayName must be overriden for preview code to actually work on mdx document.
IconButtonStorybook.displayName = 'IconButton';

const StarIcon = <Star06 stroke="currentColor" />;

export const Iconbuttoncontainedprimary = IconButtonStorybookTemplate.bind({});
Iconbuttoncontainedprimary.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.PRIMARY,
  children: StarIcon,
};

export const Iconbuttoncontainedsecondary = IconButtonStorybookTemplate.bind(
  {},
);
Iconbuttoncontainedsecondary.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.SECONDARY,
  children: StarIcon,
};

export const Iconbuttoncontainedgrey = IconButtonStorybookTemplate.bind({});
Iconbuttoncontainedgrey.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.GREY,
  children: StarIcon,
};

export const Iconbuttoncontainedwhite = IconButtonStorybookTemplate.bind({});
Iconbuttoncontainedwhite.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.WHITE,
  children: StarIcon,
};

export const Iconbuttoncontainedinfo = IconButtonStorybookTemplate.bind({});
Iconbuttoncontainedinfo.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.INFO,
  children: StarIcon,
};

export const Iconbuttoncontainedwarning = IconButtonStorybookTemplate.bind({});
Iconbuttoncontainedwarning.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.WARNING,
  children: StarIcon,
};

export const Iconbuttoncontainederror = IconButtonStorybookTemplate.bind({});
Iconbuttoncontainederror.args = {
  variant: ButtonVariant.CONTAINED,
  color: ButtonColor.ERROR,
  children: StarIcon,
};

export const Iconbuttonoutlinedprimary = IconButtonStorybookTemplate.bind({});
Iconbuttonoutlinedprimary.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.PRIMARY,
  children: StarIcon,
};

export const Iconbuttonoutlinedsecondary = IconButtonStorybookTemplate.bind({});
Iconbuttonoutlinedsecondary.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.SECONDARY,
  children: StarIcon,
};

export const Iconbuttonoutlinedgrey = IconButtonStorybookTemplate.bind({});
Iconbuttonoutlinedgrey.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.GREY,
  children: StarIcon,
};

export const Iconbuttonoutlinedwhite = IconButtonStorybookTemplate.bind({});
Iconbuttonoutlinedwhite.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.WHITE,
  children: StarIcon,
};

export const Iconbuttonoutlinedinfo = IconButtonStorybookTemplate.bind({});
Iconbuttonoutlinedinfo.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.INFO,
  children: StarIcon,
};

export const Iconbuttonoutlinedwarning = IconButtonStorybookTemplate.bind({});
Iconbuttonoutlinedwarning.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.WARNING,
  children: StarIcon,
};

export const Iconbuttonoutlinederror = IconButtonStorybookTemplate.bind({});
Iconbuttonoutlinederror.args = {
  variant: ButtonVariant.OUTLINED,
  color: ButtonColor.ERROR,
  children: StarIcon,
};

export const Iconbuttontextprimary = IconButtonStorybookTemplate.bind({});
Iconbuttontextprimary.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.PRIMARY,
  children: StarIcon,
};

export const Iconbuttontextsecondary = IconButtonStorybookTemplate.bind({});
Iconbuttontextsecondary.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.SECONDARY,
  children: StarIcon,
};

export const Iconbuttontextgrey = IconButtonStorybookTemplate.bind({});
Iconbuttontextgrey.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.GREY,
  children: StarIcon,
};

export const Iconbuttontextwhite = IconButtonStorybookTemplate.bind({});
Iconbuttontextwhite.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.WHITE,
  children: StarIcon,
};

export const Iconbuttontextinfo = IconButtonStorybookTemplate.bind({});
Iconbuttontextinfo.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.INFO,
  children: StarIcon,
};

export const Iconbuttontextwarning = IconButtonStorybookTemplate.bind({});
Iconbuttontextwarning.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.WARNING,
  children: StarIcon,
};

export const Iconbuttontexterror = IconButtonStorybookTemplate.bind({});
Iconbuttontexterror.args = {
  variant: ButtonVariant.TEXT,
  color: ButtonColor.ERROR,
  children: StarIcon,
};

export default {
  title: 'Fabrique/IconButton/Stories',
  component: IconButtonStorybook,
  argTypes: {
    children: {
      description: 'The icon element to be displayed',
    },
    size: {
      description: 'The button size',
      control: { type: 'inline-radio' },
      options: [ButtonSize.LG, ButtonSize.MD, ButtonSize.SM],
      defaultValue: ButtonSize.LG,
    },
    variant: {
      description: 'The button style',
      control: { type: 'inline-radio' },
      options: [
        ButtonVariant.CONTAINED,
        ButtonVariant.OUTLINED,
        ButtonVariant.TEXT,
      ],
      defaultValue: ButtonVariant.CONTAINED,
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
      defaultValue: ButtonColor.PRIMARY,
    },
    href: {
      description: 'Link URL to be redirected to if provided',
      control: 'text',
    },
    isDisabled: {
      description: 'Whether or not the button is disabled',
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof IconButtonStorybook>;
