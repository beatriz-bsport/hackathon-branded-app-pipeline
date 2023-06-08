import React, { useState, memo, useCallback } from 'react';
import { IconButton } from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { OptionCallback } from '../../../../state/types';
import ThreadMenuActions from '#libs/communication-v2/thread/commons/ThreadMenuActions.component';

type Props = {
  id: number;
  hasBeenRead: boolean;
  isFavorite: boolean;
  isMuted: boolean;
  isDisabled: boolean;
  relatedObjectKind?: ChatThreadKinds;
  switchFavoriteStatus: (id: number, options?: OptionCallback) => void;
  switchMutedStatus: (id: number, options?: OptionCallback) => void;
  switchDisabledStatus: (id: number, options?: OptionCallback) => void;
  flagAsUnread: (id: number, options?: OptionCallback) => void;
  isMobileMenu?: boolean;
  goToDetailPage?: () => void;
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
        id={id}
        hasBeenRead={hasBeenRead}
        isFavorite={isFavorite}
        isMuted={isMuted}
        isDisabled={isDisabled}
        relatedObjectKind={relatedObjectKind}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        switchDisabledStatus={switchDisabledStatus}
        flagAsUnread={flagAsUnread}
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
