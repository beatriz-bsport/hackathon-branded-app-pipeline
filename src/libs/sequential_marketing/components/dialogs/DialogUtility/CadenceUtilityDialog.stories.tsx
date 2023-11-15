import React from 'react';
import CadenceUtilityDialog from './CadenceUtilityDialog.component';
import { action } from '@storybook/addon-actions';

const CadenceUtilityDialogTemplate = (
  args: React.ComponentProps<typeof CadenceUtilityDialog>,
) => <CadenceUtilityDialog {...args} />;

export const CadenceUtility = CadenceUtilityDialogTemplate.bind({});

const actionData = {
  onClick: action('onClick'),
};

CadenceUtility.args = {
  open: true,
  onCancel: actionData.onClick,
  onConfirm: actionData.onClick,
};

export default {
  title: 'Components/Cadences/Dialogs',
  parameters: {
    docs: {
      page: null,
    },
  },
  argTypes: {
    variant: {
      description: 'The variant to use.',
      control: 'radio',
      options: [
        'activate',
        'delete-step',
        'archive-workflow',
        'convert-step-into-exit',
        'pause-workflow',
      ],
    },
  },
};
