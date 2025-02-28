import React, { useCallback, useEffect, useState } from 'react';

import { Paper, makeStyles } from '@material-ui/core';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import HTMLPreviewDialog from '#src/components/html/HTMLPreviewDialog.component';
import AutoResendConfigDialog from '#src/libs/communication-v2/components/AutoResendConfigDialog';

import type { Member } from '#src/libs/member/types';

import {
  getFormattedQueryParamsFromContext,
  getFormattedQueryParamsFromThread,
} from '#src/libs/communication-v2/utils';
import {
  MAX_LENGTH_PUSH_CONTENT,
  MAX_LENGTH_PUSH_TITLE,
  TEXTFIELD_MAIL_CONTENT,
  TEXTFIELD_MAIL_TITLE,
  TEXTFIELD_NOTIFICATION_CONTENT,
  TEXTFIELD_NOTIFICATION_TITLE,
  TEXTFIELD_SMS_CONTENT,
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
  CAN_SEND_MESSAGE,
  CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS,
  CAN_NOT_SEND_BECAUSE_MISSING_CONTENT,
  CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_A_PHONE_NUMBER,
  CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_AN_EMAIL,
} from '#src/libs/communication-v2/constants';
import type {
  MessageData,
  MemberListIdsByCommunicationKind,
  FetchFirstReachedRecipientsParams,
} from '#src/libs/communication-v2/types';
import type { OptionCallback } from '#src/state/types';
import CommunicationRecipientsModal from '#src/libs/communication-v2/components/MessageSender/ModalRecipient/CommunicationRecipientsModal.component';
import EmailTemplateSelector from '#src/libs/communication-v2/components/MessageSender/Writers/EmailTemplateSelector.component';
import MessageWriterByKind from '#src/libs/communication-v2/components/MessageSender/Writers/MessageWriterByKind.component';
import SendMessageContainerBottomIcons from '#src/libs/communication-v2/components/MessageSender/Writers/SendMessageContainerBottomIcons.component';
import { useTagsAndCategories } from '#src/libs/communication-v2/hooks/useCommunicationsTools.hooks';
import {
  FetchAvailableRecipientsParams,
  ResetRecipientsParams,
  useAvailableRecipients,
} from '#src/libs/communication-v2/hooks/useAvailableRecipients.hooks';
import { useEmailTemplates } from '#src/libs/communication-v2/hooks/useEmailTemplates.hooks';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';

export type Props = {
  relatedObjectKind?: ChatThreadKinds;
  relatedObjectId?: number;
  directMember?: Member;
  pageSize: number;
  sendCommunication: (
    data: MessageData,
    memberSelectedCategories: number[],
    options?: OptionCallback<void>,
  ) => void;
  hideAutoResend?: boolean;
};

export const CommunicationSendMessageContainer: React.FC<Props> = ({
  relatedObjectKind,
  relatedObjectId,
  directMember,
  pageSize,
  sendCommunication,
  hideAutoResend,
}) => {
  const [uncheckedMembers, setUncheckedMembers] =
    useState<MemberListIdsByCommunicationKind>({
      email: [],
      phone: [],
      notification: [],
    });
  const [mailTemplateSelected, setMailTemplateSelected] = useState<
    number | null
  >(null);
  const [mailTitle, setMailTitle] = useState('');
  const [mailContent, setMailContent] = useState('');
  const [smsContent, setSmsContent] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationContent, setNotificationContent] = useState('');
  const [focusTextField, setFocusTextField] = useState<number | null>(null);
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);
  const [openTemplateVisualizer, setOpenTemplateVisualizer] = useState(false);
  const [openRecipientSelector, setOpenRecipientSelector] = useState(false);
  const [validity, setValidity] = useState<number | null>(null);
  const [checkedMemberCategoryFilter, setCheckedMemberCategoryFilter] =
    useState<number[]>([]);

  const [autoResendConfigDialogOpen, setAutoResendConfigDialogOpen] =
    useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendDelay, setResendDelay] = useState(0);
  const {
    allMemberCategoryList,
    communicationKind,
    communicationIdentifier,
    communicationObjectId,
    setCommunicationKind,
  } = useCommunicationContext();
  const {
    availableRecipientsList,
    availableRecipientsTotalCount,
    availableRecipientsWithEmailCount,
    availableRecipientsWithPhoneCount,
    loadingAvailableRecipients,
    firstReachedRecipientsList,
    firstReachedRecipientsLoading,
    fetchAvailableRecipients,
    fetchFirstReachedRecipients,
    resetRecipients,
  } = useAvailableRecipients({
    communicationIdentifier,
    communicationObjectId,
  });
  const { loadingTemplateDetails, templateDetailList, fetchTemplateDetails } =
    useEmailTemplates();
  const { resolvedGenericTags, tagCategories } = useTagsAndCategories();
  const classes = useStyles();

  const openResendConfigDialog = useCallback(() => {
    setAutoResendConfigDialogOpen(true);
  }, []);

  const closeResendConfigDialog = useCallback(() => {
    setAutoResendConfigDialogOpen(false);
  }, []);

  const setResendConfig = useCallback(
    (data: { resendCount: number; resendDelay: number }) => {
      setResendCount(data?.resendCount);
      setResendDelay(data?.resendDelay);
      closeResendConfigDialog();
    },
    [closeResendConfigDialog],
  );

  const getSelectedRecipientsCount = useCallback(() => {
    switch (communicationKind) {
      case WRITE_EMAIL:
        return (
          availableRecipientsWithEmailCount - uncheckedMembers.email.length
        );
      case WRITE_SMS:
        return (
          availableRecipientsWithPhoneCount - uncheckedMembers.phone.length
        );
      case WRITE_PUSH_NOTIFICATION:
        return (
          availableRecipientsTotalCount - uncheckedMembers.notification.length
        );
      default:
        return 0;
    }
  }, [
    communicationKind,
    availableRecipientsWithEmailCount,
    availableRecipientsWithPhoneCount,
    availableRecipientsTotalCount,
    uncheckedMembers,
  ]);

  const checkAndSetValidity = useCallback(() => {
    if (!directMember && getSelectedRecipientsCount() === 0) {
      return setValidity(CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS);
    }

    if (directMember) {
      if (communicationKind === WRITE_EMAIL && !directMember.email) {
        return setValidity(CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_AN_EMAIL);
      }
      if (communicationKind === WRITE_SMS && !directMember.phone_number) {
        return setValidity(
          CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_A_PHONE_NUMBER,
        );
      }
    }

    const updateValidity = (valid: boolean) =>
      setValidity(
        valid ? CAN_SEND_MESSAGE : CAN_NOT_SEND_BECAUSE_MISSING_CONTENT,
      );

    if (communicationKind === WRITE_EMAIL) {
      updateValidity(
        mailTitle !== '' &&
          (mailContent !== '' || mailTemplateSelected !== null),
      );
    }
    if (communicationKind === WRITE_SMS) {
      updateValidity(smsContent !== '');
    }
    if (communicationKind === WRITE_PUSH_NOTIFICATION) {
      updateValidity(notificationTitle !== '' && notificationContent !== '');
    }
  }, [
    directMember,
    communicationKind,
    mailTitle,
    mailContent,
    mailTemplateSelected,
    smsContent,
    notificationTitle,
    notificationContent,
    getSelectedRecipientsCount,
  ]);

  const handleFetchPaginatedAvailableRecipientMemberList = useCallback(
    (page: number) => {
      const params: FetchAvailableRecipientsParams = {
        page,
        memberSelectedCategories: checkedMemberCategoryFilter || [],
      };
      fetchAvailableRecipients(params);
    },
    [fetchAvailableRecipients, checkedMemberCategoryFilter],
  );

  const getRecipientBlacklist = useCallback((): Array<number> => {
    switch (communicationKind) {
      case WRITE_EMAIL:
        return uncheckedMembers.email;
      case WRITE_SMS:
        return uncheckedMembers.phone;
      case WRITE_PUSH_NOTIFICATION:
        return uncheckedMembers.notification;
      default:
        return [];
    }
  }, [communicationKind, uncheckedMembers]);

  const getSelectedMembersDetailsAllKinds = useCallback(() => {
    checkAndSetValidity();
  }, [checkAndSetValidity]);

  const handleCheckMemberCategoryFilter = useCallback(
    (nextList: number[], refreshCountRecipients: () => void) => {
      setCheckedMemberCategoryFilter(nextList);
      refreshCountRecipients();
    },
    [setCheckedMemberCategoryFilter],
  );

  const handleCloseRecipientModal = useCallback(
    () => setOpenRecipientSelector(false),
    [setOpenRecipientSelector],
  );

  const onBaliseItemClick = useCallback(
    (selectedItem: string) => {
      const tagLength = selectedItem?.length + 2; // 2 for the brackets
      if (communicationKind === WRITE_EMAIL) {
        if (focusTextField === TEXTFIELD_MAIL_TITLE) {
          setMailTitle((prevTitle) => `${prevTitle}{${selectedItem}}`);
        } else if (focusTextField === TEXTFIELD_MAIL_CONTENT) {
          setMailContent((prevContent) => `${prevContent}{${selectedItem}}`);
        }
      } else if (
        communicationKind === WRITE_SMS &&
        focusTextField === TEXTFIELD_SMS_CONTENT
      ) {
        setSmsContent((prevContent) => `${prevContent}{${selectedItem}}`);
      } else if (communicationKind === WRITE_PUSH_NOTIFICATION) {
        if (
          focusTextField === TEXTFIELD_NOTIFICATION_TITLE &&
          notificationTitle?.length + tagLength <= MAX_LENGTH_PUSH_TITLE
        ) {
          setNotificationTitle((prevTitle) => `${prevTitle}{${selectedItem}}`);
        } else if (
          focusTextField === TEXTFIELD_NOTIFICATION_CONTENT &&
          notificationContent?.length + tagLength <= MAX_LENGTH_PUSH_CONTENT
        ) {
          setNotificationContent(
            (prevContent) => `${prevContent}{${selectedItem}}`,
          );
        }
      }
    },
    [
      communicationKind,
      focusTextField,
      notificationTitle?.length,
      notificationContent?.length,
    ],
  );

  const onCloseHTMLPreviewDialog = useCallback(
    () => setOpenTemplateVisualizer(false),
    [],
  );

  const flushEditAndRefreshCallback = useCallback(() => {
    setUncheckedMembers({
      email: [],
      phone: [],
      notification: [],
    });
    setMailTemplateSelected(null);
    setMailTitle('');
    setMailContent('');
    setSmsContent('');
    setNotificationTitle('');
    setNotificationContent('');
    setFocusTextField(null);
    setOpenTemplateSelector(false);
    setOpenRecipientSelector(false);
    setOpenTemplateVisualizer(false);
    setCheckedMemberCategoryFilter([]);
    getSelectedMembersDetailsAllKinds();
    setValidity(null);
  }, [getSelectedMembersDetailsAllKinds]);

  const flushEditAndRefreshCallbackWithReset = useCallback(() => {
    // We reset to an initial state with no selected category and no selected members
    const params: ResetRecipientsParams = {
      options: {
        onSuccess: flushEditAndRefreshCallback,
      },
    };
    resetRecipients(params);
  }, [resetRecipients, flushEditAndRefreshCallback]);

  const sendMessageWithFlushEditAndRefreshCallback = useCallback(
    (data: MessageData) => {
      sendCommunication(data, checkedMemberCategoryFilter, {
        onSuccess: allMemberCategoryList
          ? flushEditAndRefreshCallbackWithReset
          : flushEditAndRefreshCallback,
      });
    },
    [
      sendCommunication,
      checkedMemberCategoryFilter,
      flushEditAndRefreshCallback,
      flushEditAndRefreshCallbackWithReset,
      allMemberCategoryList,
    ],
  );

  const sendMessage = useCallback(() => {
    let content;
    let autoResendConfiguration = {
      email_resend_delay: 0,
      email_resend_count: 0,
    };
    switch (communicationKind) {
      case WRITE_EMAIL:
        if (mailTemplateSelected) {
          content = {
            subject: mailTitle,
            email_template: mailTemplateSelected,
          };
        } else {
          content = {
            subject: mailTitle,
            body: mailContent,
          };
        }
        autoResendConfiguration = {
          email_resend_count: resendCount,
          email_resend_delay: resendDelay,
        };
        break;
      case WRITE_SMS:
        content = {
          sms: smsContent,
        };
        break;
      case WRITE_PUSH_NOTIFICATION:
        content = {
          notification_title: notificationTitle,
          notification_content: notificationContent,
        };
        break;
      default:
        console.error('communicationKind matches no one of expected kinds.');
        return;
    }
    sendMessageWithFlushEditAndRefreshCallback({
      ...content,
      ...autoResendConfiguration,
      member_blacklist: getRecipientBlacklist(),
    });
  }, [
    communicationKind,
    mailTemplateSelected,
    mailTitle,
    mailContent,
    resendCount,
    resendDelay,
    smsContent,
    notificationTitle,
    notificationContent,
    sendMessageWithFlushEditAndRefreshCallback,
    getRecipientBlacklist,
  ]);

  const handleSetUncheckedMembers = useCallback(
    (uncheckedIds: {
      email: number[];
      phone: number[];
      notification: number[];
    }) => {
      setUncheckedMembers(uncheckedIds);
      getSelectedMembersDetailsAllKinds();
    },
    [getSelectedMembersDetailsAllKinds],
  );

  useEffect(() => {
    getSelectedMembersDetailsAllKinds();
  }, [getSelectedMembersDetailsAllKinds]);

  const buildContextParams = useCallback(() => {
    if (relatedObjectKind && relatedObjectId) {
      return getFormattedQueryParamsFromThread(
        relatedObjectKind,
        relatedObjectId,
        checkedMemberCategoryFilter,
      );
    }

    if (communicationIdentifier && communicationObjectId) {
      return getFormattedQueryParamsFromContext(
        communicationIdentifier,
        communicationObjectId,
        checkedMemberCategoryFilter,
      );
    }

    return {};
  }, [
    relatedObjectKind,
    relatedObjectId,
    communicationIdentifier,
    communicationObjectId,
    checkedMemberCategoryFilter,
  ]);

  useEffect(() => {
    const contextParams = buildContextParams();

    const params: FetchFirstReachedRecipientsParams = {
      ...contextParams,
      blacklist_email: uncheckedMembers.email,
      blacklist_phone: uncheckedMembers.phone,
      blacklist_notification: uncheckedMembers.notification,
    };

    fetchFirstReachedRecipients(params);
  }, [
    buildContextParams,
    fetchFirstReachedRecipients,
    uncheckedMembers.email,
    uncheckedMembers.phone,
    uncheckedMembers.notification,
  ]);

  const html =
    !loadingTemplateDetails &&
    mailTemplateSelected &&
    templateDetailList?.[mailTemplateSelected]?.html;

  return (
    <>
      <Paper className={classes.mainContainer}>
        <MessageWriterByKind
          checkAndSetValidity={checkAndSetValidity}
          communicationKind={communicationKind}
          emailTemplateDetailList={templateDetailList}
          emailTemplateSelected={mailTemplateSelected}
          emailTitle={mailTitle}
          getEmailDetail={fetchTemplateDetails}
          loadingTemplateDetailList={loadingTemplateDetails}
          mailContent={mailContent}
          notificationContent={notificationContent}
          notificationTitle={notificationTitle}
          setFocusTextField={setFocusTextField}
          setMailContent={setMailContent}
          setMailTemplateSelected={setMailTemplateSelected}
          setMailTitle={setMailTitle}
          setNotificationContent={setNotificationContent}
          setNotificationTitle={setNotificationTitle}
          setOpenTemplateVisualizer={setOpenTemplateVisualizer}
          setSmsContent={setSmsContent}
          smsContent={smsContent}
        >
          <SendMessageContainerBottomIcons
            checkAndSetValidity={checkAndSetValidity}
            communicationIdentifier={communicationIdentifier}
            communicationKind={communicationKind}
            directMember={directMember}
            getSelectedRecipientsCount={getSelectedRecipientsCount}
            hideAutoResend={hideAutoResend}
            onBaliseItemClick={onBaliseItemClick}
            openResendConfigDialog={openResendConfigDialog}
            relatedObjectKind={relatedObjectKind}
            selectedMemberDetailListAllKinds={firstReachedRecipientsList}
            selectedMemberDetailListLoading={firstReachedRecipientsLoading}
            sendMessage={sendMessage}
            setCommunicationKind={setCommunicationKind}
            setOpenRecipientSelector={setOpenRecipientSelector}
            setOpenTemplateSelector={setOpenTemplateSelector}
            tagCategories={tagCategories}
            validity={validity}
          />
        </MessageWriterByKind>
        <CommunicationRecipientsModal
          allMemberCategoryList={allMemberCategoryList}
          checkedMemberCategoriesFilters={checkedMemberCategoryFilter}
          countAvailableRecipientsTotal={availableRecipientsTotalCount}
          countAvailableRecipientsWithEmail={availableRecipientsWithEmailCount}
          countAvailableRecipientsWithPhone={availableRecipientsWithPhoneCount}
          fetchPaginatedAvailableRecipientMemberList={
            handleFetchPaginatedAvailableRecipientMemberList
          }
          handleCloseDialog={handleCloseRecipientModal}
          kind={communicationKind}
          loadingPaginatedMemberList={loadingAvailableRecipients}
          open={openRecipientSelector}
          pageSize={pageSize}
          paginatedMemberList={availableRecipientsList}
          setCheckedMemberCategoriesFilters={handleCheckMemberCategoryFilter}
          setUncheckedMembers={handleSetUncheckedMembers}
          uncheckedMembers={uncheckedMembers}
        />
        {openTemplateSelector && communicationKind === WRITE_EMAIL && (
          <EmailTemplateSelector
            checkAndSetValidity={checkAndSetValidity}
            mailTemplateSelected={mailTemplateSelected}
            mailTitle={mailTitle}
            openTemplateSelector={openTemplateSelector}
            setMailTemplateSelected={setMailTemplateSelected}
            setMailTitle={setMailTitle}
            setOpenTemplateSelector={setOpenTemplateSelector}
          />
        )}
        {openTemplateVisualizer &&
          communicationKind === WRITE_EMAIL &&
          !!html && (
            <HTMLPreviewDialog
              html={html}
              onClose={onCloseHTMLPreviewDialog}
              open={openTemplateVisualizer}
              resolvedGenericTags={resolvedGenericTags}
              title={mailTitle}
            />
          )}
      </Paper>

      <AutoResendConfigDialog
        handleClose={closeResendConfigDialog}
        handleSubmit={setResendConfig}
        initial={{
          resendCount: resendCount,
          resendDelay: resendDelay,
        }}
        open={autoResendConfigDialogOpen}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    borderTopWidth: 1,
    borderTopColor: theme.palette.divider,
    borderTopStyle: 'solid',
    borderRadius: 0,
  },
}));

export default React.memo(CommunicationSendMessageContainer);
