import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { connect, type ConnectedProps } from 'react-redux';
import InboxThreadContainer from '#src/libs/communication-v2/thread/InboxThreadContainer/InboxThreadContainer.component';

import {
  needToFilterOutReceivedCommunicationSentWithActiveFilters,
  getOfferCategories,
} from '#src/libs/communication-v2/utils';
import type {
  Communication,
  InboxThreadRouterProps,
  MessageData,
  SelectFieldItem,
} from '#src/libs/communication-v2/types';
import {
  COMMUNICATION_FILTER_IDENTIFIER_KIND,
  COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT,
  COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER,
  COMMUNICATION_FILTER_IDENTIFIER_SRC_OR_DST,
  REFRESH_THREAD_TIMEOUT,
  WRITE_EMAIL,
} from '#src/libs/communication-v2/constants';
import withInboxThreadData, {
  WithInboxThreadDataProps,
} from '#src/libs/communication-v2/thread/InboxThreadContainer/withInboxThread.hoc';
import { UPSELL_IDENTIFIER_INBOX } from '#src/libs/platform-billing/upsell-identifiers';

import { hasUpsell } from '#src/libs/platform-billing/utils';
import type { RootState } from '../../reducers';

import Config from '../../config';
import type { OptionCallback } from '../../state/types';

type Props = InboxThreadRouterProps &
  WithInboxThreadDataProps &
  ConnectedProps<typeof connector>;

class InboxThreadContainerPage extends PureComponent<Props> {
  componentDidMount() {
    const {
      thread,
      fetchPaginatedAvailableRecipientMemberList,
      fetchResolvedGenericTags,
      fetchTagList,
      flagAsReadAndUpdateUnreadCount,
    } = this.props;

    if (thread) {
      fetchPaginatedAvailableRecipientMemberList(1);
      flagAsReadAndUpdateUnreadCount();
      this.fetchMessageListAndScheduleRefresh();
    }

    fetchResolvedGenericTags();
    fetchTagList();
  }

  componentDidUpdate(prevProps: WithInboxThreadDataProps): void {
    const {
      thread,
      fetchPaginatedAvailableRecipientMemberList,
      flagAsReadAndUpdateUnreadCount,
      setInboxContainerState,
    } = this.props;

    const newThreadCalled = thread && prevProps.thread?.id !== thread.id;

    if (newThreadCalled) {
      fetchPaginatedAvailableRecipientMemberList(1);

      this.props.setInboxContainerState({
        ...this.props.inboxContainerState,
        messagePage: 1,
      });
      flagAsReadAndUpdateUnreadCount();
      this.fetchMessageListAndScheduleRefresh();
      this.fetchAdditionalThreadData();
      setInboxContainerState({
        ...this.props.inboxContainerState,
        communicationKindBeingWritten: WRITE_EMAIL,
        showMessageWriter: false,
      });
    }
  }

  componentWillUnmount(): void {
    const { timeoutId } = this.props.inboxContainerState;
    if (timeoutId) {
      // unschedule refresh
      clearTimeout(timeoutId);
    }
  }

  fetchAdditionalThreadData = () => {
    if (this.props.thread.related_object_kind === ChatThreadKinds.Offer) {
      this.props.fetchBookingsByOffer(this.props.thread.related_object_id);
      this.props.fetchBookingOptionByOffer(
        this.props.thread.related_object_id,
        { as_manager: true, offer: this.props.thread.related_object_id },
      );
    }
  };

  fetchMoreMessages = () => {
    const {
      messageListHasNextPage,
      setInboxContainerState,
      inboxContainerState,
      fetchPageMessageList,
    } = this.props;
    if (messageListHasNextPage) {
      setInboxContainerState(
        {
          ...this.props.inboxContainerState,
          messagePage: inboxContainerState.messagePage + 1,
        },
        fetchPageMessageList,
      );
    }
  };

  fetchMessageListAndScheduleRefresh = (isRefreshingThread?: boolean) => {
    this.props.fetchPageMessageList(isRefreshingThread, 1);
    // this.scheduleRefreshMessageList(isRefreshingThread);
  };

  refreshMessageList = () => {
    // This will fetch the last three communications (to speed up things)
    // With respect to the active filters
    this.fetchMessageListAndScheduleRefresh(true);
  };

  scheduleRefreshMessageList = (forceRefresh?: boolean) => {
    const { inboxContainerState, setInboxContainerState } = this.props;
    const { timeoutId } = inboxContainerState;
    if (!timeoutId || forceRefresh) {
      // clear previous timeout if it exists
      if (forceRefresh && timeoutId) {
        clearTimeout(timeoutId);
      }
      // schedule refresh of the thread
      const newTimeoutId = setTimeout(
        this.refreshMessageList,
        REFRESH_THREAD_TIMEOUT * 1000,
      );
      setInboxContainerState({
        ...inboxContainerState,
        timeoutId: newTimeoutId,
      });
    }
  };

  handleFilterChange = (
    filters: number[],
    dateStart: number | null,
    dateEnd: number | null,
  ) => {
    // the function will reset the message so we cancel the current automatic refresh
    const { inboxContainerState, setInboxContainerState } = this.props;

    clearTimeout(inboxContainerState.timeoutId);
    setInboxContainerState(
      {
        ...inboxContainerState,
        messagePage: 1,
        filters,
        filterDateStart: dateStart,
        filterDateEnd: dateEnd,
        timeoutId: null,
      },
      this.fetchMessageListAndScheduleRefresh, // and we schedule a new refresh
    );
  };

  handleFiltersSubmit = () => {
    const filtersNumbers = this.props.joinAllFilters();

    this.handleFilterChange(
      filtersNumbers,
      this.props.inboxContainerState.dateStart?.toUnixInteger() ?? null,
      this.props.inboxContainerState.dateEnd?.toUnixInteger() ?? null,
    );
  };

  resetFilters = () => {
    this.props.setInboxContainerState(
      {
        ...this.props.inboxContainerState,
        kindFilterValues: [],
        recipientFilterValues: [],
        sendParameterFilterValues: [],
        srcOrDstFilterValues: [],
        dateStart: null,
        dateEnd: null,
      },
      this.handleFiltersSubmit,
    );
  };

  resetPeriodFilter = () => {
    this.props.setInboxContainerState(
      {
        ...this.props.inboxContainerState,
        dateStart: null,
        dateEnd: null,
      },
      this.handleFiltersSubmit,
    );
  };

  popFilterValue = (filterIdentifier: number, index: number) => {
    let newFilterValues: SelectFieldItem[];
    switch (filterIdentifier) {
      case COMMUNICATION_FILTER_IDENTIFIER_KIND:
        newFilterValues = [
          ...this.props.inboxContainerState.kindFilterValues,
        ].splice(index, 1);

        this.props.setInboxContainerState(
          {
            ...this.props.inboxContainerState,
            kindFilterValues: newFilterValues,
          },
          this.handleFiltersSubmit,
        );

        break;

      case COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT:
        newFilterValues = [
          ...this.props.inboxContainerState.recipientFilterValues,
        ].splice(index, 1);

        this.props.setInboxContainerState(
          {
            ...this.props.inboxContainerState,
            recipientFilterValues: newFilterValues,
          },
          this.handleFiltersSubmit,
        );

        break;

      case COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER:
        newFilterValues = [
          ...this.props.inboxContainerState.sendParameterFilterValues,
        ].splice(index, 1);

        this.props.setInboxContainerState(
          {
            ...this.props.inboxContainerState,
            sendParameterFilterValues: newFilterValues,
          },
          this.handleFiltersSubmit,
        );

        break;

      case COMMUNICATION_FILTER_IDENTIFIER_SRC_OR_DST:
        newFilterValues = [
          ...this.props.inboxContainerState.srcOrDstFilterValues,
        ].splice(index, 1);

        this.props.setInboxContainerState(
          {
            ...this.props.inboxContainerState,
            sendParameterFilterValues: newFilterValues,
          },
          this.handleFiltersSubmit,
        );

        break;

      default:
    }
  };

  popKindFilterValue = (index: number) => {
    this.popFilterValue(COMMUNICATION_FILTER_IDENTIFIER_KIND, index);
  };

  popRecipientFilterValue = (index: number) => {
    this.popFilterValue(COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT, index);
  };

  popSendParameterFilterValue = (index: number) => {
    this.popFilterValue(COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER, index);
  };

  popSrcOrDstFilterValue = (index: number) => {
    this.popFilterValue(COMMUNICATION_FILTER_IDENTIFIER_SRC_OR_DST, index);
  };

  sendCommunication = (
    data: MessageData,
    memberSelectedCategories: number[],
    options: OptionCallback<void>,
  ) => {
    const storeInCallback = (communicationResponse: Communication) => {
      const filters = {
        numberFilters: this.props.inboxContainerState.filters,
        dateStartFilter: this.props.inboxContainerState.filterDateStart,
        dateEndFilter: this.props.inboxContainerState.filterDateEnd,
      };
      const filterOutNewCommunication =
        needToFilterOutReceivedCommunicationSentWithActiveFilters(
          communicationResponse,
          filters,
        );
      if (filterOutNewCommunication) {
        this.props.setInboxContainerState({
          ...this.props.inboxContainerState,
          displaySnackbar: true,
        });
      } else {
        // By changing the following value, we force the thread to scroll to bottom
        this.props.setInboxContainerState({
          ...this.props.inboxContainerState,
          scrollMessagesToBottomFlag: true,
        });
      }
      return filterOutNewCommunication;
    };
    if (
      Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
      !hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_INBOX)
    )
      return;

    this.props.sendCommunication(data, memberSelectedCategories, {
      storeInCallback,
      onSuccess: (...args) => {
        this.props.fetchInboxThreadFromId(this.props.thread.id);
        if (options?.onSuccess) options.onSuccess(...args);
      },
      onError: options?.onError,
    });
  };

  render() {
    const {
      // --- Global ---
      t,
      // --- Current Thread ---
      thread,
      isThreadLoading,
      // --- Inbox Thread List ---
      count,
      contextSelected,
      // --- Member ---
      contextMember,
      // --- Message List ---
      fetchPageInformationRecipientList,
      loadingMessageList,
      recipientList,
      recipientListCount,
      loadingInformationRecipientList,
      messageList,
      // --- Send Message ---
      countAvailableRecipientsTotal,
      countAvailableRecipientsWithEmail,
      countAvailableRecipientsWithPhone,
      handleShowMessageWriter,
      fetchEmailDetail,
      fetchEmailSummaryList,
      fetchPaginatedAvailableRecipientMemberList,
      resetPaginatedAvailableRecipientMemberList,
      loadingRecipientsModalMemberList,
      recipientsModalMemberList,
      setCommunicationKindBeingWritten,
      // --- Email Templates ---
      emailTemplateDetailList,
      emailTemplateSummaryList,
      loadingEmailTemplateDetailList,
      loadingEmailTemplateSummaryList,
      resolvedGenericTags,
      tagCategories,
      // --- Theme ---
      theme,
      // --- SnackBar ---
      onCloseSnackbar,
      // --- Header Actions ---
      switchFavoriteStatus,
      switchMutedStatus,
      switchDisabledStatus,
      flagAsUnread,
      goToThreadListPage,
      goToDetailPage,
      // --- Filtering ---
      onShowFilterModal,
      kindFilterSetter,
      recipientFilterSetter,
      sendParameterFilterSetter,
      srcOrDstFilterSetter,
      dateStartSetter,
      dateEndSetter,
      setShowFilterModal,
      // --- Offer
      bookings,
      bookingOptionsPending,
      // --- State ---
      inboxContainerState,
    } = this.props;

    const {
      // --- Message List ---
      messagePage,
      scrollMessagesToBottomFlag,
      // --- Send Message ---
      communicationKindBeingWritten,
      showMessageWriter,
      // --- Snackbar ---
      displaySnackbar,
      // --- Filtering ---
      filters,
      filterDateStart,
      filterDateEnd,
      kindFilterValues,
      recipientFilterValues,
      sendParameterFilterValues,
      srcOrDstFilterValues,
      dateStart,
      dateEnd,
      allPreviousFilters,
      showFilterModal,
    } = inboxContainerState;

    const allMemberCategoryList = getOfferCategories(
      t,
      bookings,
      bookingOptionsPending,
    );

    return (
      <InboxThreadContainer
        // --- Inbox Thread ---
        allMemberCategoryList={allMemberCategoryList}
        allPreviousFilter={allPreviousFilters}
        // --- Thread List ---
        communicationKindBeingWritten={communicationKindBeingWritten}
        contextMember={contextMember}
        // --- Header Actions ---
        contextSelected={contextSelected}
// @ts-expect-error
        count={count}
        countAvailableRecipientsTotal={countAvailableRecipientsTotal}
        countAvailableRecipientsWithEmail={countAvailableRecipientsWithEmail}
        countAvailableRecipientsWithPhone={countAvailableRecipientsWithPhone}
        currentPage={messagePage}
        // --- Filtering ---
        dateEndSetter={dateEndSetter}
        dateEndValue={dateEnd}
        dateStartSetter={dateStartSetter}
        dateStartValue={dateStart}
        displaySnackbar={displaySnackbar}
        emailTemplateDetailList={emailTemplateDetailList}
        emailTemplateSummaryList={emailTemplateSummaryList}
        fetchEmailDetail={fetchEmailDetail}
        fetchEmailSummaryList={fetchEmailSummaryList}
        fetchMoreCommunicationMessages={this.fetchMoreMessages}
        fetchPageInformationRecipientList={fetchPageInformationRecipientList}
        fetchPaginatedAvailableRecipientMemberList={
          fetchPaginatedAvailableRecipientMemberList
        }
        filterDateEnd={filterDateEnd}
        filterDateStart={filterDateStart}
        filters={filters}
        flagAsUnread={flagAsUnread}
        goToDetailPage={goToDetailPage}
        goToThreadListPage={goToThreadListPage}
        handleFiltersSubmit={this.handleFiltersSubmit}
        handleShowMessageWriter={handleShowMessageWriter}
        isThreadLoading={isThreadLoading}
        kindFilterSetter={kindFilterSetter}
        kindFilterValues={kindFilterValues}
        loadingCommunicationMessageDataList={loadingMessageList}
        loadingEmailTemplateDetailList={loadingEmailTemplateDetailList}
        loadingEmailTemplateSummaryList={loadingEmailTemplateSummaryList}
        // --- Message List ---
        loadingInformationRecipientList={loadingInformationRecipientList}
        loadingRecipientsModalMemberList={loadingRecipientsModalMemberList}
        messageList={messageList}
        onCloseSnackbar={onCloseSnackbar}
        onShowFilterModal={onShowFilterModal}
        paginatedMemberList={recipientsModalMemberList}
        popKindFilterValue={this.popKindFilterValue}
        popRecipientFilterValue={this.popRecipientFilterValue}
        popSendParameterFilterValue={this.popSendParameterFilterValue}
        // --- Member ---
        popSrcOrDstFilterValue={this.popSrcOrDstFilterValue}
        // --- Offer ---
        recipientFilterSetter={recipientFilterSetter}
        // --- Snackbar ---
        recipientFilterValues={recipientFilterValues}
        recipientList={recipientList}
        // --- Theme ---
        recipientListCount={recipientListCount}
        // --- Send Message ---
        resetFilters={this.resetFilters}
        resetPaginatedAvailableRecipientMemberList={
          resetPaginatedAvailableRecipientMemberList
        }
        resetPeriodFilter={this.resetPeriodFilter}
        resolvedGenericTags={resolvedGenericTags}
        scrollToBottomFlag={scrollMessagesToBottomFlag}
        sendCommunication={this.sendCommunication}
        sendParameterFilterSetter={sendParameterFilterSetter}
        sendParameterFilterValues={sendParameterFilterValues}
        setCommunicationKindBeingWritten={setCommunicationKindBeingWritten}
        setShowFilterModal={setShowFilterModal}
        showFilterModal={showFilterModal}
        showMessageWriter={showMessageWriter}
        srcOrDstFilterSetter={srcOrDstFilterSetter}
        srcOrDstFilterValues={srcOrDstFilterValues}
        // --- Email Templates ---
        switchDisabledStatus={switchDisabledStatus}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        tagCategories={tagCategories}
        theme={theme}
        thread={thread}
      />
    );
  }
}

const connector = connect((state: RootState) => ({
  featureList: state.company.feature.data,
}));

export default compose<Props, InboxThreadRouterProps>(
  withInboxThreadData,
  connector,
)(InboxThreadContainerPage);
