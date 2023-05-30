import React, { useState, memo, useCallback } from 'react';
import { IconButton } from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import ThreadMenuActions from '#libs/communication-v2/thread/commons/ThreadMenuActions.component';

type Props = {
  hasBeenRead: boolean;
  isFavorite: boolean;
  isMuted: boolean;
  isDisabled: boolean;
  relatedObjectKind?: ChatThreadKinds;
  switchFavoriteStatus: () => void;
  switchMutedStatus: () => void;
  switchDisabledStatus: () => void;
  markAsUnread: () => void;
  isMobileMenu?: boolean;
  goToDetailPage?: () => void;
  setOpenCollapse?: () => void;
};

const ThreadMenu: React.FC<Props> = ({
  hasBeenRead,
  isFavorite,
  isMuted,
  isDisabled,
  relatedObjectKind,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  markAsUnread,
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
        hasBeenRead={hasBeenRead}
        isFavorite={isFavorite}
        isMuted={isMuted}
        isDisabled={isDisabled}
        relatedObjectKind={relatedObjectKind}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        switchDisabledStatus={switchDisabledStatus}
        markAsUnread={markAsUnread}
        isMobileMenu={isMobileMenu}
        goToDetailPage={goToDetailPage}
        setOpenCollapse={setOpenCollapse}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </>
  );
};

export default memo(ThreadMenu);
