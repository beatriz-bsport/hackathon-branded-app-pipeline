// @ts-nocheck
import React from 'react';
import CommunicationTemplateModal, {
  Props,
} from './CommunicationTemplateModal.component';
import EmailTemplateDetailSummaryListsFactory from '#libs/email-editor/factories/Emails';

const [emailTemplateDetailList, emailTemplateSummaryList] =
  EmailTemplateDetailSummaryListsFactory(6);

const CustomTemplate = (args: Props) => (
  <CommunicationTemplateModal {...args} />
);

export const TemplateSelector = CustomTemplate.bind({});

TemplateSelector.args = {
  fullScreen: false,
  open: true,
  closeDialog: () => {},
  setTemplate: (id: number) => console.log(id),
  setTitle: (title: string) => console.log(title),
  getEmailDetail: (id: number) =>
    console.log('Fetch email detail of email n°', id),
  emailSummaryList: emailTemplateSummaryList,
  emailSummaryListLoading: false,
  emailDetailListLoading: false,
  emailDetailList: emailTemplateDetailList,
  selectedTitle: emailTemplateSummaryList[0].subject,
  selectedTemplate: emailTemplateSummaryList[0].id,
};

export default {
  title: 'Library/Communication-V2/Modals',
  component: CommunicationTemplateModal,
  parameters: {
    docs: {
      page: null,
    },
  },
};
