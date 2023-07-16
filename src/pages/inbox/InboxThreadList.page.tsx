import React, { PureComponent } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { compose, withHandlers, withState } from 'recompose';
import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';
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
  fetchInboxThreadListFromThreadCalledFromURL,
} from '#libs/communication-v2/utils';
import { INBOX_ALL_MESSAGES } from '#libs/communication-v2/constants';
import type {
  CommunicationThread,
  CommunicationThreadWithUnreadAnswersCount,
  InboxThreadRouterProps,
  SelectFieldItem,
} from '#libs/communication-v2/types';

const PAGE_SIZE = 15;

type OwnProps = InboxThreadRouterProps;

type WithHandlers = {
  fetchInboxThreadListWithContextParams: (
    isThreadListReinitialized?: boolean,
    nextPage?: number,
    threadId?: number,
  ) => void;
  handleOnItemClick: (id?: number) => void;
  handleFlagAsUnread: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  handleSwitchFavoriteStatus: (threadId: number) => void;
  handleSwitchMutedStatus: (threadId: number) => void;
  handleSwitchDisabledStatus: (threadId: number) => void;
};

type WithState = {
  filterValue: SelectFieldItem;
  setFilterValue: (filter: SelectFieldItem, options?: () => void) => void;
  threadItems: (CommunicationThreadWithUnreadAnswersCount | null)[];
  setThreadItems: (
    threads: (CommunicationThreadWithUnreadAnswersCount | null)[],
    options?: () => void,
  ) => void;
  search: string;
  setSearch: (search: string, options?: () => void) => void;
};

type InboxListConnectedProps = OwnProps &
  ConnectedProps<typeof connector> &
  WithState;

type Props = InboxListConnectedProps & WithHandlers & WithTranslation;

class InboxThreadListPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.setFilterValue(
      threadFilteringChoices(this.props.t)[INBOX_ALL_MESSAGES],
    );
    this.props.fetchInboxThreadListWithContextParams(true);
  }

  componentDidUpdate(prevProps: Props) {
    const {
      threadList,
      isListLoading,
      setThreadItems,
      thread,
      setFilterValue,
      t,
      contextSelected,
      setContextSelected,
      fetchInboxThreadListWithContextParams,
    } = this.props;

    const hasThreadListChanged = threadList !== prevProps.threadList;

    const hasListFinishedLoading =
      isListLoading !== prevProps.isListLoading && !isListLoading;

    if (hasThreadListChanged || hasListFinishedLoading) {
      setThreadItems(threadList);
    }

    if (thread && prevProps.thread?.id !== thread.id) {
      fetchInboxThreadListFromThreadCalledFromURL(
        thread,
        setFilterValue,
        t,
        fetchInboxThreadListWithContextParams,
        contextSelected,
        setContextSelected,
      );
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
            this.props.unselectThread();
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

      this.props.unselectThread();
    }
  };

  searchThread = (search: string) => {
    const hasSearchChanged = search !== this.props.search;

    if (hasSearchChanged) {
      this.props.setSearch(search, () => {
        this.props.fetchInboxThreadListWithContextParams(true);
        this.props.setThreadItems([null]);
      });
    }
  };

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
  (state: RootState, { contextSelected }: OwnProps) => ({
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
    selectThread: (id: number) => push(`/inbox/thread/${id}/`),
    unselectThread: () => push('/inbox/thread/'),
  },
);

export default compose<Props, InboxThreadRouterProps>(
  connector,
  withState('filterValue', 'setFilterValue', null),
  // null value in threadList allows to display one item with a skeleton during the loading
  withState('threadItems', 'setThreadItems', [null]),
  withState('search', 'setSearch', ''),
  withTranslation('communication'),
  withHandlers({
    fetchInboxThreadListWithContextParams:
      ({
        contextSelected,
        filterValue,
        search,
        fetchInboxThreadList,
        fetchUnreadAnswersCounts,
      }: InboxListConnectedProps) =>
      (
        isThreadListReinitialized?: boolean,
        page?: number,
        threadId?: number,
      ) => {
        if (!threadId) {
          fetchInboxThreadListWithContextParamsAndUpdateUnreadCounts(
            contextSelected,
            filterValue,
            fetchInboxThreadList,
            fetchUnreadAnswersCounts,
            isThreadListReinitialized,
            page,
            null,
            search,
          );
        } else {
          fetchInboxThreadListWithContextParamsAndUpdateUnreadCounts(
            contextSelected,
            filterValue,
            fetchInboxThreadList,
            fetchUnreadAnswersCounts,
            isThreadListReinitialized,
            null,
            threadId,
            search,
          );
        }
      },
    handleOnItemClick:
      ({
        selectedThreadId,
        threadsById,
        flagAsRead,
        contextSelected,
        filterValue,
        threadList,
        fetchInboxThreadList,
        fetchUnreadAnswersCounts,
        getUnreadAnswersCountFromThread,
        selectThread,
        unselectThread,
      }: InboxListConnectedProps) =>
      (id?: number) => {
        if (id) {
          if (id !== selectedThreadId) {
            selectThread(id);
            const thread = threadsById[id];
            if (!thread.last_communication_has_been_read) {
              handleSwitchStatus(
                flagAsRead,
                contextSelected,
                filterValue,
                id,
                threadList,
                fetchInboxThreadList,
                fetchUnreadAnswersCounts,
                unselectThread,
                getUnreadAnswersCountFromThread,
              );
            }
          }
        }
      },
    handleFlagAsUnread:
      ({
        flagAsUnread,
        getUnreadAnswersCountFromThread,
        selectedThreadId,
        unselectThread,
      }: InboxListConnectedProps) =>
      (threadId: number) => {
        flagAsUnread(threadId, {
          onSuccess: (thread: CommunicationThread) =>
            getUnreadAnswersCountFromThread(thread.id),
        });
        if (selectedThreadId === threadId) {
          unselectThread();
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
        unselectThread,
      }: InboxListConnectedProps) =>
      (threadId: number) => {
        handleSwitchStatus(
          switchFavoriteStatus,
          contextSelected,
          filterValue,
          threadId,
          threadList,
          fetchInboxThreadList,
          fetchUnreadAnswersCounts,
          unselectThread,
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
        unselectThread,
      }: InboxListConnectedProps) =>
      (threadId: number) => {
        handleSwitchStatus(
          switchMutedStatus,
          contextSelected,
          filterValue,
          threadId,
          threadList,
          fetchInboxThreadList,
          fetchUnreadAnswersCounts,
          unselectThread,
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
        unselectThread,
      }: InboxListConnectedProps) =>
      (threadId: number) => {
        handleSwitchStatus(
          switchDisabledStatus,
          contextSelected,
          filterValue,
          threadId,
          threadList,
          fetchInboxThreadList,
          fetchUnreadAnswersCounts,
          unselectThread,
        );
      },
  }),
)(InboxThreadListPage);
