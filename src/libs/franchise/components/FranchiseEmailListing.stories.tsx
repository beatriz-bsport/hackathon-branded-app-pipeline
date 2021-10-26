import React from 'react';
import FranchiseEmailListing, {
  OwnProps,
} from './FranchiseEmailListing.components';
import FranchiseCompanyFactoryBot from '../factories/FranchiseCompanyFactory';
import EmailTemplateSummaryFactoryBot from '../../email-editor/factories/EmailTemplateSummary';

import { FranchiseCompany } from '../types';
import { EmailTemplateSummary } from '../../email-editor/types';

const CustomTemplate = (args: OwnProps) => <FranchiseEmailListing {...args} />;

export const CompleteStateGroupBy = CustomTemplate.bind({});

const companies: FranchiseCompany[] = FranchiseCompanyFactoryBot.FranchiseCompany.create(
  5,
);

const emails: EmailTemplateSummary[] = EmailTemplateSummaryFactoryBot.EmailTemplateSummary.create(
  5,
);

const defaultArgs: OwnProps = {
  navigateTo: () => () => {},
  onEdit: () => () => {},
  onDuplicate: () => () => {},
  onDelete: () => () => {},
  saveFilter: () => {},
  companyDic: companies.reduce<Record<number, FranchiseCompany>>(
    (acc, company) => {
      acc[company.id] = company;
      return acc;
    },
    {},
  ),
  franchiseEmails: [
    {
      ...emails[0],
      id: 1,
    },
    ...emails,
  ],
  companiesEmails: emails.map((email) => ({
    ...email,
    company_id: companies[0].id,
  })),
  selectedId: 1,
  isGrouped: false,
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
