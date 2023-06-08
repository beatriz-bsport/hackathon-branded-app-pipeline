import React, { memo, useCallback } from 'react';

import { OptionCallback } from '../../../../state/types';
import InboxThreadListItem from '#libs/communication-v2/thread/InboxThreadListItem';
import { CommunicationThreadWithUnreadAnswersCount } from '#libs/communication-v2/types';

type Props = {
  index: number;
  style: React.CSSProperties;
  switchFavoriteStatus: (id: number, options?: OptionCallback) => void;
  switchMutedStatus: (id: number, options?: OptionCallback) => void;
  switchDisabledStatus: (id: number, options?: OptionCallback) => void;
  flagAsUnread: (id: number, options?: OptionCallback) => void;
  selectedThreadId: number;
  handleOnItemClick: (threadId?: number, hasBeenRead?: boolean) => void;
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
    handleOnItemClick(thread?.id, thread?.last_communication_has_been_read);
  }, [thread, handleOnItemClick]);

  return (
    <div style={style}>
      <InboxThreadListItem
        thread={thread}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        switchDisabledStatus={switchDisabledStatus}
        flagAsUnread={flagAsUnread}
        isLoading={isLoading}
        isSelected={thread?.id === selectedThreadId}
        onClick={onItemClick}
      />
    </div>
  );
};

export default memo(InboxThreadListRow);
