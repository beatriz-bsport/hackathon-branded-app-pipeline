// @flow
import React from 'react';

import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

type Props = {
  establishment: Establishment,
};

export default (props: Props) => (
  <ListItem>
    <ListItemText
      primary={props.establishment.title}
      secondary={props.establishment.location.address}
    />
  </ListItem>
);
