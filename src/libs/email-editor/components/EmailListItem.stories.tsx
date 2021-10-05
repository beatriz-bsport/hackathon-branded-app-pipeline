import React from 'react';
import EmailListItem, { OwnProps } from './EmailListItem.components';
import EmailTemplateSummaryFactoryBot from '../../email-editor/factories/EmailTemplateSummary';

import { EmailTemplateSummary } from '../../email-editor/types';

const CustomTemplate = (args: OwnProps) => <EmailListItem {...args} />;

export const DefaultState = CustomTemplate.bind({});

const email: EmailTemplateSummary = EmailTemplateSummaryFactoryBot.EmailTemplateSummary.createOne();

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

export default {
  title: 'Email/ListItem',
  component: EmailListItem,
  parameters: {
    docs: {
      page: null,
    },
  },
};
