import React, { useState } from 'react';
import FranchiseCompaniesSelector, {
  OwnProps,
} from './FranchiseCompaniesSelector.component';
import FranchiseCompanyFactoryBot from '../factories/FranchiseCompanyFactory';

import { FranchiseCompany } from '../../franchise/types';

const CustomTemplate = (args: OwnProps) => {
  const [selectedCompanies, setselectedCompanies] = useState(
    args.selectedCompanies,
  );
  return (
    <FranchiseCompaniesSelector
      {...args}
      selectedCompanies={selectedCompanies}
      onChange={(companies) => {
        setselectedCompanies(companies);
      }}
    />
  );
};

const companiesFactory: FranchiseCompany[] = FranchiseCompanyFactoryBot.FranchiseCompany.create(
  5,
);
const companies = companiesFactory.map((company, index) => ({
  ...company,
  id: index,
}));
const companyDic = companies.reduce<Record<number, FranchiseCompany>>(
  (dic, company) => {
    dic[company.id] = company;
    return dic;
  },
  {},
);
const defaultArgs: OwnProps = {
  selectedCompanies: [],
  companyDic,
  companies,
  withAllCompaniesTag: false,
  onChange: () => {},
};

export const ClassicUse = CustomTemplate.bind({});

ClassicUse.args = {
  ...defaultArgs,
};

export const WithDefaultValue = CustomTemplate.bind({});

WithDefaultValue.args = {
  ...defaultArgs,
  selectedCompanies: [...companies].slice(0, 2).map((c) => ({
    label: c.name,
    value: `${c.id}`,
  })),
};

export const WithAllCompaniesTagActivated = CustomTemplate.bind({});

WithAllCompaniesTagActivated.args = {
  ...defaultArgs,
  selectedCompanies: [...companies].map((c) => ({
    label: c.name,
    value: `${c.id}`,
  })),
  withAllCompaniesTag: true,
};

export default {
  title: 'Franchise/Selector/Company',
  component: FranchiseCompaniesSelector,
  parameters: {
    docs: {
      page: null,
    },
  },
};
