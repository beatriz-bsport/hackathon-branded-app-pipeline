import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import type { Company } from '../../company/types';

export const CompanyListItem = (props: {
  company: Company;
  onClick?: () => void;
  selected?: boolean;
  isRedirectLoading?: boolean;
}) => (
  <ListItem
    divider
    button={!!props.onClick}
    onClick={props.onClick}
    selected={props.selected}
    disabled={props.isRedirectLoading}
  >
    <ListItemAvatar>
      <Avatar alt={props.company.name} src={props.company.cover} />
    </ListItemAvatar>
    <ListItemText
      primary={props.company.name}
      secondary={props.company.websiteURL}
    />
  </ListItem>
);
export default CompanyListItem;
