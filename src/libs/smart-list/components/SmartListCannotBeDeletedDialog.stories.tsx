import React from 'react';
import SmartListCannotBeDeletedDialog, {
  Props,
} from './SmartListCannotBeDeletedDialog.component';

const SmartListCannotBeDeletedTemplate = (args: Props) => (
  <SmartListCannotBeDeletedDialog {...args} />
);
export const SmartListCannotBeDeleted = SmartListCannotBeDeletedTemplate.bind(
  {},
);

SmartListCannotBeDeleted.args = {
  open: true,
  onCancel: () => {},
  cadences: [],
};

export default {
  title: 'Components/Smartlists/Dialogs',
  parameters: {
    docs: {
      page: null,
    },
  },
};
