import React, { memo } from 'react';

import type { DateTime } from 'luxon';
import type { CallHistoryMethodAction } from 'connected-react-router';
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
import type { OptionCallback } from '../../../../state/types';
import Config from '../../../../config';

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
  goToDetailPage?: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
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

  dateStartValue?: DateTime;
  dateStartSetter?: (newDate: DateTime) => void;
  dateEndValue?: DateTime;
  dateEndSetter?: (newDate: DateTime) => void;

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

  const hideAutoResend =
    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
    props.theme.company !== 498;

  return (
    <>
      {props.isThreadLoading ? (
        <div className={classes.loadingThread}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          {!props.thread ? (
            <InboxNoThread />
          ) : (
            <>
              <InboxThreadContainerHeader
                allPreviousFilter={props.allPreviousFilter}
                dateEndSetter={props.dateEndSetter}
                dateEndValue={props.dateEndValue}
                dateStartSetter={props.dateStartSetter}
                dateStartValue={props.dateStartValue}
                flagAsUnread={props.flagAsUnread}
                goToDetailPage={props.goToDetailPage}
                goToThreadListPage={props.goToThreadListPage}
                handleFiltersSubmit={props.handleFiltersSubmit}
                kindFilterSetter={props.kindFilterSetter}
                kindFilterValues={props.kindFilterValues}
                onShowFilterModal={props.onShowFilterModal}
                popKindFilterValue={props.popKindFilterValue}
                popRecipientFilterValue={props.popRecipientFilterValue}
                popSendParameterFilterValue={props.popSendParameterFilterValue}
                popSrcOrDstFilterValue={props.popSrcOrDstFilterValue}
                recipientFilterSetter={props.recipientFilterSetter}
                recipientFilterValues={props.recipientFilterValues}
                resetFilters={props.resetFilters}
                resetPeriodFilter={props.resetPeriodFilter}
                sendParameterFilterSetter={props.sendParameterFilterSetter}
                sendParameterFilterValues={props.sendParameterFilterValues}
                setShowFilterModal={props.setShowFilterModal}
                showFilterModal={props.showFilterModal}
                srcOrDstFilterSetter={props.srcOrDstFilterSetter}
                srcOrDstFilterValues={props.srcOrDstFilterValues}
                switchDisabledStatus={props.switchDisabledStatus}
                switchFavoriteStatus={props.switchFavoriteStatus}
                switchMutedStatus={props.switchMutedStatus}
                thread={props.thread}
              />

              <div className={classes.threadContainer}>
                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  autoHideDuration={5000}
                  className={classes.snackbar}
                  onClose={props.onCloseSnackbar}
                  open={props.displaySnackbar}
                >
                  <Alert className={classes.snackbarContent} severity="info">
                    {t('messageList.filterOutCommunicationSent')}
                  </Alert>
                </Snackbar>
                <CommunicationMessageListContainer
                  allMemberCategoryList={props.allMemberCategoryList}
                  consentWarning={consentWarning}
                  contextMember={props.contextMember}
                  currentPage={props.currentPage}
                  fetchMoreCommunicationMessages={
                    props.fetchMoreCommunicationMessages
                  }
                  fetchRecipientPaginatedList={
                    props.fetchPageInformationRecipientList
                  }
                  hasActiveFilters={hasActiveFilters}
                  loadingCommunicationMessageDataList={
                    props.loadingCommunicationMessageDataList
                  }
                  loadingRecipientList={props.loadingInformationRecipientList}
                  messageList={props.messageList}
                  onCloseSnackbar={props.onCloseSnackbar}
                  openSnackbar={props.displaySnackbar}
                  paginationSize={PAGINATION_SIZE_RECIPIENTS}
                  recipientList={props.recipientList}
                  recipientListCount={props.recipientListCount}
                  resolvedGenericTags={props.resolvedGenericTags}
                  scrollToBottomFlag={props.scrollToBottomFlag}
                  showMailProviderWarningContent={
                    showMailProviderWarningContent
                  }
                />
              </div>
              <InboxThreadSenderContainer
                allMemberCategoryList={props.allMemberCategoryList}
                communicationKindBeingWritten={
                  props.communicationKindBeingWritten
                }
                contextMember={props.contextMember}
                contextSelected={props.contextSelected}
                countAvailableRecipientsTotal={
                  props.countAvailableRecipientsTotal
                }
                countAvailableRecipientsWithEmail={
                  props.countAvailableRecipientsWithEmail
                }
                countAvailableRecipientsWithPhone={
                  props.countAvailableRecipientsWithPhone
                }
                emailTemplateDetailList={props.emailTemplateDetailList}
                emailTemplateSummaryList={props.emailTemplateSummaryList}
                fetchEmailDetail={props.fetchEmailDetail}
                fetchEmailSummaryList={props.fetchEmailSummaryList}
                fetchPaginatedAvailableRecipientMemberList={
                  props.fetchPaginatedAvailableRecipientMemberList
                }
                handleShowMessageWriter={props.handleShowMessageWriter}
                hideAutoResend={hideAutoResend}
                loadingEmailTemplateDetailList={
                  props.loadingEmailTemplateDetailList
                }
                loadingEmailTemplateSummaryList={
                  props.loadingEmailTemplateSummaryList
                }
                loadingRecipientsModalMemberList={
                  props.loadingRecipientsModalMemberList
                }
                paginatedMemberList={props.paginatedMemberList}
                resetPaginatedAvailableRecipientMemberList={
                  props.resetPaginatedAvailableRecipientMemberList
                }
                resolvedGenericTags={props.resolvedGenericTags}
                sendCommunication={props.sendCommunication}
                setCommunicationKindBeingWritten={
                  props.setCommunicationKindBeingWritten
                }
                showMessageWriter={props.showMessageWriter}
                tagCategories={props.tagCategories}
                thread={props.thread}
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
