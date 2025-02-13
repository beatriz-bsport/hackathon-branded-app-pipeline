import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CommunicationWrapperDialog from '#src/libs/communication-v2/components/CommunicationWrapperDialog.component';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import CommunicationSelectTemplate from '#src/libs/communication-v2/components/MessageSender/ModalTemplate/CommunicationSelectTemplate.component';

export type Props = {
  emailDetailList: Record<number, EmailTemplateDetail>;
  emailDetailListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailSummaryListLoading: boolean;
  fullScreen?: boolean;
  open: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  selectedTemplate: number;
  selectedTitle: string;
  closeDialog: () => void;
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  setTemplate: (id: number) => void;
  setTitle: (title: string) => void;
};

export const CommunicationTemplateModal: React.FC<Props> = ({
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  fullScreen,
  open,
  resolvedGenericTags,
  selectedTemplate,
  selectedTitle,
  closeDialog,
  fetchEmailSummaryList,
  getEmailDetail,
  setTemplate,
  setTitle,
}) => {
  const { t } = useTranslation('communication');
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(null);
  const [currentTitle, setCurrentTitle] = useState('');

  useEffect(() => {
    selectedTitle && setCurrentTitle(selectedTitle);
    return () => {
      setCurrentTitle('');
    };
  }, [selectedTitle]);

  useEffect(() => {
    selectedTemplate && setSelectedTemplateId(selectedTemplate);
  }, [selectedTemplate]);

  // CDM
  useEffect(() => {
    if (!emailSummaryList?.length) {
      fetchEmailSummaryList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchEmailSummaryList]);

  const onConfirm = useCallback(() => {
    setTemplate(selectedTemplateId);
    setTitle(currentTitle);
    closeDialog?.();
  }, [setTemplate, setTitle, closeDialog, selectedTemplateId, currentTitle]);

  const updateCurrentTitle = useCallback((title: string) => {
    setCurrentTitle(title);
  }, []);

  const updateSelectedTemplate = useCallback((templateId: number) => {
    setSelectedTemplateId(templateId);
  }, []);

  return (
    <CommunicationWrapperDialog
      buttonCancelText={t('common.cancel')}
      buttonConfirmText={t('common.confirm')}
      closeDialog={closeDialog}
      fullScreen={fullScreen}
      onCancel={closeDialog}
      onConfirm={onConfirm}
      open={open}
      title={t('dialogTemplate.title')}
    >
      <CommunicationSelectTemplate
        currentTitle={currentTitle}
        emailDetailList={emailDetailList}
        emailDetailListLoading={emailDetailListLoading}
        emailSummaryList={emailSummaryList}
        emailSummaryListLoading={emailSummaryListLoading}
        fetchEmailSummaryList={fetchEmailSummaryList}
        getEmailDetail={getEmailDetail}
        resolvedGenericTags={resolvedGenericTags}
        selectedTemplate={selectedTemplateId}
        updateCurrentTitle={updateCurrentTitle}
        updateSelectedTemplate={updateSelectedTemplate}
      />
    </CommunicationWrapperDialog>
  );
};

export default React.memo(CommunicationTemplateModal);
