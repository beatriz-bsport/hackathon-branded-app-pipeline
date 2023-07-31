import React from 'react';
import FranchiseCompaniesListingTooltip, {
  OwnProps,
} from './FranchiseCompaniesListingTooltip.component';
import FactoryBot from '../factories/FranchiseCompanyFactory';

const CustomTemplate = (args: OwnProps) => (
  <FranchiseCompaniesListingTooltip {...args}>
    <span>HOVER ME</span>
  </FranchiseCompaniesListingTooltip>
);

export const CompleteDefaultState = CustomTemplate.bind({});

// @ts-ignore
const companies = FactoryBot.FranchiseCompany.create(5);

CompleteDefaultState.args = {
  companies,
};

export default {
  title: 'Library/Franchise/Company Tooltip',
  component: FranchiseCompaniesListingTooltip,
  parameters: {
    docs: {
      page: null,
    },
  },
};
