import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CommunicationWrapperDialog from '#src/libs/communication-v2/components/CommunicationWrapperDialog.component';
import CommunicationSelectTemplate from './CommunicationSelectTemplate.component';
import { useEmailTemplates } from '#src/libs/communication-v2/hooks/useEmailTemplates.hooks';

export type Props = {
  open: boolean;
  selectedTemplate?: number;
  selectedTitle: string;
  closeDialog: () => void;
  setTemplate: (id: number) => void;
  setTitle: (title: string) => void;
};

export const CommunicationTemplateModal: React.FC<Props> = ({
  open,
  selectedTemplate,
  selectedTitle,
  closeDialog,
  setTemplate,
  setTitle,
}) => {
  const { t } = useTranslation('communication');
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );
  const [currentTitle, setCurrentTitle] = useState('');
  const { templateDetailList, fetchTemplateSummaries } = useEmailTemplates();

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
    if (!templateDetailList?.length) {
      fetchTemplateSummaries();
    }
  }, [fetchTemplateSummaries, templateDetailList]);

  const onConfirm = useCallback(() => {
    if (!selectedTemplateId) return;
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
      maxWidth="md"
      onCancel={closeDialog}
      onConfirm={onConfirm}
      open={open}
      title={t('dialogTemplate.title')}
    >
      <CommunicationSelectTemplate
        currentTitle={currentTitle}
        elementContext="dialog"
        emailDetailList={templateDetailList}
        fetchEmailSummaryList={fetchTemplateSummaries}
        selectedTemplate={selectedTemplateId}
        updateCurrentTitle={updateCurrentTitle}
        updateSelectedTemplate={updateSelectedTemplate}
      />
    </CommunicationWrapperDialog>
  );
};

export default React.memo(CommunicationTemplateModal);
