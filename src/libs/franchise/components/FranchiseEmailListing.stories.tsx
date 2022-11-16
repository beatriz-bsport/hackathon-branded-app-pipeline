import React from 'react';
import FranchiseEmailListing, {
  OwnProps,
} from './FranchiseEmailListing.components';
import { FranchiseCompanyListFactory } from '../factories/FranchiseCompanyFactory';
import   { companyEmailListFactory } from '../../email-editor/factories/EmailTemplateSummary';

import { FranchiseCompany } from '../types';
import { EmailTemplateSummary } from '../../email-editor/types';

const CustomTemplate = (args: OwnProps) => {
  const [isGrouped, setIsGrouped] = React.useState(false)
  const saveFilter = (grouped: boolean)=> setIsGrouped(grouped)
  return (
    <FranchiseEmailListing {...args} saveFilter={saveFilter} isGrouped={isGrouped} />
  );
};

export const CompleteStateGroupBy = CustomTemplate.bind({});

const companies: FranchiseCompany[] = FranchiseCompanyListFactory(5)

const emails :EmailTemplateSummary[] = companies.reduce((acc:EmailTemplateSummary[] , cpy: FranchiseCompany) => { 
  console.log(acc, cpy)
  const emailForCompany = companyEmailListFactory(cpy.id, 5)
  console.log(emailForCompany, cpy)
  return [...acc, ...emailForCompany]
}, [])

const defaultArgs: OwnProps = {
  navigateTo: () => () => {},
  onEdit: () => () => {},
  onDuplicate: () => () => {},
  onDelete: () => () => {},
  saveFilter: () => {},
  companies:companies,
  emails:emails,
  selectedId: 1,
  isGrouped: false,
  useVirtualizedList: true,
};

CompleteStateGroupBy.args = {
  ...defaultArgs,
  isGrouped: true,
};

export const CompleteStateList = CustomTemplate.bind({});

CompleteStateList.args = {
  ...defaultArgs,
  isGrouped: false,
};

export default {
  title: 'Library/Franchise/Email List',
  component: FranchiseEmailListing,
  parameters: {
    docs: {
      page: null,
    },
  },
};
