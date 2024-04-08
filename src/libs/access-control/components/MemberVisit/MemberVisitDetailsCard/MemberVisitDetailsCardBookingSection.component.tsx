import React, { useCallback } from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import type { SpotInformation } from '#libs/spot-scheduling/types';
import type { Props as MemberVisitDetailsCardProps } from './MemberVisitDetailsCard.component';

const MemberVisitDetailsCardBookingSection: React.FC<
  Pick<MemberVisitDetailsCardProps, 'nextBooking'>
> = ({ nextBooking }) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleOpen = useCallback(() => setIsOpen((_isOpen) => !_isOpen), []);

  if (!nextBooking) {
    return <Typography color="textSecondary">{t('common:None')}</Typography>;
  }

  const { type, booking, privateBooking } = nextBooking;

  switch (type) {
    case 'booking': {
      const { spot_information, coach_name } = booking;
      const { name: spotName } = spot_information as SpotInformation;

      const displayDropDownArrow = !!spotName || !!coach_name;

      return (
        <div className={classes.bookingDetails}>
          <div className={classes.passInfo}>
            <div className={classes.bookingIntoTitle}>
              <Typography className={classes.infoField} variant="body1">
                {booking.name}
              </Typography>
              {displayDropDownArrow && (
                <IconButton onClick={toggleOpen} size="small">
                  {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              )}
            </div>
            <Typography color="textSecondary" variant="caption">
              {booking.establishment_name}
            </Typography>
            <Typography color="textSecondary" variant="caption">
              {moment(booking.offer_date_start).format('LLLL')}
            </Typography>
          </div>
          {isOpen && (
            <div className={classes.passInfo}>
              {!!coach_name && (
                <Typography color="textSecondary" variant="caption">
                  {t('memberVisitDetails.teacherName', {
                    coachName: coach_name,
                  })}
                </Typography>
              )}
              {!!spotName && (
                <Typography color="textSecondary" variant="caption">
                  {t('memberVisitDetails.spotName', {
                    spotName,
                  })}
                </Typography>
              )}
            </div>
          )}
        </div>
      );
    }
    case 'privateBooking': {
      const { establishment_name, coach_name, date_start, is_at_home, name } =
        privateBooking;

      const showDropDownArrow = !!coach_name;

      const bookingLocation =
        establishment_name || (is_at_home && t('memberVisitDetails.atHome'));

      return (
        <div className={classes.bookingDetails}>
          <div className={classes.passInfo}>
            <div className={classes.bookingIntoTitle}>
              <Typography className={classes.infoField} variant="body1">
                {name}
              </Typography>
              {showDropDownArrow && (
                <IconButton onClick={toggleOpen} size="small">
                  {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              )}
            </div>
            {!!bookingLocation && (
              <Typography color="textSecondary" variant="caption">
                {bookingLocation}
              </Typography>
            )}
            <Typography color="textSecondary" variant="caption">
              {moment(date_start).format('LLLL')}
            </Typography>
          </div>
          {isOpen && (
            <div className={classes.passInfo}>
              {!!coach_name && (
                <Typography color="textSecondary" variant="caption">
                  {t('memberVisitDetails.teacherName', {
                    coachName: coach_name,
                  })}
                </Typography>
              )}
            </div>
          )}
        </div>
      );
    }
    default:
      return null;
  }
};

const useStyles = makeStyles((theme) => ({
  infoField: {
    fontWeight: 500,
  },
  passInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  bookingIntoTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    flex: 1,
  },
}));

export default React.memo(MemberVisitDetailsCardBookingSection);
