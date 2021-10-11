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
import VaccinationBadge from './VaccinationBadge.component';

type Props = {
  member: Member,
  onEdit?: () => void,
  onClick?: () => void,
  firstBooking?: boolean,
  anonimize?: boolean,
  showVaccinationStatus: boolean,
};
export const MemberMinimalListItem = (props: Props) => {
  if (!props.member) {
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ListItemText primary=" - " />
      </ListItem>
    );
  }
  let secondaryInfo = '';
  if (!props.anonimize) {
    secondaryInfo +=
      props.member.phone || props.member.email
        ? `${props.member.phone || ''} ${props.member.email}` || ''
        : '';
  }
  let Wrapper = (p) => <div>{p.children}</div>;
  if (props.showVaccinationStatus)
    Wrapper = (p) => (
      <VaccinationBadge status={props.member.vaccination_status}>
        {p.children}
      </VaccinationBadge>
    );
  return (
    <ListItem
      button={!!props.onClick}
      onClick={props.onClick ? () => props.onClick(props.member.id) : null}
    >
      <ListItemAvatar>
        <Wrapper>
          <CreditMemberBadge credit={props.member.credit_account_balance}>
            <Avatar src={props.member.photo} />
          </CreditMemberBadge>
        </Wrapper>
      </ListItemAvatar>
      <ListItemText
        primary={props.member.name + (props.firstBooking ? ' ★' : '')}
        secondary={secondaryInfo}
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
