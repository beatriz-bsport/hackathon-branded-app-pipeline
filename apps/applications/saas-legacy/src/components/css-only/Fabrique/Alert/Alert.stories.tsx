import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import Alert, { AlertStorybook } from './Alert.component';
import { AlertColorEnum, AlertVariantEnum } from './constants';
import { Star06 } from '#src/components/untitledui';

const AlertStorybookTemplate: ComponentStory<typeof AlertStorybook> = (
  args,
) => <AlertStorybook {...args}>{args.children}</AlertStorybook>;

// displayName must be overriden for preview code to actually work on mdx document.
AlertStorybook.displayName = 'Alert';

const defaultArgs = {
  title: faker.lorem.words(5),
  children: faker.lorem.sentences(5),
  actionText: faker.lorem.word(8),
  onActionClick: () => {},
  onClose: () => {},
};

export const Default = AlertStorybookTemplate.bind({});
Default.args = defaultArgs;

export const StrongLight = AlertStorybookTemplate.bind({});
StrongLight.args = {
  ...defaultArgs,
  color: AlertColorEnum.LIGHT,
  variant: AlertVariantEnum.STRONG,
};

export const StrongGrey = AlertStorybookTemplate.bind({});
StrongGrey.args = {
  ...defaultArgs,
  color: AlertColorEnum.GREY,
  variant: AlertVariantEnum.STRONG,
};

export const StrongInfo = AlertStorybookTemplate.bind({});
StrongInfo.args = {
  ...defaultArgs,
  color: AlertColorEnum.INFO,
  variant: AlertVariantEnum.STRONG,
};

export const StrongSuccess = AlertStorybookTemplate.bind({});
StrongSuccess.args = {
  ...defaultArgs,
  color: AlertColorEnum.SUCCESS,
  variant: AlertVariantEnum.STRONG,
};

export const StrongWarning = AlertStorybookTemplate.bind({});
StrongWarning.args = {
  ...defaultArgs,
  color: AlertColorEnum.WARNING,
  variant: AlertVariantEnum.STRONG,
};

export const StrongError = AlertStorybookTemplate.bind({});
StrongError.args = {
  ...defaultArgs,
  color: AlertColorEnum.ERROR,
  variant: AlertVariantEnum.STRONG,
};

export const WeakGrey = AlertStorybookTemplate.bind({});
WeakGrey.args = {
  ...defaultArgs,
  color: AlertColorEnum.GREY,
  variant: AlertVariantEnum.WEAK,
};

export const WeakInfo = AlertStorybookTemplate.bind({});
WeakInfo.args = {
  ...defaultArgs,
  color: AlertColorEnum.INFO,
  variant: AlertVariantEnum.WEAK,
};

export const WeakSuccess = AlertStorybookTemplate.bind({});
WeakSuccess.args = {
  ...defaultArgs,
  color: AlertColorEnum.SUCCESS,
  variant: AlertVariantEnum.WEAK,
};

export const WeakWarning = AlertStorybookTemplate.bind({});
WeakWarning.args = {
  ...defaultArgs,
  color: AlertColorEnum.WARNING,
  variant: AlertVariantEnum.WEAK,
};

export const WeakError = AlertStorybookTemplate.bind({});
WeakError.args = {
  ...defaultArgs,
  color: AlertColorEnum.ERROR,
  variant: AlertVariantEnum.WEAK,
};

export const OutlinedGrey = AlertStorybookTemplate.bind({});
OutlinedGrey.args = {
  ...defaultArgs,
  color: AlertColorEnum.GREY,
  variant: AlertVariantEnum.OUTLINED,
};

export const OutlinedInfo = AlertStorybookTemplate.bind({});
OutlinedInfo.args = {
  ...defaultArgs,
  color: AlertColorEnum.INFO,
  variant: AlertVariantEnum.OUTLINED,
};

export const OutlinedSuccess = AlertStorybookTemplate.bind({});
OutlinedSuccess.args = {
  ...defaultArgs,
  color: AlertColorEnum.SUCCESS,
  variant: AlertVariantEnum.OUTLINED,
};

export const OutlinedWarning = AlertStorybookTemplate.bind({});
OutlinedWarning.args = {
  ...defaultArgs,
  color: AlertColorEnum.WARNING,
  variant: AlertVariantEnum.OUTLINED,
};

export const OutlinedError = AlertStorybookTemplate.bind({});
OutlinedError.args = {
  ...defaultArgs,
  color: AlertColorEnum.ERROR,
  variant: AlertVariantEnum.OUTLINED,
};

export const TextGrey = AlertStorybookTemplate.bind({});
TextGrey.args = {
  ...defaultArgs,
  color: AlertColorEnum.GREY,
  variant: AlertVariantEnum.TEXT,
};

export const TextInfo = AlertStorybookTemplate.bind({});
TextInfo.args = {
  ...defaultArgs,
  color: AlertColorEnum.INFO,
  variant: AlertVariantEnum.TEXT,
};

export const TextSuccess = AlertStorybookTemplate.bind({});
TextSuccess.args = {
  ...defaultArgs,
  color: AlertColorEnum.SUCCESS,
  variant: AlertVariantEnum.TEXT,
};

export const TextWarning = AlertStorybookTemplate.bind({});
TextWarning.args = {
  ...defaultArgs,
  color: AlertColorEnum.WARNING,
  variant: AlertVariantEnum.TEXT,
};

export const TextError = AlertStorybookTemplate.bind({});
TextError.args = {
  ...defaultArgs,
  color: AlertColorEnum.ERROR,
  variant: AlertVariantEnum.TEXT,
};

export const WithIconLeftCustom = AlertStorybookTemplate.bind({});
WithIconLeftCustom.args = {
  ...defaultArgs,
  leftIcon: <Star06 stroke="currentColor" />,
};

export default {
  title: 'Fabrique/Alert/Stories',
  component: Alert,
  argTypes: {
    title: {
      description: 'The action main text content',
    },
    children: {
      description: 'The action main text content',
    },
    actionText: {
      description: 'The text to display in the action button',
    },
    onActionClick: {
      description:
        'The action to perform when the action button has been clicked',
    },
    onClose: {
      description: 'The action to perform when the close button is clicked',
    },
    color: {
      description: 'The alert color theme',
      control: { type: 'inline-radio' },
      options: [
        'none',
        AlertColorEnum.LIGHT,
        AlertColorEnum.GREY,
        AlertColorEnum.INFO,
        AlertColorEnum.SUCCESS,
        AlertColorEnum.WARNING,
        AlertColorEnum.ERROR,
      ],
    },
    variant: {
      description: 'The alert background theme',
      control: { type: 'inline-radio' },
      options: [
        AlertVariantEnum.TEXT,
        AlertVariantEnum.STRONG,
        AlertVariantEnum.WEAK,
        AlertVariantEnum.OUTLINED,
      ],
      defaultValue: AlertVariantEnum.TEXT,
    },
  },
} as ComponentMeta<typeof Alert>;
