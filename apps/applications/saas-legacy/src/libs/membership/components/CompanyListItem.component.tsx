import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import type { Company } from '#src/libs/company/types';
import type { FranchiseCompany } from '#src/libs/franchise/types';

export const CompanyListItem = (props: {
  company: Company | FranchiseCompany;
  onClick?: () => void;
  selected?: boolean;
  isRedirectLoading?: boolean;
}) => (
  <ListItem
    divider
    button={!!props.onClick as any}
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

export default React.memo(CompanyListItem);
