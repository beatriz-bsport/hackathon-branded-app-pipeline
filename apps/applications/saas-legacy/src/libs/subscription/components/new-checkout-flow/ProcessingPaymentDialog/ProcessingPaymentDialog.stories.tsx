import React from 'react';

import {
  ProcessingPaymentDialogForStoryBook,
  Props,
} from './ProcessingPaymentDialog.component';

const ProcessingPaymentDialogTemplate = (args: Props) => (
  // @ts-expect-error
  <ProcessingPaymentDialogForStoryBook {...args} />
);

export const ProcessingPaymentDialog = ProcessingPaymentDialogTemplate.bind({});
ProcessingPaymentDialog.args = {
  open: true,
};

export default {
  title: 'Subscription/CssOnly/ProcessingPaymentDialog',
  component: ProcessingPaymentDialogForStoryBook,
  argTypes: {
    open: { control: { type: 'select', options: [true, false] } },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
