import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import type { OptionCallback } from '../../state/types';
import InboxThreadContainer from '#libs/communication-v2/thread/InboxThreadContainer/InboxThreadContainer.component';

import {
  needToFilterOutReceivedCommunicationSentWithActiveFilters,
  getOfferCategories,
} from '#libs/communication-v2/utils';
import type {
  Communication,
  InboxThreadRouterProps,
  MessageData,
  SelectFieldItem,
} from '#libs/communication-v2/types';
import {
  COMMUNICATION_FILTER_IDENTIFIER_KIND,
  COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT,
  COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER,
  COMMUNICATION_FILTER_IDENTIFIER_SRC_OR_DST,
  REFRESH_THREAD_TIMEOUT,
} from '#libs/communication-v2/constants';
import withInboxThreadData, {
  WithInboxThreadDataProps,
} from '#libs/communication-v2/thread/InboxThreadContainer/withInboxThread.hoc';

type Props = InboxThreadRouterProps & WithInboxThreadDataProps;

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
      this.props.inboxContainerState.dateStart?.unix() ?? null,
      this.props.inboxContainerState.dateEnd?.unix() ?? null,
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
    this.props.sendCommunication(data, memberSelectedCategories, {
      ...options,
      storeInCallback,
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
      sendCommunication,
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
        thread={thread}
        isThreadLoading={isThreadLoading}
        // --- Thread List ---
        count={count}
        contextSelected={contextSelected}
        // --- Header Actions ---
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        switchDisabledStatus={switchDisabledStatus}
        flagAsUnread={flagAsUnread}
        goToThreadListPage={goToThreadListPage}
        goToDetailPage={goToDetailPage}
        // --- Filtering ---
        filters={filters}
        filterDateStart={filterDateStart}
        filterDateEnd={filterDateEnd}
        kindFilterValues={kindFilterValues}
        kindFilterSetter={kindFilterSetter}
        recipientFilterValues={recipientFilterValues}
        recipientFilterSetter={recipientFilterSetter}
        sendParameterFilterValues={sendParameterFilterValues}
        sendParameterFilterSetter={sendParameterFilterSetter}
        srcOrDstFilterValues={srcOrDstFilterValues}
        srcOrDstFilterSetter={srcOrDstFilterSetter}
        dateStartValue={dateStart}
        dateStartSetter={dateStartSetter}
        dateEndValue={dateEnd}
        dateEndSetter={dateEndSetter}
        handleFiltersSubmit={this.handleFiltersSubmit}
        allPreviousFilter={allPreviousFilters}
        popKindFilterValue={this.popKindFilterValue}
        resetPeriodFilter={this.resetPeriodFilter}
        popRecipientFilterValue={this.popRecipientFilterValue}
        popSendParameterFilterValue={this.popSendParameterFilterValue}
        popSrcOrDstFilterValue={this.popSrcOrDstFilterValue}
        resetFilters={this.resetFilters}
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        onShowFilterModal={onShowFilterModal}
        // --- Message List ---
        messageList={messageList}
        currentPage={messagePage}
        fetchPageInformationRecipientList={fetchPageInformationRecipientList}
        fetchMoreCommunicationMessages={this.fetchMoreMessages}
        loadingCommunicationMessageDataList={loadingMessageList}
        loadingInformationRecipientList={loadingInformationRecipientList}
        scrollToBottomFlag={scrollMessagesToBottomFlag}
        recipientList={recipientList}
        recipientListCount={recipientListCount}
        // --- Member ---
        contextMember={contextMember}
        // --- Offer ---
        allMemberCategoryList={allMemberCategoryList}
        // --- Snackbar ---
        onCloseSnackbar={onCloseSnackbar}
        displaySnackbar={displaySnackbar}
        // --- Theme ---
        theme={theme}
        // --- Send Message ---
        showMessageWriter={showMessageWriter}
        handleShowMessageWriter={handleShowMessageWriter}
        communicationKindBeingWritten={communicationKindBeingWritten}
        countAvailableRecipientsTotal={countAvailableRecipientsTotal}
        countAvailableRecipientsWithEmail={countAvailableRecipientsWithEmail}
        countAvailableRecipientsWithPhone={countAvailableRecipientsWithPhone}
        fetchEmailSummaryList={fetchEmailSummaryList}
        fetchPaginatedAvailableRecipientMemberList={
          fetchPaginatedAvailableRecipientMemberList
        }
        fetchEmailDetail={fetchEmailDetail}
        loadingRecipientsModalMemberList={loadingRecipientsModalMemberList}
        paginatedMemberList={recipientsModalMemberList}
        sendCommunication={sendCommunication}
        setCommunicationKindBeingWritten={setCommunicationKindBeingWritten}
        resetPaginatedAvailableRecipientMemberList={
          resetPaginatedAvailableRecipientMemberList
        }
        // --- Email Templates ---
        emailTemplateDetailList={emailTemplateDetailList}
        emailTemplateSummaryList={emailTemplateSummaryList}
        loadingEmailTemplateSummaryList={loadingEmailTemplateSummaryList}
        loadingEmailTemplateDetailList={loadingEmailTemplateDetailList}
        resolvedGenericTags={resolvedGenericTags}
        tagCategories={tagCategories}
      />
    );
  }
}

export default compose<Props, InboxThreadRouterProps>(withInboxThreadData)(
  InboxThreadContainerPage,
);
