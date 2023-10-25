import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Chip, { ChipStorybook } from './Chip.component';
import { ChipVariantEnum, ChipColorEnum, ChipSizeEnum } from './constants';
import { fakerEN as faker } from '@faker-js/faker';

const ChipTemplate: ComponentStory<typeof ChipStorybook> = (args) => (
  <ChipStorybook {...args}>{args.children}</ChipStorybook>
);

// displayName must be overriden for preview code to actually work on mdx document.
ChipStorybook.displayName = 'Chip';

const defaultArgs = {
  leftIcon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clip-path="url(#clip0_1776_3581)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.00008 0.666687C3.36827 0.666687 3.66675 0.965164 3.66675 1.33335V2.33335H4.66675C5.03494 2.33335 5.33341 2.63183 5.33341 3.00002C5.33341 3.36821 5.03494 3.66669 4.66675 3.66669H3.66675V4.66669C3.66675 5.03488 3.36827 5.33335 3.00008 5.33335C2.63189 5.33335 2.33341 5.03488 2.33341 4.66669V3.66669H1.33341C0.965225 3.66669 0.666748 3.36821 0.666748 3.00002C0.666748 2.63183 0.965225 2.33335 1.33341 2.33335H2.33341V1.33335C2.33341 0.965164 2.63189 0.666687 3.00008 0.666687ZM8.66675 1.33335C8.94259 1.33335 9.18995 1.50324 9.28898 1.7607L10.4451 4.76661C10.6454 5.28731 10.7083 5.43735 10.7944 5.55841C10.8808 5.67989 10.9869 5.78602 11.1084 5.87239C11.2294 5.95847 11.3795 6.0214 11.9002 6.22167L14.9061 7.37779C15.1635 7.47681 15.3334 7.72417 15.3334 8.00002C15.3334 8.27587 15.1635 8.52323 14.9061 8.62225L11.9002 9.77837C11.3795 9.97864 11.2294 10.0416 11.1084 10.1277C10.9869 10.214 10.8808 10.3202 10.7944 10.4416C10.7083 10.5627 10.6454 10.7127 10.4451 11.2334L9.28898 14.2393C9.18995 14.4968 8.9426 14.6667 8.66675 14.6667C8.3909 14.6667 8.14354 14.4968 8.04452 14.2393L6.8884 11.2334C6.68813 10.7127 6.6252 10.5627 6.53912 10.4416C6.45274 10.3202 6.34661 10.214 6.22514 10.1277C6.10408 10.0416 5.95403 9.97864 5.43334 9.77837L2.42743 8.62225C2.16997 8.52323 2.00008 8.27587 2.00008 8.00002C2.00008 7.72417 2.16997 7.47681 2.42743 7.37779L5.43333 6.22167C5.95403 6.0214 6.10408 5.95847 6.22514 5.87239C6.34661 5.78602 6.45274 5.67989 6.53912 5.55841C6.6252 5.43735 6.68813 5.28731 6.8884 4.76661L8.04452 1.7607C8.14354 1.50324 8.3909 1.33335 8.66675 1.33335ZM8.66675 3.85714L8.13286 5.24525C8.12402 5.26823 8.11531 5.29091 8.10671 5.3133C7.94433 5.73614 7.82166 6.05555 7.62575 6.33107C7.453 6.57402 7.24075 6.78628 6.9978 6.95902C6.72228 7.15493 6.40287 7.2776 5.98004 7.43998C5.95764 7.44858 5.93496 7.45729 5.91197 7.46613L4.52387 8.00002L5.91198 8.53391C5.93496 8.54275 5.95764 8.55146 5.98004 8.56006C6.40287 8.72244 6.72228 8.84511 6.9978 9.04102C7.24075 9.21376 7.453 9.42602 7.62575 9.66897C7.82166 9.94448 7.94432 10.2639 8.10671 10.6867C8.11531 10.7091 8.12402 10.7318 8.13286 10.7548L8.66675 12.1429L9.20064 10.7548C9.20947 10.7318 9.21818 10.7091 9.22678 10.6867C9.38917 10.2639 9.51183 9.94449 9.70774 9.66897C9.88049 9.42602 10.0928 9.21376 10.3357 9.04102C10.6112 8.84511 10.9306 8.72244 11.3535 8.56006C11.3759 8.55146 11.3985 8.54275 11.4215 8.53391L12.8096 8.00002L11.4215 7.46613C11.3985 7.45729 11.3759 7.44858 11.3535 7.43998C10.9306 7.2776 10.6112 7.15493 10.3357 6.95902C10.0928 6.78628 9.88049 6.57402 9.70774 6.33107C9.51184 6.05556 9.38917 5.73615 9.22679 5.31331C9.21819 5.29092 9.20948 5.26823 9.20063 5.24525L8.66675 3.85714ZM3.00008 10.6667C3.36827 10.6667 3.66675 10.9652 3.66675 11.3334V12.3334H4.66675C5.03494 12.3334 5.33341 12.6318 5.33341 13C5.33341 13.3682 5.03494 13.6667 4.66675 13.6667H3.66675V14.6667C3.66675 15.0349 3.36827 15.3334 3.00008 15.3334C2.63189 15.3334 2.33341 15.0349 2.33341 14.6667V13.6667H1.33341C0.965225 13.6667 0.666748 13.3682 0.666748 13C0.666748 12.6318 0.965225 12.3334 1.33341 12.3334H2.33341V11.3334C2.33341 10.9652 2.63189 10.6667 3.00008 10.6667Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1776_3581">
          <rect width="16" height="16" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  ),
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
