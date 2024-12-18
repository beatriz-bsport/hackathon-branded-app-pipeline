import React, { memo } from 'react';

import { makeStyles } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Send from '@material-ui/icons/Send';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { useTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';

import CommunicationSendMessageContainer from '#src/libs/communication-v2/components/MessageSender/CommunicationSendMessageContainer.component';
import {
  PAGINATION_SIZE_RECIPIENTS,
  MAP_THREAD_KIND_TO_CONTEXT_IDENTIFIER,
} from '#src/libs/communication-v2/constants';
import type {
  Communication,
  CommunicationThread,
  FilteringMemberIdsByGenericCategories,
  MessageData,
} from '#src/libs/communication-v2/types';
import type { Member } from '#src/libs/member/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import type { OptionCallback } from '../../../../state/types';

type Props = {
  // --- Inbox Thread ---
  thread?: CommunicationThread;
  contextSelected?: ChatThreadKinds;

  // --- Send Message ---
  communicationKindBeingWritten: number;
  showMessageWriter: boolean;
  handleShowMessageWriter: () => void;

  fetchEmailSummaryList: () => void;
  fetchPaginatedAvailableRecipientMemberList: (
    page: number,
    memberSelectedCategories?: number[],
  ) => void;
  fetchEmailDetail: (templateId: number) => void;
  loadingRecipientsModalMemberList: boolean;
  paginatedMemberList: Member[];
  resetPaginatedAvailableRecipientMemberList: (options: OptionCallback) => void;

  sendCommunication: (
    data: MessageData,
    memberSelectedCategories: number[],
    option: OptionCallback & {
      storeInCallback: (communication: Communication) => boolean;
    },
  ) => void;
  setCommunicationKindBeingWritten: (
    kind: number,
    callback?: () => void,
  ) => void;

  countAvailableRecipientsTotal: number;
  countAvailableRecipientsWithEmail: number;
  countAvailableRecipientsWithPhone: number;

  // --- Member ---
  contextMember: Member;

  // --- Offer ---
  allMemberCategoryList: FilteringMemberIdsByGenericCategories;

  // --- Email Template ---
  emailTemplateDetailList: Record<number, EmailTemplateDetail>;
  emailTemplateSummaryList: EmailTemplateSummary[];
  loadingEmailTemplateSummaryList: boolean;
  loadingEmailTemplateDetailList: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  tagCategories: {
    [tag_name: string]: string[];
  };

  // --- Misc ---
  hideAutoResend?: boolean;
};

const InboxThreadSenderContainer: React.FC<Props> = ({
  thread,
  communicationKindBeingWritten,
  showMessageWriter,
  handleShowMessageWriter,
  fetchEmailSummaryList,
  fetchEmailDetail,
  fetchPaginatedAvailableRecipientMemberList,
  loadingRecipientsModalMemberList,
  paginatedMemberList,
  resetPaginatedAvailableRecipientMemberList,
  sendCommunication,
  setCommunicationKindBeingWritten,
  countAvailableRecipientsTotal,
  countAvailableRecipientsWithEmail,
  countAvailableRecipientsWithPhone,
  contextMember,
  allMemberCategoryList,
  emailTemplateDetailList,
  emailTemplateSummaryList,
  loadingEmailTemplateDetailList,
  loadingEmailTemplateSummaryList,
  resolvedGenericTags,
  tagCategories,
  contextSelected,
  hideAutoResend,
}) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();

  return (
    <div className={classes.sendMessageContainer}>
      {showMessageWriter ? (
        <ButtonBase
          disableRipple
          disableTouchRipple
          onClick={handleShowMessageWriter}
        >
          <KeyboardArrowDown className={classes.buttonIconClose} />
        </ButtonBase>
      ) : (
        <div className={classes.buttonMessageWriterContainer}>
          <ButtonBase
            disableRipple
            disableTouchRipple
            className={classes.buttonMessageWriter}
            onClick={handleShowMessageWriter}
          >
            <Send fontSize="small" />
            <Typography className={classes.buttonText} variant="subtitle1">
              {t('sendMessage.writeCommunication')}
            </Typography>
          </ButtonBase>
        </div>
      )}
      <Collapse in={showMessageWriter} timeout={500}>
        <CommunicationSendMessageContainer
          allMemberCategoryList={allMemberCategoryList}
          communicationKind={communicationKindBeingWritten}
          contextIdentifier={
            MAP_THREAD_KIND_TO_CONTEXT_IDENTIFIER[contextSelected]
          }
          countAvailableRecipientsTotal={countAvailableRecipientsTotal}
          countAvailableRecipientsWithEmail={countAvailableRecipientsWithEmail}
          countAvailableRecipientsWithPhone={countAvailableRecipientsWithPhone}
          directMember={
            thread.related_object_kind === ChatThreadKinds.Member &&
            contextMember
          }
          emailTemplateDetailList={emailTemplateDetailList}
          emailTemplateSummaryList={emailTemplateSummaryList}
          fetchEmailSummaryList={fetchEmailSummaryList}
          fetchPaginatedAvailableRecipientMemberList={
            fetchPaginatedAvailableRecipientMemberList
          }
          getEmailDetail={fetchEmailDetail}
          hideAutoResend={hideAutoResend}
          loadingPaginatedMemberList={loadingRecipientsModalMemberList}
          loadingTemplateDetailList={loadingEmailTemplateDetailList}
          loadingTemplateSummaryList={loadingEmailTemplateSummaryList}
          pageSize={PAGINATION_SIZE_RECIPIENTS}
          paginatedMemberList={paginatedMemberList}
          relatedObjectId={thread.related_object_id}
          relatedObjectKind={thread.related_object_kind}
          resetPaginatedAvailableRecipientMemberList={
            resetPaginatedAvailableRecipientMemberList
          }
          resolvedGenericTags={resolvedGenericTags}
          sendCommunication={sendCommunication}
          setCommunicationKind={setCommunicationKindBeingWritten}
          tagCategories={tagCategories}
        />
      </Collapse>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  sendMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonIconClose: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(-1.5),
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    color: theme.palette.background.default,
    backgroundColor: theme.palette.secondary.main,
  },
  buttonMessageWriterContainer: {
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(0.5),
    },
    color: theme.palette.grey[600],
  },
  buttonMessageWriter: {
    width: '100%',
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.spacing(3),
    borderColor: theme.palette.divider,
    borderWidth: '1px',
    borderStyle: 'solid',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  buttonText: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export default memo(InboxThreadSenderContainer);
