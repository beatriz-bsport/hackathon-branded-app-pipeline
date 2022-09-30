import React from 'react';
import CreateFranchiseStaffUser, {
  OwnProps,
} from './FranchiseCreateStaffUser.component';
import faker from 'faker';
import {
  FranchiseesFactory,
  FranchiseRolesFactory,
} from '../factories/FranchiseRoleFactory';
import { FranchiseUserRoleData } from '#libs/role/types';
faker.locale = 'fr';
const CustomTemplate = (args: OwnProps) => (
  <CreateFranchiseStaffUser {...args} />
);

export const Drawer = CustomTemplate.bind({});

Drawer.args = {
  franchiseeList: FranchiseesFactory(3),
  franchiseeListLoading: false,
  franchiseRoles: FranchiseRolesFactory(4),
  onClose: () => alert('closing'),
  onSubmit: (
    data: FranchiseUserRoleData & {
      first_name: string;
      last_name: string;
    },
  ) => {
    console.log(data);
    alert('Successfully submitted form, see console for data info');
  },
  open: true,
};

export default {
  title: 'Library/Franchise/CreateFranchiseStaffUser',
  component: CreateFranchiseStaffUser,
  parameters: {
    docs: {
      page: null,
    },
  },
};
