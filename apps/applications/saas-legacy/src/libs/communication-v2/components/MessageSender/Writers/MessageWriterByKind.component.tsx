import React, { useCallback } from 'react';
import type { EmailTemplateDetail } from '#src/libs/email-editor/types';
import type { FetchTemplateDetailsParams } from '#src/libs/communication-v2/hooks/useEmailTemplates.hooks';
import {
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
} from '#src/libs/communication-v2/constants';
import CommunicationWriteSMS from '#src/libs/communication-v2/components/MessageSender/Writers/CommunicationWriteSMS.component';
import CommunicationWriteNotification from '#src/libs/communication-v2/components/MessageSender/Writers/CommunicationWriteNotification.component';
import CommunicationWriteEmail from '#src/libs/communication-v2/components/MessageSender/Writers/CommunicationWriteEmail.component';
import { openNewBackOfficeWindow } from '#src/utils/windows';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';

type MessageWriterByKindProps = {
  children: React.ReactNode;
  communicationKind: number;
  emailTemplateDetailList: Record<number, EmailTemplateDetail>;
  emailTemplateSelected: number | null;
  title: string;
  loadingTemplateDetailList: boolean;
  content: string;
  getEmailDetail: ({ templateId }: FetchTemplateDetailsParams) => void;
  setOpenTemplateVisualizer: (open: boolean) => void;
  setMailTemplateSelected: (templateId: number | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setFocusTextField: (identifier: number) => void;
  checkAndSetValidity: () => void;
};

const MessageWriterByKind: React.FC<MessageWriterByKindProps> = ({
  children,
  communicationKind,
  emailTemplateDetailList,
  emailTemplateSelected,
  loadingTemplateDetailList,
  title,
  content,
  getEmailDetail,
  setOpenTemplateVisualizer,
  setMailTemplateSelected,
  setFocusTextField,
  setTitle,
  setContent,
  checkAndSetValidity,
}: MessageWriterByKindProps) => {
  const { fullScreen } = useCommunicationContext();
  const onSeeTemplate = useCallback(() => {
    setOpenTemplateVisualizer(true);
  }, [setOpenTemplateVisualizer]);

  const onEditTemplate = useCallback(() => {
    const url = `/email-template/${emailTemplateSelected}/edit`;
    openNewBackOfficeWindow(url);
  }, [emailTemplateSelected]);

  const onRemoveTemplate = useCallback(() => {
    setMailTemplateSelected(null);
    setTitle('');
  }, [setMailTemplateSelected, setTitle]);

  const handleChangeTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value || '');
      checkAndSetValidity();
    },
    [setTitle, checkAndSetValidity],
  );

  const handleChangeContent = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContent(event.target.value || '');
      checkAndSetValidity();
    },
    [setContent, checkAndSetValidity],
  );

  const onFocus = useCallback(
    (identifier: number) => {
      setFocusTextField(identifier);
    },
    [setFocusTextField],
  );

  return (
    <>
      {communicationKind === WRITE_EMAIL && (
        <CommunicationWriteEmail
          emailContent={content}
          emailTemplateDetails={emailTemplateDetailList}
          emailTemplateSelected={emailTemplateSelected}
          emailTitle={title}
          fullScreen={fullScreen}
          handleChangeContent={handleChangeContent}
          handleChangeTitle={handleChangeTitle}
          loadingTemplateDetails={loadingTemplateDetailList}
          onEditTemplate={onEditTemplate}
          onFocus={onFocus}
          onRemoveTemplate={onRemoveTemplate}
          onSeeTemplate={onSeeTemplate}
          refreshTemplateData={getEmailDetail}
        >
          {children}
        </CommunicationWriteEmail>
      )}
      {communicationKind === WRITE_SMS && (
        <CommunicationWriteSMS
          fullScreen={fullScreen}
          handleChangeContent={handleChangeContent}
          onFocus={onFocus}
          smsContent={content}
        >
          {children}
        </CommunicationWriteSMS>
      )}
      {communicationKind === WRITE_PUSH_NOTIFICATION && (
        <CommunicationWriteNotification
          fullScreen={fullScreen}
          handleChangeContent={handleChangeContent}
          handleChangeTitle={handleChangeTitle}
          notificationContent={content}
          notificationTitle={title}
          onFocus={onFocus}
        >
          {children}
        </CommunicationWriteNotification>
      )}
    </>
  );
};

export default React.memo(MessageWriterByKind);
