// @flow
import React from 'react';

import { CircularProgress, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

type Props = {
  isRefreshing: boolean,
  onRefresh: () => void,
};

export default function(props: Props) {
  return (
    <IconButton onClick={props.onRefresh} name="refresh">
      {props.isRefreshing ? (
        <CircularProgress size={24} />
      ) : (
        <RefreshIcon color="primary" />
      )}
    </IconButton>
  );
}
