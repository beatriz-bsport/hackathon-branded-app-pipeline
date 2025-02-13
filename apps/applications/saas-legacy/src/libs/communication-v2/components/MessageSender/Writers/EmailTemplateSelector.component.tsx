import React, { useCallback } from 'react';

import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import CommunicationTemplateModal from '#src/libs/communication-v2/components/MessageSender/ModalTemplate/CommunicationTemplateModal.component';

type EmailTemplateSelectorProps = {
  emailTemplateDetailList: Record<number, EmailTemplateDetail>;
  loadingTemplateDetailList: boolean;
  emailTemplateSummaryList: Array<EmailTemplateSummary>;
  loadingTemplateSummaryList: boolean;
  fetchEmailSummaryList: () => void;
  fullScreen?: boolean;
  getEmailDetail: (templateId: number) => void;
  resolvedGenericTags: ResolvedGenericTags;
  setOpenTemplateSelector: (open: boolean) => void;
  setMailTemplateSelected: (templateId: number | null) => void;
  setMailTitle: (title: string) => void;
  checkAndSetValidity: () => void;
  openTemplateSelector: boolean;
  mailTemplateSelected: number | null;
  mailTitle: string;
};

const EmailTemplateSelector: React.FC<EmailTemplateSelectorProps> = ({
  emailTemplateDetailList,
  loadingTemplateDetailList,
  emailTemplateSummaryList,
  loadingTemplateSummaryList,
  fetchEmailSummaryList,
  fullScreen,
  getEmailDetail,
  resolvedGenericTags,
  setOpenTemplateSelector,
  setMailTemplateSelected,
  setMailTitle,
  checkAndSetValidity,
  openTemplateSelector,
  mailTemplateSelected,
  mailTitle,
}: EmailTemplateSelectorProps) => {
  const onClose = useCallback(
    () => setOpenTemplateSelector(false),
    [setOpenTemplateSelector],
  );
  const setTitle = useCallback(
    (title: string) => setMailTitle(title),
    [setMailTitle],
  );
  const setTemplate = useCallback(
    (templateId: number) => {
      setMailTemplateSelected(templateId);
      checkAndSetValidity();
    },
    [setMailTemplateSelected, checkAndSetValidity],
  );

  return (
    <CommunicationTemplateModal
      closeDialog={onClose}
      emailDetailList={emailTemplateDetailList}
      emailDetailListLoading={loadingTemplateDetailList}
      emailSummaryList={emailTemplateSummaryList}
      emailSummaryListLoading={loadingTemplateSummaryList}
      fetchEmailSummaryList={fetchEmailSummaryList}
      fullScreen={fullScreen}
      getEmailDetail={getEmailDetail}
      open={openTemplateSelector}
      resolvedGenericTags={resolvedGenericTags}
      selectedTemplate={mailTemplateSelected}
      selectedTitle={mailTitle}
      setTemplate={setTemplate}
      setTitle={setTitle}
    />
  );
};

export default React.memo(EmailTemplateSelector);
