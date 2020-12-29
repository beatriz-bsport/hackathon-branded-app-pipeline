// @flow
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { IconButton, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import { RecurrenceRulePrivateBookingDeleteDialog } from './RecurrenceRulePrivateBookingConfirmDialog.component';

type Props = {
  recurrentPrivateBooking: any,
  onDelete: (id: number) => void,
  onEdit: (id: number) => void,
  notShowMember: boolean,
}

export const RecurrenceRulePrivateBookingItem = (props: Props) => {
  const { t } = useTranslation(['privateService', 'datetime']);
  const { recurrentPrivateBooking, onDelete, onEdit, notShowMember } = props;
  const {
    member,
    private_slot,
    associated_coach,
    associated_establishment,
  } = recurrentPrivateBooking;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatTime = () => {
    const time = moment(
    `${props.recurrentPrivateBooking.hour}:${props.recurrentPrivateBooking.minute}`,
    'HH:mm');
    if (props.recurrentPrivateBooking.timezone_name) {
      time.tz(props.recurrentPrivateBooking.timezone_name);
    }
    return time.format('LT');
    };

  const getHeader = () => {
    if (notShowMember) {
      if (associated_coach) {
        return (
          <Typography color="primary" variant="body2">
            {associated_coach.name}
          </Typography>
        );
      }
      return '';
    }
    return <div>{member && member.name ? member.name : '-'}</div>;
  };

  return (
    <ListItem divider dense>
      {member && member.photo && !notShowMember && (
        <ListItemAvatar>
          <Avatar alt="" src={member.photo} />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={getHeader()}
        primaryTypographyProps={{ variant: 'body2' }}
        secondary={
          <div>
            {!notShowMember && !!associated_coach && (
              <Typography color="secondary" variant="body2">
                {associated_coach.name}
              </Typography>
            )}
            {!!private_slot && (
              <Typography color="secondary" variant="body2">
                {private_slot.name}
              </Typography>
            )}
            {!!associated_establishment && (
              <Typography color="secondary" variant="body2">
                {associated_establishment.title}
              </Typography>
            )}
            <Typography variant="body2">
              {t('privateService:recurrenceRule.item.explain', {
                dayOfWeek: t(
                  `datetime:time.weekdayNumber.${recurrentPrivateBooking.day_of_week}`,
                ),
                time: `${formatTime()}`,
                delayWeek: recurrentPrivateBooking.nb_of_weeks,
              })}
            </Typography>
          </div>
        }
      />
      <ListItemSecondaryAction>
        {onEdit && (
          <IconButton color="primary" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        )}
        {onDelete && (
          <IconButton onClick={() => setDeleteDialogOpen(true)}>
            <CancelIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
      <RecurrenceRulePrivateBookingDeleteDialog
        recurrentRuleId={deleteDialogOpen ? recurrentPrivateBooking.id : null}
        onClose={() => setDeleteDialogOpen(false)}
        onChange={() => {
          props.onDelete(recurrentPrivateBooking.id);
          setDeleteDialogOpen(false);
        }}
      />
    </ListItem>
  );
};

export default RecurrenceRulePrivateBookingItem;
