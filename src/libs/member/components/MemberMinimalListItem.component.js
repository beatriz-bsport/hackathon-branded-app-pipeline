// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';

import CreditMemberBadge from './CreditMemberBadge.component';

type Props = {
  member: Member,
  onEdit?: () => void,
  onClick?: () => void,
};
export const MemberMinimalListItem = (props: Props) => {
  return (
    <ListItem
      button={!!props.onClick}
      onClick={props.onClick ? () => props.onClick(props.member.id) : null}
    >
      <ListItemAvatar>
        <CreditMemberBadge credit={props.member.credit_account_balance}>
          <Avatar src={props.member.photo} />
        </CreditMemberBadge>
      </ListItemAvatar>
      <ListItemText
        primary={props.member.name}
        secondary={
          props.member.phone || props.member.email
            ? `${props.member.phone || ''} ${props.member.email}` || ''
            : null
        }
      />
      <ListItemSecondaryAction>
        {props.onEdit ? (
          <IconButton onClick={props.onEdit}>
            <EditIcon />
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default MemberMinimalListItem;
