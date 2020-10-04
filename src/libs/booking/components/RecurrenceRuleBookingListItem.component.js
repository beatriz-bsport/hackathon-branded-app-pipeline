// @flow
import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { useTranslation } from 'react-i18next';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IconButton, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

type Props = {
  recurrenceRuleBooking: Array,
  onDelete: (id: number) => void,
  notShowMember: boolean,
  onEdit: (id: number) => void,
  onClick: ?() => void,
};

export const RecurrenceRuleBookingListItem = (props: Props) => {
  const { t } = useTranslation(['booking', 'datetime']);
  const { recurrenceRuleBooking, onDelete, onEdit, notShowMember } = props;
  const { member, meta_activity } = recurrenceRuleBooking;

  const [checked, setChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const getHeader = () => {
    if (notShowMember) {
      if (meta_activity) {
        return (
          <Typography color="primary" variant="body2">
            {meta_activity.name}
          </Typography>
        );
      }
      return '';
    }
    return <div>{member && member.name ? member.name : '-'}</div>;
  };

  const DeleteDialog = () => {
    return (
      <Dialog
        open={dialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('booking:recurrenceRule.deleteModal.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('booking:recurrenceRule.deleteModal.content')}
          </DialogContentText>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  id="notify_if_canceled"
                  name="notify_if_canceled"
                  checked={checked}
                  onChange={handleChangeChecked}
                />
              }
              label={t('booking:recurrenceRule.notifyIfCanceled')}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            {t('booking:recurrenceRule.deleteModal.cancel')}
          </Button>
          <Button
            onClick={() => {
              onDelete(recurrenceRuleBooking.id, {
                notify_if_canceled: checked,
              });

              setDialogOpen(false);
            }}
            color="primary"
          >
            {t('booking:recurrenceRule.deleteModal.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  return (
    <ListItem button={!!props.onClick} onClick={props.onClick} dense divider>
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
            {!notShowMember && !!meta_activity && (
              <Typography color="primary" variant="body2">
                {meta_activity.name}
              </Typography>
            )}
            <Typography variant="body2">
              {t('booking:recurrenceRule.item.explain', {
                dayOfWeek: t(
                  `datetime:time.weekdayNumber.${recurrenceRuleBooking.day_of_week}`,
                ),
                hour: `${recurrenceRuleBooking.hour}`.padStart(2, '0'),
                minute: `${recurrenceRuleBooking.minute}`.padStart(2, '0'),
                delayWeek: recurrenceRuleBooking.delay_week,
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
          <IconButton onClick={() => setDialogOpen(true)}>
            <CancelIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
      {DeleteDialog()}
    </ListItem>
  );
};

export default RecurrenceRuleBookingListItem;
