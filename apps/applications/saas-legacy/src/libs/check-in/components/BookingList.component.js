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
import type { Booking } from '#src/libs/booking/types.ts';

const likeAudio = new Audio(boop);

const playSound = (audioFile) => {
  audioFile.play();
};

type Props = {
  bookingLoading: boolean,
  offer: Offer,
  bookings: Booking[],
  onAddMember: () => void,
  confirmBookingAttendance: (bookingId: number) => void,
  getMember: (id: number) => Member,
};

export const BookingList: React.FC<Props> = ({
  bookingLoading,
  offer,
  bookings,
  onAddMember,
  confirmBookingAttendance,
  getMember,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['selfCheckIn']);

  const isOfferFull = React.useMemo(() => {
    return offer?.is_full;
  }, [offer]);

  return (
    <div>
      <List disablePadding>
        {bookingLoading ? (
          <LinearProgress />
        ) : (
          <ListItem
            button
            className={classes.registerListItem}
            disabled={isOfferFull}
            onClick={() => onAddMember()}
          >
            <ListItemAvatar>
              <AddIcon />
            </ListItemAvatar>
            <ListItemText
              primary={
                isOfferFull
                  ? t('offerDetail.isFull')
                  : t('offerDetail.register')
              }
            />
          </ListItem>
        )}
        {(bookings || []).map((booking) => (
          <CheckInBookingItem
            key={booking.id}
            booking={booking}
            bookingAttendance={booking.attendance}
            confirmAttendance={() => {
              playSound(likeAudio);
              confirmBookingAttendance(booking.id);
            }}
            member={getMember(booking.member)}
            offer={offer}
          />
        ))}
      </List>
      {(bookings ?? []).length === 0 && !bookingLoading ? (
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
