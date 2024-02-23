// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddIcon from '@material-ui/icons/Add';

import boop from '../../../sounds/boop.mp3';
import CheckInBookingItem from './CheckInBookingItem.component';
import type { Offer } from '../../offer/types';
import type { MemberWithBooking } from '../../member/types';

const likeAudio = new Audio(boop);

const playSound = (audioFile) => {
  audioFile.play();
};

type Props = {
  bookingLoading: boolean,
  offer: Offer,
  onAddMember: () => void,
  members?: Array<MemberWithBooking>,
  confirmBookingAttendance: (bookingId: number) => void,
};

export const BookingList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['selfCheckIn']);

  return (
    <div>
      <List disablePadding>
        {props.bookingLoading ? (
          <LinearProgress />
        ) : (
          <ListItem
            button
            className={classes.registerListItem}
            disabled={props.offer.is_full}
            onClick={() => props.onAddMember()}
          >
            <ListItemAvatar>
              <AddIcon />
            </ListItemAvatar>
            <ListItemText
              primary={
                props.offer.is_full
                  ? t('offerDetail.isFull')
                  : t('offerDetail.register')
              }
            />
          </ListItem>
        )}
        {(props.members || []).map((member) => (
          <CheckInBookingItem
            key={member.booking.id}
            confirmAttendance={() => {
              playSound(likeAudio);
              props.confirmBookingAttendance(member.booking);
            }}
            member={member}
            offer={props.offer}
          />
        ))}
      </List>
      {(props.members || []).length === 0 && !props.bookingLoading ? (
        <div className={classes.emptyTextContainer}>
          <Typography color="textSecondary" variant="body2">
            {t('offerDetail.emptyList')}
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  registerListItem: {
    marginBottom: theme.spacing(1) / 3,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyTextContainer: {
    margin: theme.spacing(2),
  },
}));

export default BookingList;
