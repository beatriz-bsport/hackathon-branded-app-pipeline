import React from 'react';
import EmailEditor, { OwnProps } from './EmailEditor.component';
import EmailTemplateSummaryFactoryBot from '../../email-editor/factories/EmailTemplateSummary';
import FranchiseCompanyFactoryBot from '../../franchise/factories/FranchiseCompanyFactory';

import { EmailTemplateSummary } from '../../email-editor/types';
import { FranchiseCompany } from '../../franchise/types';

const CustomTemplate = (args: OwnProps) => <EmailEditor {...args} />;

const email: EmailTemplateSummary = EmailTemplateSummaryFactoryBot.EmailTemplateSummary.createOne();
const companies: FranchiseCompany[] = FranchiseCompanyFactoryBot.FranchiseCompany.create(
  5,
);
const defaultArgs: OwnProps = {
  autoSaveEnabled: false,
  emailToEdit: null,
  company_name: '',
  tags: {
    BillingPlan: [
      'subscription_nb_days_pause',
      'subscription_name',
      'subscription_recurrent_price',
      'subscription_nb_months',
      'subscription_flat_fee',
      'subscription_payment_method',
      'subscription_next_invoice_date',
    ],
  },
  companies: [],
  saveEmail: () => {},
  autoSaveEmail: () => {},
  displayEmptyError: () => {},
  goToList: () => {},
  hideLeftMenuAction: () => {},
  showLeftMenuAction: () => {},
};

export const CreateEmail = CustomTemplate.bind({});

CreateEmail.args = {
  ...defaultArgs,
};

export const EditEmail = CustomTemplate.bind({});

EditEmail.args = {
  ...defaultArgs,
  emailToEdit: email,
};

export const CreateFranchiseEmail = CustomTemplate.bind({});

CreateFranchiseEmail.args = {
  ...defaultArgs,
  companies: companies.map((company, index) => ({
    ...company,
    id: index,
  })),
};

export default {
  title: 'Library/Email Editor/Editor',
  component: EmailEditor,
  parameters: {
    docs: {
      page: null,
    },
  },
};
