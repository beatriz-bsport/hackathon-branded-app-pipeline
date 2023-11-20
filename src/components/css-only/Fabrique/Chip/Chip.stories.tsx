import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import { Star06 } from '#components/untitledui';
import Chip, { ChipStorybook } from './Chip.component';
import { ChipVariantEnum, ChipColorEnum, ChipSizeEnum } from './constants';

const ChipTemplate: ComponentStory<typeof ChipStorybook> = (args) => (
  <ChipStorybook {...args}>{args.children}</ChipStorybook>
);

// displayName must be overriden for preview code to actually work on mdx document.
ChipStorybook.displayName = 'Chip';

const defaultArgs = {
  leftIcon: <Star06 stroke="currentColor" />,
  children: faker.lorem.word(8),
  onClose: () => {},
};

export const Default = ChipTemplate.bind({});
Default.args = defaultArgs;

export const Disabled = ChipTemplate.bind({});
Disabled.args = { ...defaultArgs, isDisabled: true };

export const Smallstrong = ChipTemplate.bind({});
Smallstrong.args = {
  ...defaultArgs,
  size: ChipSizeEnum.SM,
};

export const Strongmain = ChipTemplate.bind({});
Strongmain.args = {
  ...defaultArgs,
  color: ChipColorEnum.MAIN,
  variant: ChipVariantEnum.STRONG,
};

export const Stronggrey = ChipTemplate.bind({});
Stronggrey.args = {
  ...defaultArgs,
  color: ChipColorEnum.GREY,
  variant: ChipVariantEnum.STRONG,
};

export const Stronginfo = ChipTemplate.bind({});
Stronginfo.args = {
  ...defaultArgs,
  color: ChipColorEnum.INFO,
  variant: ChipVariantEnum.STRONG,
};

export const Strongsuccess = ChipTemplate.bind({});
Strongsuccess.args = {
  ...defaultArgs,
  color: ChipColorEnum.SUCCESS,
  variant: ChipVariantEnum.STRONG,
};

export const Strongwarning = ChipTemplate.bind({});
Strongwarning.args = {
  ...defaultArgs,
  color: ChipColorEnum.WARNING,
  variant: ChipVariantEnum.STRONG,
};

export const Strongerror = ChipTemplate.bind({});
Strongerror.args = {
  ...defaultArgs,
  color: ChipColorEnum.ERROR,
  variant: ChipVariantEnum.STRONG,
};

export const Smallweak = ChipTemplate.bind({});
Smallweak.args = {
  ...defaultArgs,
  size: 'sm',
  variant: ChipVariantEnum.WEAK,
};

export const Weakmain = ChipTemplate.bind({});
Weakmain.args = {
  ...defaultArgs,
  color: ChipColorEnum.MAIN,
  variant: ChipVariantEnum.WEAK,
};

export const Weakgrey = ChipTemplate.bind({});
Weakgrey.args = {
  ...defaultArgs,
  color: ChipColorEnum.GREY,
  variant: ChipVariantEnum.WEAK,
};

export const Weakinfo = ChipTemplate.bind({});
Weakinfo.args = {
  ...defaultArgs,
  color: ChipColorEnum.INFO,
  variant: ChipVariantEnum.WEAK,
};

export const Weaksuccess = ChipTemplate.bind({});
Weaksuccess.args = {
  ...defaultArgs,
  color: ChipColorEnum.SUCCESS,
  variant: ChipVariantEnum.WEAK,
};

export const Weakwarning = ChipTemplate.bind({});
Weakwarning.args = {
  ...defaultArgs,
  color: ChipColorEnum.WARNING,
  variant: ChipVariantEnum.WEAK,
};

export const Weakerror = ChipTemplate.bind({});
Weakerror.args = {
  ...defaultArgs,
  color: ChipColorEnum.ERROR,
  variant: ChipVariantEnum.WEAK,
};

export default {
  title: 'Fabrique/Chip/Stories',
  component: Chip,
  argTypes: {
    leftIcon: {
      description: 'The optional icon element that displays on the left if any',
    },
    children: {
      description: 'The text within the Chip',
    },
    onClose: {
      description:
        'The action to perform when clicking on the close icon button',
    },
    isDisabled: {
      description: 'Whether the chip state is disabled or not',
      control: 'boolean',
      defaultValue: false,
    },
    color: {
      description: 'The chip color theme',
      control: { type: 'inline-radio' },
      options: [
        ChipColorEnum.MAIN,
        ChipColorEnum.GREY,
        ChipColorEnum.INFO,
        ChipColorEnum.SUCCESS,
        ChipColorEnum.WARNING,
        ChipColorEnum.ERROR,
      ],
      defaultValue: ChipColorEnum.MAIN,
    },
    size: {
      description: 'The chip size',
      control: { type: 'inline-radio' },
      options: [ChipSizeEnum.SM, ChipSizeEnum.LG],
      defaultValue: ChipSizeEnum.LG,
    },
    variant: {
      description: 'The chip background theme',
      control: { type: 'inline-radio' },
      options: [ChipVariantEnum.STRONG, ChipVariantEnum.WEAK],
      defaultValue: ChipVariantEnum.STRONG,
    },
  },
} as ComponentMeta<typeof Chip>;
