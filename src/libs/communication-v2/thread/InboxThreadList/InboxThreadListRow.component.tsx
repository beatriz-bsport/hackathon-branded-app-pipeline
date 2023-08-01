import React, { memo, useCallback } from 'react';

import type { OptionCallback } from '../../../../state/types';
import InboxThreadListItem from '#libs/communication-v2/thread/InboxThreadListItem';
import type {
  CommunicationThread,
  CommunicationThreadWithUnreadAnswersCount,
} from '#libs/communication-v2/types';

type Props = {
  index: number;
  style: React.CSSProperties;
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
  selectedThreadId: number;
  handleOnItemClick: (threadId?: number) => void;
  threadList: CommunicationThreadWithUnreadAnswersCount[];
};

const InboxThreadListRow: React.FC<Props> = ({
  index,
  style,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  flagAsUnread,
  selectedThreadId,
  handleOnItemClick,
  threadList,
}) => {
  const thread = threadList[index];
  const isLoading = !(index in threadList && !!threadList[index]);
  const onItemClick = useCallback(() => {
    handleOnItemClick(thread?.id);
  }, [thread, handleOnItemClick]);

  return (
    <div style={style}>
      <InboxThreadListItem
        flagAsUnread={flagAsUnread}
        isLoading={isLoading}
        isSelected={thread?.id === selectedThreadId}
        onClick={onItemClick}
        switchDisabledStatus={switchDisabledStatus}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        thread={thread}
      />
    </div>
  );
};

export default memo(InboxThreadListRow);
