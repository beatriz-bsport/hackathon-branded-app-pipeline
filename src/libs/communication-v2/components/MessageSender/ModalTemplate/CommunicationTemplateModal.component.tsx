import React from 'react';
import { useTranslation } from 'react-i18next';

import CommunicationWrapperDialog from '#libs/communication-v2/components/CommunicationWrapperDialog.component';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';
import CommunicationSelectTemplate from './CommunicationSelectTemplate.component';


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
  const [selectedTemplateId, setSelectedTemplateId] =
    React.useState<number>(null);
  const [currentTitle, setCurrentTitle] = React.useState('');

  React.useEffect(() => {
    selectedTitle && setCurrentTitle(selectedTitle);
    return () => {
      setCurrentTitle('');
    };
  }, [selectedTitle]);

  React.useEffect(() => {
    selectedTemplate && setSelectedTemplateId(selectedTemplate);
  }, [selectedTemplate]);

  // CDM
  React.useEffect(() => {
    if (!emailSummaryList?.length) {
      fetchEmailSummaryList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchEmailSummaryList]);

  const onConfirm = React.useCallback(() => {
    setTemplate(selectedTemplateId);
    setTitle(currentTitle);
    closeDialog?.();
  }, [setTemplate, setTitle, closeDialog, selectedTemplateId, currentTitle]);

  const updateCurrentTitle = React.useCallback((title: string) => {
    setCurrentTitle(title);
  }, []);

  const updateSelectedTemplate = React.useCallback((templateId: number) => {
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
