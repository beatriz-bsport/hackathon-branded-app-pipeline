// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';

import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import type { Member } from '../../member/types';
import { anonymizeEmail } from '../../member/utils';

type Props = {
  t: TFunction,
  classes: Object,
  member: Member,
  confirmAttendance: () => void,
};

export const CheckInBookingItem = (props: Props) => {
  const { classes, member, t, confirmAttendance } = props;
  const checkedIn = member.booking.attendance;
  return (
    <ListItem dense className={classes.listItem}>
      <ListItemAvatar>
        <Avatar alt={member.name} src={member.photo} />
      </ListItemAvatar>
      <ListItemText
        primary={member.name}
        secondary={
          member && member.consumer
            ? anonymizeEmail(member.consumer.email)
            : ' - '
        }
      />
      <ListItemSecondaryAction>
        {checkedIn ? (
          <Button
            variant="contained"
            size="small"
            className={classes.button}
            disabled
          >
            <DoneIcon className={classes.buttonIcon} />
            {t('memberList.checkedIn')}
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            className={classes.button}
            onClick={confirmAttendance}
          >
            {' '}
            <DoneIcon className={classes.buttonIcon} />
            {t('memberList.checkIn')}
          </Button>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const style = (theme) => {
  return {
    button: {
      marginRight: theme.spacing(1),
    },
    buttonIcon: {
      marginRight: theme.spacing(1),
    },
    listItem: {
      marginBottom: theme.spacing(1) / 3,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      border: `2px solid ${theme.palette.grey[200]}`,
      borderRadius: theme.shape.borderRadius,
    },
  };
};
export default withNamespaces(['selfCheckIn'])(
  withStyles(style)(CheckInBookingItem),
);
