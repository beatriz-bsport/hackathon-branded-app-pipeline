import React, { useCallback } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

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

  const {
    booking_type,
    booking,
    private_booking: privateBooking,
  } = nextBooking;

  switch (booking_type) {
    case 'booking': {
      const {
        spot_id: spotId,
        spot_information: spotInformation,
        is_spot_scheduling_enabled: isSpotSchedulingEnabled,
        coach_name,
      } = booking;

      const hasSpotSelected = typeof spotId === 'number';
      const displayDropDownArrow = isSpotSchedulingEnabled || !!coach_name;

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
              {`${DateTime.fromISO(booking.offer_date_start).toLocaleString(
                DateTime.TIME_SIMPLE,
              )} - ${DateTime.fromISO(booking.offer_date_start).toLocaleString(
                DateTime.DATE_SHORT,
              )}`}
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
              {isSpotSchedulingEnabled && (
                <div className={classes.spotInformation}>
                  <Typography color="textSecondary" variant="caption">
                    {/**
                     * Examples:
                     * - Spot: 1
                     * - Spot: A1
                     * - Spot: Cycle A1
                     */}
                    {hasSpotSelected
                      ? t('memberVisitDetails.spotName', {
                          spotName: `${`${spotInformation?.name} ` || ''}${
                            spotInformation.prefix
                          }${spotInformation.indexType}`,
                        })
                      : t('memberVisitDetails.noSpotAllocated')}
                  </Typography>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    case 'private_booking': {
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
              {`${DateTime.fromISO(date_start).toLocaleString(
                DateTime.TIME_SIMPLE,
              )} - ${DateTime.fromISO(date_start).toLocaleString(
                DateTime.DATE_SHORT,
              )}`}
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
  spotInformation: {
    display: 'flex',
  },
}));

export default React.memo(MemberVisitDetailsCardBookingSection);
