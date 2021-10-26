import React from 'react';
import FranchiseMembersTable, { OwnProps }from './FranchiseMembersTable.components';
import FactoryBotCompany from '../factories/FranchiseCompanyFactory';
import FactoryBotUser from '../factories/FranchiseUserFactory';

const CustomTemplate = (args: OwnProps) => (
    <FranchiseMembersTable {...args} />
);

export const CompleteDefaultState = CustomTemplate.bind({});

// @ts-ignore
const users = FactoryBotUser.FranchiseUser.create(3);
const userWithCompanies = users.map((user) => ({
  ...user,
  // @ts-ignore
  companies: FactoryBotCompany.FranchiseCompany.create(4),
}))

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
            page: null
        }
    },
};
