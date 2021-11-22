// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import VaccinationBadge from './VaccinationBadge.component';
import AvatarWithBadge from './AvatarWithBadge.component';

type Props = {
  member: Member<Tags<TagGroup>>,
  onEdit?: () => void,
  onClick?: () => void,
  firstBooking?: boolean,
  anonimize?: boolean,
  showVaccinationStatus: boolean,
};
export const MemberMinimalListItem = (props: Props) => {
  const { t } = useTranslation('member');
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
          <AvatarWithBadge member={props.member} />
        </Wrapper>
      </ListItemAvatar>
      <ListItemText
        primary={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography>
              {props.member.name + (props.firstBooking ? ' ★' : '')}
            </Typography>
            <Typography color="secondary" variant="caption">
              {props.member.archived ? `${'\u00A0'}(${t('archived')})` : ''}
            </Typography>
          </div>
        }
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
