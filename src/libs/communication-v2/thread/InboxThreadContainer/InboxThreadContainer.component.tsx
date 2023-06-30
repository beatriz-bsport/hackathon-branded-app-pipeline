import React, { memo } from 'react';

import type { Moment as MomentType } from 'moment-timezone';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { useTranslation } from 'react-i18next';
import { COMMUNICATION_KIND_EMAIL } from '@bsport/common/lib/master-data/communication-kind';
import InboxThreadContainerHeader from '#libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadContainerHeader.component';
import CommunicationMessageListContainer from '#libs/communication-v2/components/MessageList/CommunicationMessageListContainer.component';
import type {
  Communication,
  CommunicationThread,
  FilteringMemberIdsByGenericCategories,
  Recipient,
  SelectFieldItem,
  CommunicationMessage,
  MessageData,
} from '#libs/communication-v2/types';
import type { OptionCallback } from '../../../../state/types';
import { getConsentWarning } from '#libs/communication-v2/utils';
import type { Member } from '#libs/member/types';
import { PAGINATION_SIZE_RECIPIENTS } from '#libs/communication-v2/constants';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';
import type { Theme } from '#libs/theme/types';
import InboxNoThread from '#libs/communication-v2/thread/InboxThreadContainer/InboxNoThread.component';
import InboxThreadSenderContainer from '#libs/communication-v2/thread/InboxThreadContainer/InboxThreadSenderContainer.component';

export type Props = {
  // --- Inbox Thread ---
  thread?: CommunicationThread;
  isThreadLoading: boolean;

  // --- Thread List ---
  count: number;
  contextSelected?: ChatThreadKinds;

  // --- Header Actions ---
  switchFavoriteStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  switchMutedStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  switchDisabledStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  flagAsUnread: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  goToDetailPage?: () => void;
  goToThreadListPage: () => void;

  // --- Filtering ---
  kindFilterValues?: SelectFieldItem[];
  kindFilterSetter?: (args: SelectFieldItem[]) => void;

  recipientFilterValues?: SelectFieldItem[];
  recipientFilterSetter?: (args: SelectFieldItem[]) => void;

  sendParameterFilterValues?: SelectFieldItem[];
  sendParameterFilterSetter?: (args: SelectFieldItem[]) => void;

  srcOrDstFilterValues?: SelectFieldItem[];
  srcOrDstFilterSetter?: (args: SelectFieldItem[]) => void;

  dateStartValue?: MomentType;
  dateStartSetter?: (newDate: MomentType) => void;
  dateEndValue?: MomentType;
  dateEndSetter?: (newDate: MomentType) => void;

  filterDateStart: number;
  filterDateEnd: number;
  filters: number[];

  handleFiltersSubmit: () => void;
  allPreviousFilter: {
    filters: number[];
    dateStart: number;
    dateEnd: number;
  };

  popKindFilterValue: (index: number) => void;
  resetPeriodFilter: () => void;
  popRecipientFilterValue: (index: number) => void;
  popSendParameterFilterValue: (index: number) => void;
  popSrcOrDstFilterValue: (index: number) => void;
  resetFilters: () => void;

  showFilterModal: boolean;
  setShowFilterModal: (show: boolean, options?: () => void) => void;
  onShowFilterModal: () => void;

  // --- Snackbar ---
  displaySnackbar: boolean;
  onCloseSnackbar: () => void;

  // --- Member ---
  contextMember: Member;

  // --- Offer ---
  allMemberCategoryList: FilteringMemberIdsByGenericCategories;

  // --- MessageList ---
  messageList: CommunicationMessage[];
  currentPage: number;
  recipientList: Recipient<Member>[];
  recipientListCount: number;
  scrollToBottomFlag: boolean;
  fetchMoreCommunicationMessages: () => void;
  loadingCommunicationMessageDataList: boolean;
  loadingInformationRecipientList: boolean;
  fetchPageInformationRecipientList: (
    communication: Communication,
    page: number,
    memberSelectedCategories: number[],
  ) => void;

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
    option: OptionCallback<void> & {
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

  // --- Theme ---
  theme: Theme;

  // --- Email Template ---
  emailTemplateDetailList: Record<number, EmailTemplateDetail>;
  emailTemplateSummaryList: EmailTemplateSummary[];
  loadingEmailTemplateSummaryList: boolean;
  loadingEmailTemplateDetailList: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  tagCategories: {
    [tag_name: string]: string[];
  };
};

const InboxThreadContainer: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('communication');

  const consentWarning =
    props.contextMember &&
    getConsentWarning(
      props.contextMember,
      props.communicationKindBeingWritten,
      t,
    );

  const hasActiveFilters =
    !!props.filterDateEnd || !!props.filterDateStart || !!props.filters.length;

  const showMailProviderWarningContent =
    props.showMessageWriter &&
    props.communicationKindBeingWritten === COMMUNICATION_KIND_EMAIL &&
    !props.theme.is_two_way_email_activated;

  return (
    <>
      {props.isThreadLoading ? (
        <div className={classes.loadingThread}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          {!props.thread ? (
            <InboxNoThread
              count={props.count}
              contextSelected={props.contextSelected}
            />
          ) : (
            <>
              <InboxThreadContainerHeader
                thread={props.thread}
                switchFavoriteStatus={props.switchFavoriteStatus}
                switchMutedStatus={props.switchMutedStatus}
                switchDisabledStatus={props.switchDisabledStatus}
                flagAsUnread={props.flagAsUnread}
                goToDetailPage={props.goToDetailPage}
                goToThreadListPage={props.goToThreadListPage}
                kindFilterValues={props.kindFilterValues}
                kindFilterSetter={props.kindFilterSetter}
                recipientFilterValues={props.recipientFilterValues}
                recipientFilterSetter={props.recipientFilterSetter}
                sendParameterFilterValues={props.sendParameterFilterValues}
                sendParameterFilterSetter={props.sendParameterFilterSetter}
                srcOrDstFilterValues={props.srcOrDstFilterValues}
                srcOrDstFilterSetter={props.srcOrDstFilterSetter}
                dateStartValue={props.dateStartValue}
                dateStartSetter={props.dateStartSetter}
                dateEndValue={props.dateEndValue}
                dateEndSetter={props.dateEndSetter}
                handleFiltersSubmit={props.handleFiltersSubmit}
                allPreviousFilter={props.allPreviousFilter}
                showFilterModal={props.showFilterModal}
                setShowFilterModal={props.setShowFilterModal}
                onShowFilterModal={props.onShowFilterModal}
                popKindFilterValue={props.popKindFilterValue}
                resetPeriodFilter={props.resetPeriodFilter}
                popRecipientFilterValue={props.popRecipientFilterValue}
                popSendParameterFilterValue={props.popSendParameterFilterValue}
                popSrcOrDstFilterValue={props.popSrcOrDstFilterValue}
                resetFilters={props.resetFilters}
              />

              <div className={classes.threadContainer}>
                <Snackbar
                  open={props.displaySnackbar}
                  onClose={props.onCloseSnackbar}
                  autoHideDuration={5000}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  className={classes.snackbar}
                >
                  <Alert severity="info" className={classes.snackbarContent}>
                    {t('messageList.filterOutCommunicationSent')}
                  </Alert>
                </Snackbar>
                <CommunicationMessageListContainer
                  currentPage={props.currentPage}
                  fetchRecipientPaginatedList={
                    props.fetchPageInformationRecipientList
                  }
                  fetchMoreCommunicationMessages={
                    props.fetchMoreCommunicationMessages
                  }
                  contextMember={props.contextMember}
                  loadingCommunicationMessageDataList={
                    props.loadingCommunicationMessageDataList
                  }
                  loadingRecipientList={props.loadingInformationRecipientList}
                  onCloseSnackbar={props.onCloseSnackbar}
                  openSnackbar={props.displaySnackbar}
                  paginationSize={PAGINATION_SIZE_RECIPIENTS}
                  recipientList={props.recipientList}
                  recipientListCount={props.recipientListCount}
                  messageList={props.messageList}
                  resolvedGenericTags={props.resolvedGenericTags}
                  scrollToBottomFlag={props.scrollToBottomFlag}
                  hasActiveFilters={hasActiveFilters}
                  showMailProviderWarningContent={
                    showMailProviderWarningContent
                  }
                  consentWarning={consentWarning}
                />
              </div>
              <InboxThreadSenderContainer
                thread={props.thread}
                communicationKindBeingWritten={
                  props.communicationKindBeingWritten
                }
                showMessageWriter={props.showMessageWriter}
                handleShowMessageWriter={props.handleShowMessageWriter}
                fetchEmailSummaryList={props.fetchEmailSummaryList}
                fetchEmailDetail={props.fetchEmailDetail}
                fetchPaginatedAvailableRecipientMemberList={
                  props.fetchPaginatedAvailableRecipientMemberList
                }
                loadingRecipientsModalMemberList={
                  props.loadingRecipientsModalMemberList
                }
                paginatedMemberList={props.paginatedMemberList}
                resetPaginatedAvailableRecipientMemberList={
                  props.resetPaginatedAvailableRecipientMemberList
                }
                sendCommunication={props.sendCommunication}
                setCommunicationKindBeingWritten={
                  props.setCommunicationKindBeingWritten
                }
                countAvailableRecipientsTotal={
                  props.countAvailableRecipientsTotal
                }
                countAvailableRecipientsWithEmail={
                  props.countAvailableRecipientsWithEmail
                }
                countAvailableRecipientsWithPhone={
                  props.countAvailableRecipientsWithPhone
                }
                contextMember={props.contextMember}
                allMemberCategoryList={props.allMemberCategoryList}
                emailTemplateDetailList={props.emailTemplateDetailList}
                emailTemplateSummaryList={props.emailTemplateSummaryList}
                loadingEmailTemplateDetailList={
                  props.loadingEmailTemplateDetailList
                }
                loadingEmailTemplateSummaryList={
                  props.loadingEmailTemplateSummaryList
                }
                resolvedGenericTags={props.resolvedGenericTags}
                tagCategories={props.tagCategories}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  loadingThread: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  snackbar: {
    position: 'absolute',
    top: theme.spacing(1),
    width: 'fit-content',
  },
  snackbarContent: {
    boxShadow: '1px 2px 15px lightblue',
  },
  threadContainer: {
    position: 'relative',
    display: 'flex',
    flex: 1,
  },
}));

export default memo(InboxThreadContainer);
