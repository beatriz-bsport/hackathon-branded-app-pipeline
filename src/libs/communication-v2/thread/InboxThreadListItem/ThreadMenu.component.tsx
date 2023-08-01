import React, { useState, memo, useCallback } from 'react';

import type { CallHistoryMethodAction } from 'connected-react-router';

import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import type { OptionCallback } from '../../../../state/types';
import type { CommunicationThread } from '#libs/communication-v2/types';
import ThreadMenuActions from '#libs/communication-v2/thread/commons/ThreadMenuActions.component';

type Props = {
  id: number;
  hasBeenRead: boolean;
  isFavorite: boolean;
  isMuted: boolean;
  isDisabled: boolean;
  relatedObjectKind?: ChatThreadKinds;
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
  isMobileMenu?: boolean;
  goToDetailPage?: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
  setOpenCollapse?: () => void;
};

const ThreadMenu: React.FC<Props> = ({
  id,
  hasBeenRead,
  isFavorite,
  isMuted,
  isDisabled,
  relatedObjectKind,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  flagAsUnread,
  isMobileMenu,
  goToDetailPage,
  setOpenCollapse,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      event.stopPropagation();
    },
    [],
  );

  return (
    <>
      <IconButton
        aria-controls="thread-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon fontSize="medium" />
      </IconButton>
      <ThreadMenuActions
        anchorEl={anchorEl}
        flagAsUnread={flagAsUnread}
        goToDetailPage={goToDetailPage}
        hasBeenRead={hasBeenRead}
        id={id}
        isDisabled={isDisabled}
        isFavorite={isFavorite}
        isMobileMenu={isMobileMenu}
        isMuted={isMuted}
        relatedObjectKind={relatedObjectKind}
        setAnchorEl={setAnchorEl}
        setOpenCollapse={setOpenCollapse}
        switchDisabledStatus={switchDisabledStatus}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
      />
    </>
  );
};

export default memo(ThreadMenu);
