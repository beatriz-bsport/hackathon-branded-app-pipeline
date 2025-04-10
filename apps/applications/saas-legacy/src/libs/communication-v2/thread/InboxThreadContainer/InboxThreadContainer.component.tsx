import React, { memo } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import type { DateTime } from 'luxon';
import type { CallHistoryMethodAction } from 'connected-react-router';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import { useTranslation } from 'react-i18next';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
} from '@bsport/common/lib/master-data/communication-kind.js';
import InboxThreadContainerHeader from '#src/libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadContainerHeader.component';
import CommunicationMessageListContainer from '#src/libs/communication-v2/components/MessageList/CommunicationMessageListContainer.component';
import type {
  Communication,
  CommunicationThread,
  FilteringMemberIdsByGenericCategories,
  Recipient,
  SelectFieldItem,
  MessageData,
} from '#src/libs/communication-v2/types';
import type { Member } from '#src/libs/member/types';
import {
  CONTEXT_MEMBER,
  CONTEXT_OFFER,
  CONTEXT_SMARTLIST,
  PAGINATION_SIZE_RECIPIENTS,
} from '#src/libs/communication-v2/constants';
import type { ResolvedGenericTags } from '#src/libs/email-editor/types';
import type { Theme } from '#src/libs/theme/types';
import InboxNoThread from '#src/libs/communication-v2/thread/InboxThreadContainer/InboxNoThread.component';
import InboxThreadSenderContainer from '#src/libs/communication-v2/thread/InboxThreadContainer/InboxThreadSenderContainer.component';
import type { OptionCallback } from '#src/state/types';
import { getCommunicationSMSProviderVerificationState } from '#src/libs/communication-v2/selectors';
import type { RootState } from '#src/reducers';
import { CommunicationContextProvider } from '#src/libs/communication-v2/context/CommunicationDrawer.context';

export type Props = {
  // --- Inbox Thread ---
  thread?: CommunicationThread;
  isThreadLoading: boolean;

  // --- Thread List ---
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
  communicationKinds?: SelectFieldItem[];
  setCommunicationKind?: (args: SelectFieldItem[]) => void;

  recipientTypes?: SelectFieldItem[];
  setRecipientTypes?: (args: SelectFieldItem[]) => void;

  automatedMessages?: SelectFieldItem[];
  setAutomatedMessages?: (args: SelectFieldItem[]) => void;

  messagesOrigin?: SelectFieldItem[];
  setMessagesOrigin?: (args: SelectFieldItem[]) => void;

  dateStart?: DateTime;
  setDateStart?: (newDate: DateTime) => void;
  dateEnd?: DateTime;
  setDateEnd?: (newDate: DateTime) => void;

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
  communicationMember: Member;

  // --- Offer ---
  allMemberCategoryList: FilteringMemberIdsByGenericCategories;

  // --- MessageList ---
  currentPage: number;
  recipientList: Recipient<Member>[];
  recipientListCount: number;
  scrollToBottomFlag: boolean;
  fetchMoreCommunicationMessages: () => void;

  // --- Send Message ---
  communicationKindBeingWritten: number;
  showMessageWriter: boolean;
  handleShowMessageWriter: () => void;

  sendCommunication: (
    data: MessageData,
    memberSelectedCategories: number[],
    option: OptionCallback<void> & {
      storeInCallback: (communication: Communication) => boolean;
    },
  ) => void;
  // --- Theme ---
  theme: Theme;

  // --- Email Template ---
  resolvedGenericTags: ResolvedGenericTags;
};

const InboxThreadContainer: React.FC<
  Props & ConnectedProps<typeof connector>
> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('communication');
  const { communicationMember } = props;

  const hasActiveFilters =
    !!props.filterDateEnd || !!props.filterDateStart || !!props.filters.length;

  const showMailProviderWarningContent =
    props.showMessageWriter &&
    props.communicationKindBeingWritten === COMMUNICATION_KIND_EMAIL &&
    !props.theme.is_two_way_email_activated;

  const showCommunicationSmsProviderNotVerifiedWarning =
    !props.communicationSMSProviderVerificationState.isVerified &&
    props.communicationKindBeingWritten === COMMUNICATION_KIND_SMS;

  const getContextIdentifier = React.useCallback(() => {
    switch (props.contextSelected) {
      case ChatThreadKinds.Offer:
        return CONTEXT_OFFER;
      case ChatThreadKinds.Member:
        return CONTEXT_MEMBER;
      case ChatThreadKinds.Smartlist:
        return CONTEXT_SMARTLIST;
      default:
        return 0;
    }
  }, [props.contextSelected]);

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
              <CommunicationContextProvider
                initialValues={{
                  communicationIdentifier: getContextIdentifier(),
                  communicationMember: communicationMember,
                  communicationTitle: props.thread.title,
                  communicationObjectId: props.thread.related_object_id,
                  allMemberCategoryList: props.allMemberCategoryList,
                  fullScreen: false,
                  onDrawerClose: () => {},
                  openDrawer: false,
                }}
              >
                <InboxThreadContainerHeader
                  allPreviousFilter={props.allPreviousFilter}
                  automatedMessages={props.automatedMessages}
                  communicationKinds={props.communicationKinds}
                  dateEnd={props.dateEnd}
                  dateStart={props.dateStart}
                  flagAsUnread={props.flagAsUnread}
                  goToDetailPage={props.goToDetailPage}
                  goToThreadListPage={props.goToThreadListPage}
                  handleFiltersSubmit={props.handleFiltersSubmit}
                  messagesOrigin={props.messagesOrigin}
                  onShowFilterModal={props.onShowFilterModal}
                  popKindFilterValue={props.popKindFilterValue}
                  popRecipientFilterValue={props.popRecipientFilterValue}
                  popSendParameterFilterValue={
                    props.popSendParameterFilterValue
                  }
                  popSrcOrDstFilterValue={props.popSrcOrDstFilterValue}
                  recipientTypes={props.recipientTypes}
                  resetFilters={props.resetFilters}
                  resetPeriodFilter={props.resetPeriodFilter}
                  setAutomatedMessages={props.setAutomatedMessages}
                  setCommunicationKind={props.setCommunicationKind}
                  setDateEnd={props.setDateEnd}
                  setDateStart={props.setDateStart}
                  setMessagesOrigin={props.setMessagesOrigin}
                  setRecipientTypes={props.setRecipientTypes}
                  setShowFilterModal={props.setShowFilterModal}
                  showFilterModal={props.showFilterModal}
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
                    currentPage={props.currentPage}
                    fetchMoreCommunicationMessages={
                      props.fetchMoreCommunicationMessages
                    }
                    hasActiveFilters={hasActiveFilters}
                    //@ts-expect-error
                    onCloseSnackbar={props.onCloseSnackbar}
                    openSnackbar={props.displaySnackbar}
                    paginationSize={PAGINATION_SIZE_RECIPIENTS}
                    recipientList={props.recipientList}
                    recipientListCount={props.recipientListCount}
                    resolvedGenericTags={props.resolvedGenericTags}
                    scrollToBottomFlag={props.scrollToBottomFlag}
                    showCommunicationSmsProviderNotVerifiedWarning={
                      showCommunicationSmsProviderNotVerifiedWarning
                    }
                    showMailProviderWarningContent={
                      showMailProviderWarningContent
                    }
                  />
                </div>
                <InboxThreadSenderContainer
                  communicationMember={props.communicationMember}
                  handleShowMessageWriter={props.handleShowMessageWriter}
                  sendCommunication={props.sendCommunication}
                  showMessageWriter={props.showMessageWriter}
                  thread={props.thread}
                />
              </CommunicationContextProvider>
            </>
          )}
        </>
      )}
    </>
  );
};

const connector = connect(
  (state: RootState) => ({
    communicationSMSProviderVerificationState:
      getCommunicationSMSProviderVerificationState(state),
  }),
  null,
);
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

export default memo(connector(InboxThreadContainer));
