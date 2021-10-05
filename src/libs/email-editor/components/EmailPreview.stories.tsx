import React from 'react';
import EmailPreview, { OwnProps } from './EmailPreview.components';

const CustomTemplate = (args: OwnProps) => <EmailPreview {...args} />;

export const CompleteEmptyState = CustomTemplate.bind({});

CompleteEmptyState.args = {
  html: null,
  loading: false,
  title: 'Email preview',
};

export const CompleteValueState = CustomTemplate.bind({});

CompleteValueState.args = {
  html: '<div> I am a email tempalte',
  loading: false,
  title: 'Email preview',
};

export default {
  title: 'Email/Preview',
  component: EmailPreview,
  parameters: {
    docs: {
      page: null,
    },
  },
};
