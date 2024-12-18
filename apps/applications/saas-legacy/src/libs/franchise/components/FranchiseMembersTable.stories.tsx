import React from 'react';
import FranchiseMembersTable, {
  OwnProps,
} from './FranchiseMembersTable.components';
import { FranchiseCompanyListFactory } from '../factories/FranchiseCompanyFactory';
import { FranchiseUserFactory } from '../factories/FranchiseUserFactory';

const CustomTemplate = (args: OwnProps) => <FranchiseMembersTable {...args} />;

export const CompleteDefaultState = CustomTemplate.bind({});

const users = FranchiseUserFactory(3);
const userWithCompanies = users.map((user) => ({
  ...user,
  companies: FranchiseCompanyListFactory(5),
}));

CompleteDefaultState.args = {
  users: userWithCompanies,
  usersCount: 3,
  rowsPerPage: 10,
  page: 1,
  handleChangePage: () => {},
  handleChangeRowsPerPage: () => {},
  goToMember: () => () => {},
};

export default {
  title: 'Library/Franchise/Members Table',
  component: FranchiseMembersTable,
  parameters: {
    docs: {
      page: null,
    },
  },
};
