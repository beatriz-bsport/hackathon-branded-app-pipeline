import React from 'react';
import CompanyEmailTemplateListItem, {
  OwnProps,
} from './CompanyEmailTemplateListItem.components';
import EmailTemplateSummaryFactoryBot from '../../email-editor/factories/EmailTemplateSummary';
import FranchiseCompanyFactoryBot from '../factories/FranchiseCompanyFactory';

import { FranchiseCompany } from '../types';
import { EmailTemplateSummary } from '../../email-editor/types';

const CustomTemplate = (args: OwnProps) => (
  <CompanyEmailTemplateListItem {...args} />
);

export const DefaultState = CustomTemplate.bind({});

const company: FranchiseCompany = FranchiseCompanyFactoryBot.FranchiseCompany.createOne();
const email: EmailTemplateSummary = EmailTemplateSummaryFactoryBot.EmailTemplateSummary.createOne();

const defaultArgs: OwnProps = {
  email,
  selectedId: 0,
  navigateTo: () => {},
  onEdit: () => {},
  onDelete: () => {},
  search: '',
  withTag: false,
  company,
};

DefaultState.args = {
  ...defaultArgs,
};

export const SelectedState = CustomTemplate.bind({});

SelectedState.args = {
  ...defaultArgs,
  selectedId: email.id,
};

export const GroupByState = CustomTemplate.bind({});

GroupByState.args = {
  ...defaultArgs,
  withTag: true,
};

export const SearchBarState = CustomTemplate.bind({});

SearchBarState.args = {
  ...defaultArgs,
  withTag: true,
  search: email.title.slice(0, 1),
};

export default {
  title: 'Franchise/Email/CompanyListItem',
  component: CompanyEmailTemplateListItem,
  parameters: {
    docs: {
      page: null,
    },
  },
};
