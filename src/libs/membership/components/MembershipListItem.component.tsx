import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import type { Membership } from '#libs/membership/types';

type Props = {
  membership: Membership;
  onClick?: () => void;
};

const MemnbershipListItem: React.FC<Props> = ({ membership, onClick }) => (
  <ListItem divider button={onClick ? true : undefined} onClick={onClick}>
    <ListItemAvatar>
      <Avatar alt={membership?.company_name} src={membership?.company_cover} />
    </ListItemAvatar>
    <ListItemText
      primary={membership?.company_name}
      secondary={membership?.websiteURL}
    />
  </ListItem>
);

export default React.memo(MemnbershipListItem);
