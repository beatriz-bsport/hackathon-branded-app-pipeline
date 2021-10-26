import React from 'react';
import EmailListItem, { OwnProps } from './EmailListItem.components';
import EmailTemplateSummaryFactoryBot from '../../email-editor/factories/EmailTemplateSummary';
import FranchiseCompanyFactoryBot from '../../franchise/factories/FranchiseCompanyFactory';

import { EmailTemplateSummary } from '../../email-editor/types';
import { FranchiseCompany } from '../../franchise/types';

const CustomTemplate = (args: OwnProps) => <EmailListItem {...args} />;

export const DefaultState = CustomTemplate.bind({});

const email: EmailTemplateSummary = EmailTemplateSummaryFactoryBot.EmailTemplateSummary.createOne();
const companies: FranchiseCompany[] = FranchiseCompanyFactoryBot.FranchiseCompany.create(
  5,
);

const defaultArgs: OwnProps = {
  email,
  selectedId: 0,
  navigateTo: () => {},
  onEdit: () => {},
  onDuplicate: () => {},
  onDelete: () => {},
  search: '',
};

DefaultState.args = {
  ...defaultArgs,
};

export const SelectedState = CustomTemplate.bind({});

SelectedState.args = {
  ...defaultArgs,
  selectedId: email.id,
};

export const SearchBarState = CustomTemplate.bind({});

SearchBarState.args = {
  ...defaultArgs,
  search: email.title.slice(0, 1),
};

export const WithCompanyTagState = CustomTemplate.bind({});

WithCompanyTagState.args = {
  ...defaultArgs,
  companies: [companies[0]],
};

export const WithTooMuchCompanyTagState = CustomTemplate.bind({});

WithTooMuchCompanyTagState.args = {
  ...defaultArgs,
  companies: companies,
};

export const WithAllCompanyTagState = CustomTemplate.bind({});

WithAllCompanyTagState.args = {
  ...defaultArgs,
  companies: companies,
  allCompanies: true,
};

export default {
  title: 'Library/Email Editor/ListItem',
  component: EmailListItem,
  parameters: {
    docs: {
      page: null,
    },
  },
};
