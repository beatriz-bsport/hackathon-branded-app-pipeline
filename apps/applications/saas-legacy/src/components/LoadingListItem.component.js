import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';

export default (props) => (
  <ListItem {...props}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </div>
  </ListItem>
);
