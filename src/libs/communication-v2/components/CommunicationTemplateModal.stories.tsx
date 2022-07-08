import React from 'react';
import CommunicationTemplateModal, { Props } from './CommunicationTemplateModal.component';
import EmailTemplateSummaryFactoryBot from '../../email-editor/factories/EmailTemplateSummary';
import EmailTemplateDetailFactoryBot from '../../email-editor/factories/EmailTemplateDetail';
import { EmailTemplateSummary, EmailTemplateDetail } from '../../email-editor/types';

const defaultOptions = {
  fullScreen: false,
  open: true,
  closeDialog: () => { },
  setTemplate: (id: number) => console.log(id),
  setTitle: (title: string) => console.log(title),
  getEmailDetail: (id: number) => console.log("Fetch email detail of email n°", id),
  selectedTemplate: undefined,
  selectedTitle: undefined,
};
const emailSummaries: Array<EmailTemplateSummary> = EmailTemplateSummaryFactoryBot.EmailTemplateSummary.create(2);
const emailDetails: Array<EmailTemplateDetail> = EmailTemplateDetailFactoryBot.EmailTemplateDetail.create(2);
for (let i = 0; i < 2; i += 1){ 
  emailDetails[i].id = emailSummaries[i].id;
}
console.log(emailSummaries, emailDetails);

const CustomTemplate = (args: Props) => <CommunicationTemplateModal {...args} />;

export const LoadingState = CustomTemplate.bind({});

LoadingState.args = {
  ...defaultOptions,
  emailSummaries: undefined,
  emailSummariesLoading: true,
  emailDetailsloading: true,
  emailDetails: undefined
};

export const LoadedState = CustomTemplate.bind({});

LoadedState.args = {
  ...defaultOptions,
  emailSummaries: emailSummaries,
  emailSummariesLoading: false,
  emailDetailsloading: false,
  emailDetails: emailDetails,
};

export const SeeAlreadySelectedTemplate = CustomTemplate.bind({});

SeeAlreadySelectedTemplate.args = {
  ...defaultOptions,
  emailSummaries: emailSummaries,
  emailSummariesLoading: false,
  emailDetailsloading: false,
  emailDetails: emailDetails,
  selectedTitle: "Je suis le titre de ce super mail",
  selectedTemplate: emailSummaries[0].id,
};

export default {
  title: 'Library/Communication-V2/TemplateModal',
  component: CommunicationTemplateModal,
  parameters: {
    docs: {
      page: null,
    },
  },
};