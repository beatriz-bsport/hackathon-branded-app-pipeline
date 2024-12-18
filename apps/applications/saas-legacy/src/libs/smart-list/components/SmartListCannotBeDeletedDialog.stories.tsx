import React from 'react';
import { cadenceListFactory } from '#src/libs/sequential_marketing/factories';
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
  cadences: cadenceListFactory(3),
};

export default {
  title: 'Components/Smartlists/Dialogs',
  parameters: {
    docs: {
      page: null,
    },
  },
};
