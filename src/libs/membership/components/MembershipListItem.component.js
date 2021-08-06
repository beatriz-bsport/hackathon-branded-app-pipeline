// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

export const MemnbershipListItem = (props: {
  membership: Membership,
  onClick: ?() => void,
}) => (
  <ListItem divider button={!!props.onClick} onClick={props.onClick}>
    <ListItemAvatar>
      <Avatar
        alt={props.membership?.company_name}
        src={props.membership?.company_cover}
      />
    </ListItemAvatar>
    <ListItemText
      primary={props.membership?.company_name}
      secondary={props.membership?.websiteURL}
    />
  </ListItem>
);
export default MemnbershipListItem;
