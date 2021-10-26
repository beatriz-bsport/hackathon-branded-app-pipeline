import React from 'react';
import FranchiseMemberMembership, {
  OwnProps,
} from './FranchiseMemberMembership.components';
import FactoryBot from '../factories/FranchiseCompanyFactory';

const CustomTemplate = (args: OwnProps) => (
  <FranchiseMemberMembership {...args} />
);

export const CompleteDefaultState = CustomTemplate.bind({});

// @ts-ignore
const companies = FactoryBot.FranchiseCompany.create(4);

CompleteDefaultState.args = {
  companies,
  goToCompanyDetails: () => () => {},
  goToFranchiseCompanyDetails: () => () => {},
};

export default {
  title: 'Library/Franchise/Member Companies',
  component: FranchiseMemberMembership,
  parameters: {
    docs: {
      page: null,
    },
  },
};
