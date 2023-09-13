import React from 'react';
import AutoResendConfigDialog, {
  type Props,
} from './AutoResendConfigDialog.component';

const Template = (args: Props) => <AutoResendConfigDialog {...args} />;

export const FullDialog = Template.bind({});
FullDialog.args = {
  open: true,
  handleSubmit: () => console.log('submit'),
  handleClose: () => console.log('close'),
  initial: {
    resendDelay: 3,
    resendCount: 5,
  },
};

export default {
  title: 'Library/smartlist/dialogs/AutoResendConfigDialog',
  component: AutoResendConfigDialog,
  parameters: {
    docs: {
      page: null,
      inlineStories: true,
    },
  },
};
