import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import Alert, { AlertStorybook } from './Alert.component';
import { AlertColorEnum, AlertVariantEnum } from './constants';

const AlertStorybookTemplate: ComponentStory<typeof AlertStorybook> = (
  args,
) => <AlertStorybook {...args}>{args.children}</AlertStorybook>;

/* TODO: replace with import from icons library */
const CUSTOM_ICON: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.5 0C4.05228 0 4.5 0.447715 4.5 1V2.5H6C6.55228 2.5 7 2.94772 7 3.5C7 4.05228 6.55228 4.5 6 4.5H4.5V6C4.5 6.55228 4.05228 7 3.5 7C2.94772 7 2.5 6.55228 2.5 6V4.5H1C0.447715 4.5 0 4.05228 0 3.5C0 2.94772 0.447715 2.5 1 2.5H2.5V1C2.5 0.447715 2.94772 0 3.5 0ZM12 1C12.4138 1 12.7848 1.25483 12.9333 1.64102L14.6675 6.14988C14.9679 6.93093 15.0623 7.156 15.1914 7.33759C15.321 7.5198 15.4802 7.67899 15.6624 7.80855C15.844 7.93768 16.0691 8.03207 16.8501 8.33248L21.359 10.0667C21.7452 10.2152 22 10.5862 22 11C22 11.4138 21.7452 11.7848 21.359 11.9333L16.8501 13.6675C16.0691 13.9679 15.844 14.0623 15.6624 14.1914C15.4802 14.321 15.321 14.4802 15.1914 14.6624C15.0623 14.844 14.9679 15.0691 14.6675 15.8501L12.9333 20.359C12.7848 20.7452 12.4138 21 12 21C11.5862 21 11.2152 20.7452 11.0667 20.359L9.33248 15.8501C9.03207 15.0691 8.93768 14.844 8.80855 14.6624C8.67899 14.4802 8.5198 14.321 8.33759 14.1914C8.156 14.0623 7.93093 13.9679 7.14988 13.6675L2.64102 11.9333C2.25483 11.7848 2 11.4138 2 11C2 10.5862 2.25483 10.2152 2.64102 10.0667L7.14988 8.33248C7.93093 8.03207 8.156 7.93768 8.33759 7.80855C8.5198 7.67899 8.67899 7.5198 8.80855 7.33759C8.93768 7.156 9.03207 6.93093 9.33248 6.14988L11.0667 1.64102C11.2152 1.25483 11.5862 1 12 1ZM12 4.78568L11.1992 6.86784C11.1859 6.90231 11.1728 6.93634 11.1599 6.96993C10.9164 7.60419 10.7324 8.0833 10.4385 8.49658C10.1794 8.861 9.861 9.17939 9.49658 9.43851C9.0833 9.73237 8.60419 9.91636 7.96994 10.1599C7.93634 10.1728 7.90232 10.1859 7.86784 10.1992L5.78568 11L7.86784 11.8008C7.90232 11.8141 7.93634 11.8272 7.96993 11.8401C8.60419 12.0836 9.0833 12.2676 9.49658 12.5615C9.861 12.8206 10.1794 13.139 10.4385 13.5034C10.7324 13.9167 10.9164 14.3958 11.1599 15.0301C11.1728 15.0637 11.1859 15.0977 11.1992 15.1322L12 17.2143L12.8008 15.1322C12.8141 15.0977 12.8272 15.0637 12.8401 15.0301C13.0836 14.3958 13.2676 13.9167 13.5615 13.5034C13.8206 13.139 14.139 12.8206 14.5034 12.5615C14.9167 12.2676 15.3958 12.0836 16.0301 11.8401C16.0637 11.8272 16.0977 11.8141 16.1322 11.8008L18.2143 11L16.1322 10.1992C16.0977 10.1859 16.0637 10.1728 16.0301 10.1599C15.3958 9.91636 14.9167 9.73237 14.5034 9.43851C14.139 9.17939 13.8206 8.861 13.5615 8.49658C13.2676 8.08331 13.0836 7.60419 12.8401 6.96994C12.8272 6.93635 12.8141 6.90232 12.8008 6.86784L12 4.78568ZM3.5 15C4.05228 15 4.5 15.4477 4.5 16V17.5H6C6.55228 17.5 7 17.9477 7 18.5C7 19.0523 6.55228 19.5 6 19.5H4.5V21C4.5 21.5523 4.05228 22 3.5 22C2.94772 22 2.5 21.5523 2.5 21V19.5H1C0.447715 19.5 0 19.0523 0 18.5C0 17.9477 0.447715 17.5 1 17.5H2.5V16C2.5 15.4477 2.94772 15 3.5 15Z"
      fill="currentColor"
    />
  </svg>
);

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
  leftIcon: CUSTOM_ICON,
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
