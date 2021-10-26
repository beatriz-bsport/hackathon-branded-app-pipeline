import React from 'react';
import FranchiseNotificationRuleCard, {
  OwnProps,
} from './FranchiseNotificationRuleCard.component';
import FactoryBotCompany from '../factories/FranchiseCompanyFactory';
import EmailTemplateSummaryFactoryBot from '../../email-editor/factories/EmailTemplateSummary';
import EmailTemplateDetailFactoryBot from '../../email-editor/factories/EmailTemplateDetail';
import FranchiseCompleteNotificationRuleFactoryBot from '../../notification-rule/factories/FranchiseCompleteNotificationRule';

import { FranchiseCompany } from '../types';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';
import { FranchiseCompleteNotificationRule } from '../../notification-rule/types';

const CustomTemplate = (args: OwnProps) => (
  <FranchiseNotificationRuleCard {...args} />
);

const companies: FranchiseCompany[] = FactoryBotCompany.FranchiseCompany.create(
  5,
);

const emails: EmailTemplateSummary[] = EmailTemplateSummaryFactoryBot.EmailTemplateSummary.create(
  5,
);
const emailsDetails: EmailTemplateDetail[] = EmailTemplateDetailFactoryBot.EmailTemplateDetail.create(
  5,
);
const rule: FranchiseCompleteNotificationRule[] = FranchiseCompleteNotificationRuleFactoryBot.FranchiseCompleteNotificationRule.create();

export const CompleteDefaultState = CustomTemplate.bind({});

const defaultArg = {
  rule: {
    ...rule,
    companies: [companies[0].id],
    email_design: [emails[0].id],
  },
  emailDesignList: emails,
  companies,
  notificationId: 12,
  previewEmail: emails.reduce<Record<string, EmailTemplateDetail>>(
    (dic, email) => {
      dic[email.id] = emailsDetails[0];
      return dic;
    },
    {},
  ),
  fetchPreview: () => {},
};

CompleteDefaultState.args = {
  ...defaultArg,
};

export default {
  title: 'Library/Franchise/Notification Rule Card',
  component: FranchiseNotificationRuleCard,
  parameters: {
    docs: {
      page: null,
    },
  },
};
