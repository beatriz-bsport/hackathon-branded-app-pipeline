import React from 'react';
import HTMLPreviewDialog, { OwnProps } from './HTMLPreviewDialog.component';
import fakerHTML from './fakerHTML';

const CustomTemplate = (args: OwnProps) => <HTMLPreviewDialog {...args} />;

const defaultArgs: OwnProps = {
  open: true,
  onClose: () => {},
  title: 'This is a title',
};

export const DialogWithLittleHTML = CustomTemplate.bind({});

DialogWithLittleHTML.args = {
  ...defaultArgs,
  html: '<div> hellooo </div>',
};

export const DialogWithLargeHTML = CustomTemplate.bind({});

DialogWithLargeHTML.args = {
  ...defaultArgs,
  html: fakerHTML(),
};

export default {
  title: 'Components/HTML Preview',
  component: HTMLPreviewDialog,
  parameters: {
    docs: {
      page: null,
    },
  },
};
