import React, { useState } from 'react';
import InboxThreadList, {
  Props,
} from '#libs/communication-v2/thread/InboxThreadList/InboxThreadList.component';
import {
  RandomThreadBatch,
  randomInt,
} from '#libs/communication-v2/factories/CommunicationThread';
import { INBOX_ALL_MESSAGES } from '#libs/communication-v2/constants';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';

const PAGE_SIZE = 15;
const THREAD_NUMBER = randomInt(100) * PAGE_SIZE;

const CustomTemplate = (args: Props) => {
  const [value, setValue] = useState({
    value: INBOX_ALL_MESSAGES,
    label: 'All the messages',
  });

  const [contextSelected, setContextSelected] = useState(
    ChatThreadKinds.Member,
  );

  const [threadList, setThreadList] = useState(RandomThreadBatch());
  const [isListLoading, setIsListLoading] = useState(false);
  const [nextPage, setNextPage] = useState(2);

  const loadMoreItems = () => {
    if (threadList.length < THREAD_NUMBER) {
      setIsListLoading(true);
      setTimeout(() => {
        const newThreadList = [...threadList];
        setThreadList(newThreadList.concat(RandomThreadBatch()));
        setIsListLoading(false);
      }, 2500);
    } else {
      setNextPage(nextPage + 1);
    }
  };

  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  return (
    <InboxThreadList
      threadList={threadList}
      loadMoreItems={loadMoreItems}
      selectedThreadId={selectedThreadId}
      handleOnItemClick={setSelectedThreadId}
      handleFilterChange={setValue}
      filterValue={value}
      contextSelected={contextSelected}
      handleContextThreadChange={setContextSelected}
      isListLoading={isListLoading}
      nextPage={nextPage}
      count={threadList.length}
      {...args}
    />
  );
};

export const InboxList = CustomTemplate.bind({});

export default {
  title: 'Library/Communication-V2/InboxThreadList',
  component: InboxThreadList,
  argTypes: {
    searchThread: { action: 'searchThread' },
    createNewThread: { action: 'createNewThread' },
    flagAsUnread: { action: 'flagAsUnread' },
    switchFavoriteStatus: { action: 'switchFavoriteStatus' },
    switchMutedStatus: { action: 'switchMutedStatus' },
    switchDisabledStatus: { action: 'switchDisabledStatus' },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
