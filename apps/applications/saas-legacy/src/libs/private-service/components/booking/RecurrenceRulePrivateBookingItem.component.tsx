import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { IconButton, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { RecurrenceRulePrivateBookingDeleteDialog } from './RecurrenceRulePrivateBookingDeleteDialog.component';
import { formatAsDatetimeAdapted } from '../../../../utils/datetime';

type Props = {
  recurrentPrivateBooking: any;
  onDelete: (data: { cancel_related_bookings: boolean }) => void;
  onEdit: () => void;
  notShowMember: boolean;
};

const RecurrenceRulePrivateBookingItem = (props: Props) => {
  const { t } = useTranslation(['privateService', 'datetime']);
  const { recurrentPrivateBooking, onDelete, onEdit, notShowMember } = props;
  const {
    member,
    private_slot,
    start_from_date,
    associated_coach,
    associated_establishment,
    allow_unpaid,
  } = recurrentPrivateBooking;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatTime = () => {
    const formattedHours =
      props.recurrentPrivateBooking.hour < 10
        ? `0${props.recurrentPrivateBooking.hour}`
        : props.recurrentPrivateBooking.hour;
    const formattedMinutes =
      props.recurrentPrivateBooking.minute < 10
        ? `0${props.recurrentPrivateBooking.minute}`
        : props.recurrentPrivateBooking.minute;
    const time = DateTime.fromFormat(
      `${formattedHours}:${formattedMinutes}`,
      'HH:mm',
    );

    return (
      props.recurrentPrivateBooking.timezone_name
        ? time.setZone(props.recurrentPrivateBooking.timezone_name)
        : time
    ).toFormat('T');
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

  const from_date = formatAsDatetimeAdapted(start_from_date, 'DDD');

  return (
    <ListItem dense divider>
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
            {!!start_from_date && (
              <Typography color="secondary" variant="body2">
                {t('privateService:recurrenceRule.item.startFrom', {
                  date: from_date,
                })}
              </Typography>
            )}
            {!!associated_establishment && (
              <Typography color="secondary" variant="body2">
                {associated_establishment.title}
              </Typography>
            )}
            {!!allow_unpaid && (
              <Typography color="error" variant="body2">
                {t('privateService:recurrenceRule.item.allowUnpaid')}
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
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'reservation.privateBooking.allowed_actions.edit',
          'reservation.privateBooking.allowed_actions.cancel',
        ]}
      >
        {([hasEditPermission, hasCancelPermission]: boolean[]) => (
          <ListItemSecondaryAction>
            {hasEditPermission && (
              <IconButton color="primary" onClick={onEdit}>
                <EditIcon />
              </IconButton>
            )}
            {hasCancelPermission && (
              <IconButton onClick={() => setDeleteDialogOpen(true)}>
                <CancelIcon />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        )}
      </ObjectLevelPermissionProvider>
      <RecurrenceRulePrivateBookingDeleteDialog
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={(data) => {
          onDelete(data);
          setDeleteDialogOpen(false);
        }}
        recurrentRuleId={deleteDialogOpen ? recurrentPrivateBooking.id : null}
      />
    </ListItem>
  );
};

export default RecurrenceRulePrivateBookingItem;
