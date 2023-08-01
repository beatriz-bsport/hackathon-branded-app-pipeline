// @ts-nocheck
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
    disabled={props.isRedirectLoading}
    onClick={props.onClick}
    selected={props.selected}
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
