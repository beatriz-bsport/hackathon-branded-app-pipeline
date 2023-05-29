import React, { memo, useCallback } from 'react';

import InboxThreadListItem from '#libs/communication-v2/thread/InboxThreadListItem';
import { CommunicationThread } from '#libs/communication-v2/types';

type Props = {
  index: number;
  style: React.CSSProperties;
  switchFavoriteStatus: () => void;
  switchMutedStatus: () => void;
  switchDisabledStatus: () => void;
  markAsUnread: () => void;
  selectedThreadId: number;
  setSelectedThreadId: (threadId: number) => void;
  threadList: (CommunicationThread | null)[];
};

const InboxThreadListRow: React.FC<Props> = ({
  index,
  style,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  markAsUnread,
  selectedThreadId,
  setSelectedThreadId,
  threadList,
}) => {
  const thread = threadList[index];
  const isLoading = !thread;

  const onItemClick = useCallback(() => {
    !!thread && setSelectedThreadId(thread.id);
  }, [setSelectedThreadId, thread]);

  return (
    <div style={style}>
      <InboxThreadListItem
        thread={thread}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        switchDisabledStatus={switchDisabledStatus}
        markAsUnread={markAsUnread}
        isLoading={isLoading}
        isSelected={thread?.id === selectedThreadId}
        onClick={onItemClick}
      />
    </div>
  );
};

export default memo(InboxThreadListRow);
