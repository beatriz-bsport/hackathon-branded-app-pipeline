// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';

import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import type { Member } from '../../member/types';
import type { Offer } from '../../offer/types';
import { anonymizeEmail, anonymizeName } from '../../member/utils';
import { getSpotDisplayText } from '../utils';
import type { Booking } from '#src/libs/booking/types.ts';
import { trackTabletCheckInCheckinButtonClickedEvent } from '#src/events/booking/trackers.ts';
import { analyticsClientB2B } from '#src/components/analytics/mixpanel';

type Props = {
  t: TFunction,
  classes: Object,
  member: Member,
  bookingAttendance: boolean,
  offer: Offer,
  confirmAttendance: () => void,
  booking: Booking,
};

export const CheckInBookingItem = (props: Props) => {
  const {
    classes,
    member,
    t,
    bookingAttendance,
    confirmAttendance,
    booking,
    offer,
  } = props;

  const secondaryTextEmail = member?.consumer
    ? anonymizeEmail(member.consumer.email)
    : ' - ';

  const secondarytextSpot =
    offer?.room_blueprint && booking
      ? getSpotDisplayText(booking.spot_id, booking.spot_information, t)
      : '';

  const handleConfirmAttendance = () => {
    try {
      analyticsClientB2B.track(
        trackTabletCheckInCheckinButtonClickedEvent({
          offer_id: offer.id,
        }),
      );
    } catch (error) {
      console.error('Error while tracking checkIn button clicked event:', {
        error,
        offerId: offer?.id,
      });
    }
    confirmAttendance();
  };

  if (!member) {
    return null;
  }

  return (
    <ListItem dense className={classes.listItem}>
      <ListItemAvatar>
        <Avatar alt={member.name} src={member.photo} />
      </ListItemAvatar>
      <ListItemText
        primary={`${member.first_name} ${anonymizeName(member.last_name)}`}
        secondary={`${secondaryTextEmail || ''} ${secondarytextSpot}`}
      />
      <ListItemSecondaryAction>
        {bookingAttendance ? (
          <Button
            disabled
            className={classes.button}
            size="small"
            variant="contained"
          >
            <DoneIcon className={classes.buttonIcon} />
            {t('memberList.checkedIn')}
          </Button>
        ) : (
          <Button
            className={classes.button}
            color="secondary"
            onClick={handleConfirmAttendance}
            size="small"
            variant="contained"
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
export default withTranslation(['selfCheckIn'])(
  withStyles(style)(CheckInBookingItem),
);
