import React from 'react';
import HTMLPreview, { OwnProps } from './HTMLPreview.component';
import fakerHTML from './fakerHTML';

const CustomTemplate = (args: OwnProps) => <HTMLPreview {...args} />;

export const EmptyHTML = CustomTemplate.bind({});

EmptyHTML.args = {
  html: null,
  loading: false,
  title: 'Email preview',
};

export const FullHTML = CustomTemplate.bind({});

FullHTML.args = {
  html: fakerHTML(),
  loading: false,
  title: 'Email preview',
  scrolling: true,
};

export default {
  title: 'Components/HTML Preview',
  component: HTMLPreview,
  parameters: {
    docs: {
      page: null,
    },
  },
};
