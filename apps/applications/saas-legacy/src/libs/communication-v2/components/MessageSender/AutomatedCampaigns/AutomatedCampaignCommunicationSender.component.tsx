import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Collapse, Paper, makeStyles } from '@material-ui/core';

import type {
  CreateAutomatedCampaign,
  EditAutomatedCampaign,
} from '#src/libs/smart-list/types';

import {
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
  CAN_SEND_MESSAGE,
  CAN_NOT_SEND_BECAUSE_MISSING_CONTENT,
  VALIDITY_INITIAL_VALUE,
  MAX_LENGTH_PUSH_TITLE,
  WAIT_FOR_AUTOMATED_CAMPAIGN_LIMIT_ANIMATION,
  WAIT_DRAWER_ANIMATION_TO_RESET_LIMIT,
} from '#src/libs/communication-v2/constants';

import { useAutomatedCampaigns } from '#src/libs/communication-v2/hooks/useAutomatedCampaigns.hooks';
import { useAutomaticCampaignCommunicationManagement } from '#src/libs/communication-v2/hooks/useAutomaticCampaignCommunicationManagement.hooks';
import { useTagsAndCategories } from '#src/libs/communication-v2/hooks/useCommunicationsTools.hooks';
import { useEmailTemplates } from '#src/libs/communication-v2/hooks/useEmailTemplates.hooks';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';

import AutomatedCampaignSetterBottomBarComponent from './AutomatedCampaignSetterBottomBar.component';
import AutomatedCampaignLimitSetter from './AutomatedCampaignLimitSetter.components';
import HTMLPreviewDialog from '#src/components/html/HTMLPreviewDialog.component';
import EmailTemplateSelector from '#src/libs/communication-v2/components/MessageSender/Writers/EmailTemplateSelector.component';
import MessageWriterByKind from '#src/libs/communication-v2/components/MessageSender/Writers/MessageWriterByKind.component';
import AutoResendConfigDialog from '#src/libs/communication-v2/components/AutoResendConfigDialog';

import { getAvailableTagsFromContext } from '#src/libs/communication-v2/utils';

const AutomatedCampaignCommunicationSender: React.FC = () => {
  const [validity, setValidity] = useState<number>(VALIDITY_INITIAL_VALUE);
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);
  const [openTemplateVisualizer, setOpenTemplateVisualizer] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [hasDraftMessageInitializedData, setHasDraftMessageInitializedData] =
    useState(false);
  const [autoResendConfigDialogOpen, setAutoResendConfigDialogOpen] =
    useState(false);

  const {
    communicationKind,
    communicationIdentifier,
    automatedCommunicationDraft,
    automatedCommunicationKind,
    usedAutoCampaignCommMethods,
    setCommunicationKind,
    onCloseCommunicationDrawer,
    communicationObjectId,
  } = useCommunicationContext();
  const {
    title,
    content,
    mailTemplateSelected,
    limit,
    resendCount,
    resendDelay,
    setTitle,
    setContent,
    setMailTemplateSelected,
    setFocusTextField,
    setLimit,
    resetEmailTemplate,
    initializeFromDraft,
    createAutomatedCampaignData,
    addTag,
    setResendConfig,
  } = useAutomaticCampaignCommunicationManagement();
  const { loadingTemplateDetails, templateDetailList, fetchTemplateDetails } =
    useEmailTemplates();
  const {
    createAutomatedCampaignCommunication,
    editAutomatedCampaignCommunication,
  } = useAutomatedCampaigns();
  const { resolvedGenericTags, tagCategories } = useTagsAndCategories();
  const classes = useStyles();

  const handleOpenResendConfigDialog = useCallback(() => {
    setAutoResendConfigDialogOpen(true);
  }, []);

  const handleCloseResendConfigDialog = useCallback(() => {
    setAutoResendConfigDialogOpen(false);
  }, []);

  const handleCloseHTMLPreviewDialog = useCallback(
    () => setOpenTemplateVisualizer(false),
    [],
  );

  const checkAndSetValidity = useCallback(() => {
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
      isValidContent()
        ? CAN_SEND_MESSAGE
        : CAN_NOT_SEND_BECAUSE_MISSING_CONTENT,
    );
  }, [title, content, mailTemplateSelected, communicationKind]);

  const onSend = () => {
    const dataToSend = createAutomatedCampaignData({
      communicationKind,
      eventKind: automatedCommunicationKind,
    });
    if (automatedCommunicationDraft?.id) {
      const automatedCommunicationId = automatedCommunicationDraft.id;
      const params: EditAutomatedCampaign = {
        id: automatedCommunicationId,
        ...automatedCommunicationDraft,
        ...dataToSend,
      };
      editAutomatedCampaignCommunication({
        automatedCampaignId: automatedCommunicationDraft.id,
        data: params,
        options: {
          onSuccess: () => {
            onCloseCommunicationDrawer();
          },
        },
      });
    } else {
      const params: CreateAutomatedCampaign = {
        ...dataToSend,
        smartlist: communicationObjectId,
      };
      createAutomatedCampaignCommunication({
        data: params,
        options: {
          onSuccess: () => {
            onCloseCommunicationDrawer();
          },
        },
      });
    }
  };

  const handleSetCommunicationKind = useCallback(
    (kind: number) => {
      resetEmailTemplate();
      setCommunicationKind(kind);
    },
    [setCommunicationKind, resetEmailTemplate],
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
    if (!automatedCommunicationDraft || hasDraftMessageInitializedData) return;

    initializeFromDraft({
      draft: automatedCommunicationDraft,
      communicationKind,
    });
    const { email_design, max_communications_sent_per_member } =
      automatedCommunicationDraft;

    if (max_communications_sent_per_member) {
      setTimeout(
        () => setIsLimitModalOpen(true),
        WAIT_FOR_AUTOMATED_CAMPAIGN_LIMIT_ANIMATION,
      );
    }

    if (email_design) {
      fetchTemplateDetails({ templateId: email_design });
    }

    setHasDraftMessageInitializedData(true);
  }, [
    hasDraftMessageInitializedData,
    automatedCommunicationDraft,
    communicationKind,
    fetchTemplateDetails,
    initializeFromDraft,
  ]);

  const handleOpenEmailTemplateSelector = () => {
    setOpenTemplateSelector(true);
  };

  const handleLimitModal = () => {
    setIsLimitModalOpen((current) => {
      if (current)
        setTimeout(() => setLimit(0), WAIT_DRAWER_ANIMATION_TO_RESET_LIMIT);
      return !current;
    });
  };

  const handleSetResendConfig = useCallback(
    (data: { resendCount: number; resendDelay: number }) => {
      setResendConfig(data);
      handleCloseResendConfigDialog();
    },
    [setResendConfig, handleCloseResendConfigDialog],
  );

  const html =
    !loadingTemplateDetails &&
    mailTemplateSelected &&
    templateDetailList?.[mailTemplateSelected]?.html;

  const tags = useMemo(() => {
    return getAvailableTagsFromContext(communicationIdentifier, tagCategories);
  }, [tagCategories, communicationIdentifier]);

  useEffect(
    () => {
      if (usedAutoCampaignCommMethods && !automatedCommunicationDraft) {
        const allMethods = [WRITE_EMAIL, WRITE_SMS, WRITE_PUSH_NOTIFICATION];

        const availableMethods = allMethods.filter(
          (method) => !usedAutoCampaignCommMethods.includes(method),
        );

        if (availableMethods.length === 0) {
          return;
        }
        setCommunicationKind(availableMethods[0]);
      }
    },
    /**
     *  I only want to run this effect when the component mounts
     *  and with our lint rules I have to disabled this to not
     *  add more warnings
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <Paper className={classes.mainContainer}>
        <Collapse in={isLimitModalOpen}>
          <AutomatedCampaignLimitSetter limit={limit} setLimit={setLimit} />
        </Collapse>
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
          <AutomatedCampaignSetterBottomBarComponent
            actionType={communicationKind}
            handleSelectTemplate={handleOpenEmailTemplateSelector}
            onBaliseItemClick={onTagClick}
            openAutomatedCampaignLimitModal={handleLimitModal}
            openResendConfigDialog={handleOpenResendConfigDialog}
            sendMessage={onSend}
            setActionType={handleSetCommunicationKind}
            tags={tags}
            validity={validity}
          />
        </MessageWriterByKind>
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

export default React.memo(AutomatedCampaignCommunicationSender);
