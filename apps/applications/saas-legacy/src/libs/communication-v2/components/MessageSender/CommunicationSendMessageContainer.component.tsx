import React, { useCallback, useEffect, useState } from 'react';

import { Collapse, Paper, makeStyles } from '@material-ui/core';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import HTMLPreviewDialog from '#src/components/html/HTMLPreviewDialog.component';
import AutoResendConfigDialog from '#src/libs/communication-v2/components/AutoResendConfigDialog';

import type { Member } from '#src/libs/member/types';

import {
  getFormattedQueryParamsFromContext,
  getFormattedQueryParamsFromThread,
} from '#src/libs/communication-v2/utils';
import {
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
  CAN_SEND_MESSAGE,
  CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS,
  CAN_NOT_SEND_BECAUSE_MISSING_CONTENT,
  CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_A_PHONE_NUMBER,
  CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_AN_EMAIL,
  VALIDITY_INITIAL_VALUE,
  MAX_LENGTH_PUSH_TITLE,
  WAIT_FOR_MESSAGE_SCHEDULER_ANIMATION,
  CONTEXT_SMARTLIST,
} from '#src/libs/communication-v2/constants';
import type {
  MessageData,
  MemberListIdsByCommunicationKind,
  FetchFirstReachedRecipientsParams,
} from '#src/libs/communication-v2/types';
import type { OptionCallback } from '#src/state/types';
import {
  useTagsAndCategories,
  useTheme,
} from '#src/libs/communication-v2/hooks/useCommunicationsTools.hooks';
import {
  FetchAvailableRecipientsParams,
  ResetRecipientsParams,
  useAvailableRecipients,
} from '#src/libs/communication-v2/hooks/useAvailableRecipients.hooks';
import { useEmailTemplates } from '#src/libs/communication-v2/hooks/useEmailTemplates.hooks';
import {
  CreateScheduledCommunicationParams,
  EditScheduledCommunicationParams,
  useCommunicationSchedulers,
} from '#src/libs/communication-v2/hooks/useCommunicationScheduler.hooks';
import { useCommunicationManagement } from '#src/libs/communication-v2/hooks/useCommunicationManagement.hooks';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';
import CommunicationRecipientsModal from '#src/libs/communication-v2/components/MessageSender/ModalRecipient/CommunicationRecipientsModal.component';
import EmailTemplateSelector from '#src/libs/communication-v2/components/MessageSender/Writers/EmailTemplateSelector.component';
import MessageWriterByKind from '#src/libs/communication-v2/components/MessageSender/Writers/MessageWriterByKind.component';
import SendMessageContainerBottomIcons from '#src/libs/communication-v2/components/MessageSender/Writers/SendMessageContainerBottomIcons.component';
import CommunicationSchedulerInput from '#src/libs/communication-v2/components/MessageSender/CommunicationSchedulerInput.component';

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
};

export const CommunicationSendMessageContainer: React.FC<Props> = ({
  relatedObjectKind,
  relatedObjectId,
  directMember,
  pageSize,
  sendCommunication,
}) => {
  const [validity, setValidity] = useState<number>(VALIDITY_INITIAL_VALUE);
  const [checkedMemberCategoryFilter, setCheckedMemberCategoryFilter] =
    useState<number[]>([]);
  const [uncheckedMembers, setUncheckedMembers] =
    useState<MemberListIdsByCommunicationKind>({
      email: [],
      phone: [],
      notification: [],
    });
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);
  const [openTemplateVisualizer, setOpenTemplateVisualizer] = useState(false);
  const [openRecipientSelector, setOpenRecipientSelector] = useState(false);
  const [autoResendConfigDialogOpen, setAutoResendConfigDialogOpen] =
    useState(false);
  const [openCommunicationScheduling, setOpenCommunicationScheduling] =
    useState(false);
  const [hasDraftMessageInitializedData, setHasDraftMessageInitializedData] =
    useState(false);
  const {
    allMemberCategoryList,
    communicationKind,
    communicationIdentifier,
    communicationObjectId,
    communicationMember,
    scheduledCommunicationDraft,
    onCloseCommunicationDrawer,
    setCommunicationKind,
  } = useCommunicationContext();
  const { timezone } = useTheme();
  const {
    availableRecipientsList,
    availableRecipientsError,
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
  const {
    scheduleCommunication,
    editScheduledCommunication,
    sendScheduledCommunicationNow,
  } = useCommunicationSchedulers({
    communicationObjectId,
  });
  const {
    title,
    content,
    mailTemplateSelected,
    communicationSchedulingDate,
    resendCount,
    resendDelay,
    setTitle,
    setContent,
    setMailTemplateSelected,
    setResendConfig,
    setCommunicationSchedulingDate,
    setFocusTextField,
    resetAllContent,
    resetEmailTemplate,
    initializeFromDraft,
    addTag,
    createCommunicationSenderData,
    createCommunicationSchedulingData,
    checkIsMessageSchedulable,
  } = useCommunicationManagement();
  const { loadingTemplateDetails, templateDetailList, fetchTemplateDetails } =
    useEmailTemplates();
  const { resolvedGenericTags, tagCategories } = useTagsAndCategories();
  const classes = useStyles();

  const hasRecipientsListLoaded =
    availableRecipientsList?.length > 0 && !availableRecipientsError;

  const handleOpenResendConfigDialog = useCallback(() => {
    setAutoResendConfigDialogOpen(true);
  }, []);

  const handleCloseResendConfigDialog = useCallback(() => {
    setAutoResendConfigDialogOpen(false);
  }, []);

  const handleOpenMessageSchedulingModal = useCallback(() => {
    setOpenCommunicationScheduling(!openCommunicationScheduling);
  }, [openCommunicationScheduling]);

  const handleCloseRecipientModal = useCallback(
    () => setOpenRecipientSelector(false),
    [setOpenRecipientSelector],
  );

  const handleCloseHTMLPreviewDialog = useCallback(
    () => setOpenTemplateVisualizer(false),
    [],
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

  const handleCheckMemberCategoryFilter = useCallback(
    (nextList: number[], refreshCountRecipients: () => void) => {
      setCheckedMemberCategoryFilter(nextList);
      refreshCountRecipients();
    },
    [setCheckedMemberCategoryFilter],
  );

  const checkAndSetValidity = useCallback(() => {
    const numberOfReachedRecipients = getSelectedRecipientsCount();
    /* We do not want to check the recipients count if :
     * - the communication is a smartlist -> because smartlist can be slow or not even  able to compute
     * - the communication is a direct message -> count will be 1
     * - the communication is a scheduled message -> the count cannot be processed while we are not at the scheduled moment
     */
    const shouldCheckRecipientsCount =
      communicationIdentifier !== CONTEXT_SMARTLIST &&
      !communicationMember &&
      !communicationSchedulingDate;
    if (shouldCheckRecipientsCount && numberOfReachedRecipients <= 0) {
      return setValidity(CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS);
    }
    if (communicationMember) {
      if (communicationKind === WRITE_EMAIL && !communicationMember.email) {
        return setValidity(CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_AN_EMAIL);
      }
      if (
        communicationKind === WRITE_SMS &&
        !communicationMember.phone_number
      ) {
        return setValidity(
          CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_A_PHONE_NUMBER,
        );
      }
    }

    const hasValidMessageScheduling =
      (openCommunicationScheduling &&
        !!communicationSchedulingDate &&
        checkIsMessageSchedulable()) ||
      !openCommunicationScheduling;

    const isValidContent = () => {
      switch (communicationKind) {
        case WRITE_EMAIL:
          return (
            title !== '' && (content !== '' || mailTemplateSelected !== null)
          );
        case WRITE_SMS:
          return content !== '';
        case WRITE_PUSH_NOTIFICATION:
          return (
            title !== '' &&
            title.length <= MAX_LENGTH_PUSH_TITLE &&
            content !== ''
          );
        default:
          return false;
      }
    };

    setValidity(
      hasValidMessageScheduling && isValidContent()
        ? CAN_SEND_MESSAGE
        : CAN_NOT_SEND_BECAUSE_MISSING_CONTENT,
    );
  }, [
    communicationMember,
    communicationIdentifier,
    title,
    content,
    mailTemplateSelected,
    communicationSchedulingDate,
    communicationKind,
    openCommunicationScheduling,
    checkIsMessageSchedulable,
    getSelectedRecipientsCount,
  ]);

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

  const handleSetUncheckedMembers = useCallback(
    (uncheckedIds: {
      email: number[];
      phone: number[];
      notification: number[];
    }) => {
      setUncheckedMembers(uncheckedIds);
      checkAndSetValidity();
    },
    [checkAndSetValidity],
  );

  const flushEditAndRefreshCallback = useCallback(() => {
    resetAllContent();
    setUncheckedMembers({
      email: [],
      phone: [],
      notification: [],
    });
    setFocusTextField(0);
    setOpenTemplateSelector(false);
    setOpenRecipientSelector(false);
    setOpenTemplateVisualizer(false);
    setCheckedMemberCategoryFilter([]);
    setOpenCommunicationScheduling(false);
    setValidity(VALIDITY_INITIAL_VALUE);
  }, [resetAllContent, setFocusTextField]);

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
    const communicationSenderData = createCommunicationSenderData({
      communicationKind,
    });
    const communicationSchedulingData = createCommunicationSchedulingData({
      timezone,
      communicationKind,
    });

    if (communicationSchedulingData) {
      if (openCommunicationScheduling && !scheduledCommunicationDraft) {
        const params: CreateScheduledCommunicationParams = {
          data: communicationSchedulingData,
          options: {
            onSuccess: onCloseCommunicationDrawer,
          },
        };
        scheduleCommunication(params);
        return;
      }

      if (openCommunicationScheduling && scheduledCommunicationDraft) {
        const params: EditScheduledCommunicationParams = {
          data: {
            ...scheduledCommunicationDraft,
            ...communicationSchedulingData,
          },
          options: {
            onSuccess: onCloseCommunicationDrawer,
          },
        };
        editScheduledCommunication(params);
        return;
      }
    }
    if (!openCommunicationScheduling && scheduledCommunicationDraft) {
      sendScheduledCommunicationNow({
        scheduledCommunicationId: scheduledCommunicationDraft.id,
        options: {
          onSuccess: onCloseCommunicationDrawer,
        },
      });
      return;
    }

    sendMessageWithFlushEditAndRefreshCallback({
      ...communicationSenderData?.content,
      ...communicationSenderData?.autoResend,
      member_blacklist: getRecipientBlacklist(),
    });
  }, [
    communicationKind,
    timezone,
    scheduledCommunicationDraft,
    openCommunicationScheduling,
    sendMessageWithFlushEditAndRefreshCallback,
    editScheduledCommunication,
    scheduleCommunication,
    getRecipientBlacklist,
    sendScheduledCommunicationNow,
    onCloseCommunicationDrawer,
    createCommunicationSchedulingData,
    createCommunicationSenderData,
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

  const handleSetCommunicationKind = useCallback(
    (kind: number) => {
      resetEmailTemplate();
      setCommunicationKind(kind);
    },
    [setCommunicationKind, resetEmailTemplate],
  );

  const handleSetResendConfig = useCallback(
    (data: { resendCount: number; resendDelay: number }) => {
      setResendConfig(data);
      handleCloseResendConfigDialog();
    },
    [setResendConfig, handleCloseResendConfigDialog],
  );

  const onTagClick = useCallback(
    (tagIdentifier: string) => {
      addTag({ tagName: tagIdentifier, communicationKind });
    },
    [addTag, communicationKind],
  );

  useEffect(() => {
    checkAndSetValidity();
  }, [checkAndSetValidity]);

  useEffect(() => {
    if (!scheduledCommunicationDraft || hasDraftMessageInitializedData) return;

    initializeFromDraft({
      draft: scheduledCommunicationDraft,
      communicationKind,
    });
    const { email_design, datetime_scheduled } = scheduledCommunicationDraft;

    if (email_design) {
      fetchTemplateDetails({ templateId: email_design });
    }

    if (datetime_scheduled) {
      setTimeout(
        () => setOpenCommunicationScheduling(true),
        WAIT_FOR_MESSAGE_SCHEDULER_ANIMATION,
      );
    }
    setHasDraftMessageInitializedData(true);
  }, [
    hasDraftMessageInitializedData,
    scheduledCommunicationDraft,
    communicationKind,
    fetchTemplateDetails,
    initializeFromDraft,
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

  useEffect(() => {
    if (!openCommunicationScheduling && !scheduledCommunicationDraft) {
      setCommunicationSchedulingDate(null);
    }
  }, [
    openCommunicationScheduling,
    scheduledCommunicationDraft,
    setCommunicationSchedulingDate,
  ]);

  useEffect(() => {
    /* reset the recipients list when building the components
     *  for leftover data in the store and remove them when unbuilding
     *  the component
     */
    resetRecipients({});
    return () => {
      resetRecipients({});
    };
  }, [resetRecipients]);

  const html =
    !loadingTemplateDetails &&
    mailTemplateSelected &&
    templateDetailList?.[mailTemplateSelected]?.html;

  return (
    <>
      <Paper className={classes.mainContainer}>
        {
          <Collapse
            in={openCommunicationScheduling}
            timeout={WAIT_FOR_MESSAGE_SCHEDULER_ANIMATION}
          >
            <CommunicationSchedulerInput
              checkIsMessageSchedulable={checkIsMessageSchedulable}
              communicationSchedulingDate={communicationSchedulingDate}
              setCommunicationSchedulingDate={setCommunicationSchedulingDate}
            />
          </Collapse>
        }
        <MessageWriterByKind
          checkAndSetValidity={checkAndSetValidity}
          communicationKind={communicationKind}
          content={content}
          emailTemplateDetailList={templateDetailList}
          emailTemplateSelected={mailTemplateSelected}
          getEmailDetail={fetchTemplateDetails}
          loadingTemplateDetailList={loadingTemplateDetails}
          setContent={setContent}
          setFocusTextField={setFocusTextField}
          setMailTemplateSelected={setMailTemplateSelected}
          setOpenTemplateVisualizer={setOpenTemplateVisualizer}
          setTitle={setTitle}
          title={title}
        >
          <SendMessageContainerBottomIcons
            checkAndSetValidity={checkAndSetValidity}
            communicationIdentifier={communicationIdentifier}
            communicationKind={communicationKind}
            directMember={directMember}
            getSelectedRecipientsCount={getSelectedRecipientsCount}
            hasRecipientsListLoaded={hasRecipientsListLoaded}
            isMessageSchedulingOpen={openCommunicationScheduling}
            onBaliseItemClick={onTagClick}
            openMessageSchedulingModal={handleOpenMessageSchedulingModal}
            openResendConfigDialog={handleOpenResendConfigDialog}
            relatedObjectKind={relatedObjectKind}
            selectedMemberDetailListAllKinds={firstReachedRecipientsList}
            selectedMemberDetailListLoading={firstReachedRecipientsLoading}
            sendMessage={sendMessage}
            setCommunicationKind={handleSetCommunicationKind}
            setOpenRecipientSelector={setOpenRecipientSelector}
            setOpenTemplateSelector={setOpenTemplateSelector}
            tagCategories={tagCategories}
            validity={validity}
          />
        </MessageWriterByKind>
        {openRecipientSelector && (
          <CommunicationRecipientsModal
            allMemberCategoryList={allMemberCategoryList}
            checkedMemberCategoriesFilters={checkedMemberCategoryFilter}
            countAvailableRecipientsTotal={availableRecipientsTotalCount}
            countAvailableRecipientsWithEmail={
              availableRecipientsWithEmailCount
            }
            countAvailableRecipientsWithPhone={
              availableRecipientsWithPhoneCount
            }
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
        )}
        {openTemplateSelector && communicationKind === WRITE_EMAIL && (
          <EmailTemplateSelector
            checkAndSetValidity={checkAndSetValidity}
            mailTemplateSelected={mailTemplateSelected}
            openTemplateSelector={openTemplateSelector}
            setContent={setContent}
            setMailTemplateSelected={setMailTemplateSelected}
            setOpenTemplateSelector={setOpenTemplateSelector}
            setTitle={setTitle}
            title={title}
          />
        )}
        {openTemplateVisualizer &&
          communicationKind === WRITE_EMAIL &&
          !!html && (
            <HTMLPreviewDialog
              html={html}
              onClose={handleCloseHTMLPreviewDialog}
              open={openTemplateVisualizer}
              resolvedGenericTags={resolvedGenericTags}
              title={title}
            />
          )}
      </Paper>

      <AutoResendConfigDialog
        handleClose={handleCloseResendConfigDialog}
        handleSubmit={handleSetResendConfig}
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
    gap: '8px',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    borderTopWidth: 1,
    borderTopColor: theme.palette.divider,
    borderTopStyle: 'solid',
    borderRadius: 0,
  },
}));

export default React.memo(CommunicationSendMessageContainer);
