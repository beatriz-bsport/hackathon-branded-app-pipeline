import React from 'react';
import CreateFranchiseRole, {
  // @ts-expect-error
  OwnProps,
} from './FranchiseCreateRoleDialog.component';

const CustomTemplate = (args: OwnProps) => <CreateFranchiseRole {...args} />;

export const Drawer = CustomTemplate.bind({});

Drawer.args = {
  onClose: () => alert('closing'),
  // @ts-expect-error
  onSubmit: (data) => {
    console.log(data);
    alert('Successfully submitted form, see console for data info');
  },
  open: true,
  currentStep: 0,
};

export default {
  title: 'Library/Franchise/CreateFranchiseRole',
  component: CreateFranchiseRole,
  parameters: {
    docs: {
      page: null,
    },
  },
};
