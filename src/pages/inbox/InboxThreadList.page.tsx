// @ts-nocheck
import React, { PureComponent } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { compose, withHandlers, withState } from 'recompose';
import { RootState } from '../../reducers';
import InboxThreadList from '#libs/communication-v2/thread/InboxThreadList';
import {
  getInboxThreadsWithUnreadAnswersCount,
  getThreadsPaginationResults,
} from '#libs/communication-v2/selectors';
import {
  switchFavoriteStatus as switchFavoriteStatusAction,
  switchMutedStatus as switchMutedStatusAction,
  switchDisabledStatus as switchDisabledStatusAction,
  flagAsUnread as flagAsUnreadAction,
  flagAsRead as flagAsReadAction,
  fetchInboxThreadList as fetchInboxThreadListAction,
  fetchBatchUnreadAnswersCounts as fetchUnreadAnswersCountsAction,
  getUnreadAnswersCountFromThread as getUnreadAnswersCountFromThreadAction,
} from '#libs/communication-v2/actions';
import {
  threadFilteringChoices,
  isThreadDisplayed,
  fetchInboxThreadListWithContextParamsAndUpdateUnreadCounts,
  handleSwitchStatus,
} from '#libs/communication-v2/utils';
import { INBOX_ALL_MESSAGES } from '#libs/communication-v2/constants';
import {
  CommunicationThread,
  SelectFieldItem,
} from '#libs/communication-v2/types';

const PAGE_SIZE = 15;

type WithHandlers = {
  fetchInboxThreadListWithContextParams: (
    isThreadListReinitialized?: boolean,
    nextPage?: number,
  ) => void;
  handleOnItemClick: (id?: number) => void;
  handleFlagAsUnread: (
    id: number,
    relatedObjectKind: ChatThreadKinds,
    filterValue: SelectFieldItem,
  ) => void;
  handleSwitchFavoriteStatus: (threadId: number) => void;
  handleSwitchMutedStatus: (threadId: number) => void;
  handleSwitchDisabledStatus: (threadId: number) => void;
};

type WithState = {
  selectedThreadId: number;
  setSelectedThreadId: (threadId: number) => void;
  contextSelected: ChatThreadKinds;
  setContextSelected: (context: ChatThreadKinds) => void;
  filterValue: SelectFieldItem;
  setFilterValue: (filter: SelectFieldItem) => void;
};

type Props = ConnectedProps<typeof connector> &
  WithHandlers &
  WithTranslation &
  WithState;

class InboxThreadListPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.setFilterValue(
      threadFilteringChoices(this.props.t)[INBOX_ALL_MESSAGES],
    );
    this.props.fetchInboxThreadListWithContextParams(true);
  }

  componentDidUpdate(prevProps: Props) {
    const hasThreadListChanged = this.props.threadList !== prevProps.threadList;

    const isListLoaded =
      this.props.isListLoading !== prevProps.isListLoading &&
      !this.props.isListLoading;

    if (hasThreadListChanged || isListLoaded) {
      this.props.setThreadItems(this.props.threadList);
    }
  }

  loadMoreItems = (nextPage?: number, count?: number): void => {
    if (nextPage && count) {
      const numberOfRemainingThreads = count - (nextPage - 1) * PAGE_SIZE;

      const nextThreadsLength =
        numberOfRemainingThreads >= PAGE_SIZE
          ? PAGE_SIZE
          : numberOfRemainingThreads;

      // nextThreadsLength allows to display as much skeletons as threads which will be loaded,
      // filling the missing threads with null values in threadItems
      this.props.setThreadItems([
        ...this.props.threadItems,
        ...Array(nextThreadsLength).fill(null),
      ]);

      this.props.fetchInboxThreadListWithContextParams(false, nextPage);
    }
  };

  handleFilterChange = (value: SelectFieldItem) => {
    const hasFilterChanged = value !== this.props.filterValue;

    if (hasFilterChanged) {
      this.props.setFilterValue(value, () => {
        const selectedId = this.props.selectedThreadId;

        if (selectedId) {
          const thread = this.props.threadsById[selectedId];
          const isDisplayed = isThreadDisplayed(thread, this.props.filterValue);

          if (!isDisplayed) {
            this.props.setSelectedThreadId(null);
          }
        }

        this.props.fetchInboxThreadListWithContextParams(true);
        this.props.setThreadItems([null]);
      });
    }
  };

  handleContextThreadChange = (context: ChatThreadKinds) => {
    const hasContextChanged = context !== this.props.contextSelected;

    if (hasContextChanged) {
      this.props.setContextSelected(context, () => {
        this.props.setFilterValue(
          threadFilteringChoices(this.props.t)[INBOX_ALL_MESSAGES],
          () => {
            this.props.fetchInboxThreadListWithContextParams(true);
            // null value in threadList allows to display one item with a skeleton during the loading
            this.props.setThreadItems([null]);
          },
        );
      });

      this.props.setSelectedThreadId(null);
    }
  };

  searchThread = (): void => {};

  createNewThread = (): void => {};

  render() {
    const {
      threadItems,
      isListLoading,
      handleSwitchFavoriteStatus,
      handleSwitchMutedStatus,
      handleSwitchDisabledStatus,
      handleFlagAsUnread,
      selectedThreadId,
      handleOnItemClick,
      contextSelected,
      filterValue,
    } = this.props;

    const { count, nextPage } = this.props.threadsPaginationResults;

    return (
      <InboxThreadList
        threadList={threadItems}
        switchFavoriteStatus={handleSwitchFavoriteStatus}
        switchMutedStatus={handleSwitchMutedStatus}
        switchDisabledStatus={handleSwitchDisabledStatus}
        flagAsUnread={handleFlagAsUnread}
        selectedThreadId={selectedThreadId}
        handleOnItemClick={handleOnItemClick}
        loadMoreItems={this.loadMoreItems}
        searchThread={this.searchThread}
        filterValue={filterValue}
        handleFilterChange={this.handleFilterChange}
        handleContextThreadChange={this.handleContextThreadChange}
        createNewThread={this.createNewThread}
        contextSelected={contextSelected}
        isListLoading={isListLoading}
        nextPage={nextPage}
        count={count}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { contextSelected }) => ({
    threadList: getInboxThreadsWithUnreadAnswersCount(state, contextSelected),
    isListLoading: state.communicationV2.inboxThread.loading,
    threadsById: state.communicationV2.inboxThread.byId,
    threadsPaginationResults: getThreadsPaginationResults(
      state,
      contextSelected,
    ),
  }),
  {
    switchFavoriteStatus: switchFavoriteStatusAction,
    switchMutedStatus: switchMutedStatusAction,
    switchDisabledStatus: switchDisabledStatusAction,
    flagAsUnread: flagAsUnreadAction,
    flagAsRead: flagAsReadAction,
    fetchInboxThreadList: fetchInboxThreadListAction,
    fetchUnreadAnswersCounts: fetchUnreadAnswersCountsAction,
    getUnreadAnswersCountFromThread: getUnreadAnswersCountFromThreadAction,
  },
);

export default compose(
  withState('contextSelected', 'setContextSelected', ChatThreadKinds.Member),
  connector,
  withState('selectedThreadId', 'setSelectedThreadId', null),
  withState('filterValue', 'setFilterValue', null),
  // null value in threadList allows to display one item with a skeleton during the loading
  withState('threadItems', 'setThreadItems', [null]),
  withTranslation('communication'),
  withHandlers({
    fetchInboxThreadListWithContextParams:
      ({
        contextSelected,
        filterValue,
        fetchInboxThreadList,
        fetchUnreadAnswersCounts,
      }) =>
      (isThreadListReinitialized?: boolean, page?: number) => {
        fetchInboxThreadListWithContextParamsAndUpdateUnreadCounts(
          contextSelected,
          filterValue,
          fetchInboxThreadList,
          fetchUnreadAnswersCounts,
          isThreadListReinitialized,
          page,
        );
      },
    handleOnItemClick:
      ({
        selectedThreadId,
        setSelectedThreadId,
        threadsById,
        flagAsRead,
        contextSelected,
        filterValue,
        threadList,
        fetchInboxThreadList,
        fetchUnreadAnswersCounts,
        getUnreadAnswersCountFromThread,
      }) =>
      (id?: number) => {
        if (id) {
          if (id !== selectedThreadId) {
            setSelectedThreadId(id, () => {
              const thread = threadsById[id];
              if (!thread.has_been_read) {
                handleSwitchStatus(
                  flagAsRead,
                  contextSelected,
                  filterValue,
                  id,
                  threadList,
                  fetchInboxThreadList,
                  fetchUnreadAnswersCounts,
                  getUnreadAnswersCountFromThread,
                );
              }
            });
          }
        }
      },
    handleFlagAsUnread:
      ({
        flagAsUnread,
        getUnreadAnswersCountFromThread,
        selectedThreadId,
        setSelectedThreadId,
      }) =>
      (threadId: number) => {
        flagAsUnread(threadId, {
          onSuccess: (thread: CommunicationThread) =>
            getUnreadAnswersCountFromThread(thread.id),
        });
        if (selectedThreadId === threadId) {
          setSelectedThreadId(null);
        }
      },
    handleSwitchFavoriteStatus:
      ({
        switchFavoriteStatus,
        contextSelected,
        filterValue,
        threadList,
        fetchInboxThreadList,
        fetchUnreadAnswersCounts,
      }) =>
      (threadId: number) => {
        handleSwitchStatus(
          switchFavoriteStatus,
          contextSelected,
          filterValue,
          threadId,
          threadList,
          fetchInboxThreadList,
          fetchUnreadAnswersCounts,
        );
      },
    handleSwitchMutedStatus:
      ({
        switchMutedStatus,
        contextSelected,
        filterValue,
        threadList,
        fetchInboxThreadList,
        fetchUnreadAnswersCounts,
      }) =>
      (threadId: number) => {
        handleSwitchStatus(
          switchMutedStatus,
          contextSelected,
          filterValue,
          threadId,
          threadList,
          fetchInboxThreadList,
          fetchUnreadAnswersCounts,
        );
      },
    handleSwitchDisabledStatus:
      ({
        switchDisabledStatus,
        contextSelected,
        filterValue,
        threadList,
        fetchInboxThreadList,
        fetchUnreadAnswersCounts,
      }) =>
      (threadId: number) => {
        handleSwitchStatus(
          switchDisabledStatus,
          contextSelected,
          filterValue,
          threadId,
          threadList,
          fetchInboxThreadList,
          fetchUnreadAnswersCounts,
        );
      },
  }),
)(InboxThreadListPage);
