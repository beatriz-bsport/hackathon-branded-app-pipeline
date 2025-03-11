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
  emailTitle: string;
  loadingTemplateDetailList: boolean;
  mailContent: string;
  notificationContent: string;
  notificationTitle: string;
  smsContent: string;
  getEmailDetail: ({ templateId }: FetchTemplateDetailsParams) => void;
  setOpenTemplateVisualizer: (open: boolean) => void;
  setMailTemplateSelected: (templateId: number | null) => void;
  setMailTitle: (title: string) => void;
  setMailContent: (content: string) => void;
  setNotificationTitle: (title: string) => void;
  setNotificationContent: (content: string) => void;
  setSmsContent: (content: string) => void;
  setFocusTextField: (identifier: number | null) => void;
  checkAndSetValidity: () => void;
};

const MessageWriterByKind: React.FC<MessageWriterByKindProps> = ({
  children,
  communicationKind,
  emailTemplateDetailList,
  emailTemplateSelected,
  emailTitle,
  loadingTemplateDetailList,
  mailContent,
  notificationContent,
  notificationTitle,
  smsContent,
  getEmailDetail,
  setOpenTemplateVisualizer,
  setMailTemplateSelected,
  setMailTitle,
  setMailContent,
  setNotificationTitle,
  setNotificationContent,
  setSmsContent,
  setFocusTextField,
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
    setMailTitle('');
  }, [setMailTemplateSelected, setMailTitle]);

  const handleChangeTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMailTitle(event.target.value);
      checkAndSetValidity();
    },
    [setMailTitle, checkAndSetValidity],
  );

  const handleChangeContent = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMailContent(event.target.value);
      checkAndSetValidity();
    },
    [setMailContent, checkAndSetValidity],
  );

  const handleChangeNotificationTitle = useCallback(
    (event: React.ChangeEvent) => {
      const target = event.target as HTMLInputElement;
      setNotificationTitle(target.value);
      checkAndSetValidity();
    },
    [setNotificationTitle, checkAndSetValidity],
  );

  const handleChangeNotificationContent = useCallback(
    (event: React.ChangeEvent) => {
      const target = event.target as HTMLInputElement;
      setNotificationContent(target.value);
      checkAndSetValidity();
    },
    [setNotificationContent, checkAndSetValidity],
  );

  const handleChangeSMSContent = useCallback(
    (event: React.ChangeEvent) => {
      const target = event.target as HTMLInputElement;
      setSmsContent(target.value);
      checkAndSetValidity();
    },
    [setSmsContent, checkAndSetValidity],
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
          emailContent={mailContent}
          emailTemplateDetails={emailTemplateDetailList}
          emailTemplateSelected={emailTemplateSelected}
          emailTitle={emailTitle}
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
          handleChangeContent={handleChangeSMSContent}
          onFocus={onFocus}
          smsContent={smsContent}
        >
          {children}
        </CommunicationWriteSMS>
      )}
      {communicationKind === WRITE_PUSH_NOTIFICATION && (
        <CommunicationWriteNotification
          fullScreen={fullScreen}
          handleChangeContent={handleChangeNotificationContent}
          handleChangeTitle={handleChangeNotificationTitle}
          notificationContent={notificationContent}
          notificationTitle={notificationTitle}
          onFocus={onFocus}
        >
          {children}
        </CommunicationWriteNotification>
      )}
    </>
  );
};

export default React.memo(MessageWriterByKind);
