import React from 'react';
import type { PopoverOrigin } from '@material-ui/core';

export const usePopoverBubble = () => {
  const anchorOrigin: PopoverOrigin = {
    vertical: 'center',
    horizontal: 'right',
  };

  const popoverStyle = {
    style: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  };

  const transformOrigin: PopoverOrigin = {
    vertical: 'center',
    horizontal: 'left',
  };

  const [anchorEl, setAnchorEl] = React.useState<
    HTMLButtonElement | HTMLDivElement | null
  >(null);

  return { anchorOrigin, popoverStyle, transformOrigin, anchorEl, setAnchorEl };
};

export default usePopoverBubble;
