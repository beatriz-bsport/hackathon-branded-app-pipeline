import React from 'react';
import FranchiseNotificationRuleFormModal, {
  OwnProps,
} from './FranchiseNotificationRuleFormModal.component';
import FactoryBotCompany from '../factories/FranchiseCompanyFactory';
import EmailTemplateSummaryFactoryBot from '../../email-editor/factories/EmailTemplateSummary';
import FranchiseCompleteNotificationRuleFactoryBot from '../../notification-rule/factories/FranchiseCompleteNotificationRule';
import EmailTemplateDetailFactoryBot from '../../email-editor/factories/EmailTemplateDetail';

import { FranchiseCompany } from '../types';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';
import { FranchiseCompleteNotificationRule } from '../../notification-rule/types';

const CustomTemplate = (args: OwnProps) => (
  <FranchiseNotificationRuleFormModal {...args} />
);

const companies: FranchiseCompany[] = FactoryBotCompany.FranchiseCompany.create(
  5,
);

const emails: EmailTemplateSummary[] = EmailTemplateSummaryFactoryBot.EmailTemplateSummary.create(
  5,
);
const emailsDetails: EmailTemplateDetail[] = EmailTemplateDetailFactoryBot.EmailTemplateDetail.create(
  1,
);
const rule: FranchiseCompleteNotificationRule[] = FranchiseCompleteNotificationRuleFactoryBot.FranchiseCompleteNotificationRule.create();

export const CreateNewRule = CustomTemplate.bind({});

const defaultArg = {
  open: true,
  emailTemplates: emails,
  companies,
  categoryName: 'Test',
  refreshEmailPreview: () => {},
  onSubmit: () => {},
  onClose: () => {},
};

CreateNewRule.args = {
  ...defaultArg,
};

export const EditRule = CustomTemplate.bind({});

EditRule.args = {
  ...defaultArg,
  rule: {
    ...rule,
    companies: companies.map((c) => c.id),
    email_design: emails[0].id,
  },
  previewEmail: emailsDetails,
};

export default {
  title: 'Library/Franchise/Notification Form',
  component: FranchiseNotificationRuleFormModal,
  parameters: {
    docs: {
      page: null,
    },
  },
};
