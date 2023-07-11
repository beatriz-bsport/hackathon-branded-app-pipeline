// @ts-nocheck
import React from 'react';
import CreateFranchiseRole, {
  OwnProps,
} from './FranchiseCreateRoleDialog.component';
import { faker } from '@faker-js/faker';
import {
  FranchiseesFactory,
  FranchiseRolesFactory,
} from '../factories/FranchiseRoleFactory';
import { FranchiseUserRoleData } from '#libs/role/types';
faker.locale = 'fr';
const CustomTemplate = (args: OwnProps) => <CreateFranchiseRole {...args} />;

export const Drawer = CustomTemplate.bind({});

Drawer.args = {
  onClose: () => alert('closing'),
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
