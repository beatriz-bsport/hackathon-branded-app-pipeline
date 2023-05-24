import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import ApartmentIcon from '@material-ui/icons/Apartment';
import VideocamIcon from '@material-ui/icons/Videocam';
import { Offer } from '#libs/offer/types';
import { Booking } from '#libs/booking/types';
import ToolTip from '#components/Tooltip.component';

type Props = {
  offer: Offer;
  linkedHybridSession?: Offer | null;
  bookings: Booking[];
  showOfferGender?: boolean;
};

export const OfferCardStastistics: React.FC<Props> = React.memo(
  ({ offer, bookings, showOfferGender, linkedHybridSession }) => {
    const { t } = useTranslation('offer');
    const classes = useStyles();

    const {
      nb_bookings,
      nb_option,
      waiting_list_max_size,
      effectif,
      group,
      female,
      male,
      other,
    } = offer;

    const {
      nb_bookings: nb_bookings_hyrid_session,
      nb_option: nb_option_hybrid_session,
      waiting_list_max_size: waiting_list_max_size_hybrid_session,
      effectif: effectif_hybrid_session,
      group: group_hybrid_session,
      female: female_hybrid_session,
      male: male_hybrid_session,
      other: other_hybrid_session,
    } = linkedHybridSession || {};

    const numberOfBookings =
      nb_bookings ||
      bookings?.filter(
        (booking) => booking.booking_status_code === BOOKING_STATUS_OK.id,
      )?.length ||
      0;

    const occupancyRate =
      parseInt(((numberOfBookings / effectif) * 100 || '0').toString(), 10) ||
      0;
    const occupancyRateHybridSession =
      parseInt(
        (
          (nb_bookings_hyrid_session / effectif_hybrid_session) * 100 || '0'
        ).toString(),
        10,
      ) || 0;

    const numberOfBookingOptions = nb_option || 0;
    const numberOfBookingOptionsHybridSession = nb_option_hybrid_session || 0;

    return (
      <>
        {!!linkedHybridSession && (
          <div className={classes.hybridLabelContainer}>
            {offer.is_broadcast ? (
              <ToolTip title={t('broadcast')}>
                <VideocamIcon />
              </ToolTip>
            ) : (
              <ToolTip title={t('onSite')}>
                <ApartmentIcon />
              </ToolTip>
            )}
          </div>
        )}
        <div
          className={classNames(classes.statContainer, {
            [classes.divider]: !!linkedHybridSession,
          })}
        >
          <div className={classNames(classes.rightBorder, classes.stat)}>
            <div>
              <Typography variant="h3" color="primary" align="center">
                {numberOfBookings}
                {`/${effectif}`}
              </Typography>
            </div>
            {showOfferGender ? (
              <Typography variant="caption" align="center">
                {t('booking.confirmed')} (&#9792;{female}
                {`/${male}`}&#9794;+
                {other})
              </Typography>
            ) : (
              <Typography variant="caption" align="center">
                {t('booking.confirmed')}
              </Typography>
            )}
          </div>
          <div className={classNames(classes.rightBorder, classes.stat)}>
            <Typography variant="h3" color="secondary" align="center">
              {occupancyRate} %
            </Typography>
            <Typography align="center" variant="caption">
              {t('booking.fillRate')}
            </Typography>
          </div>
          {!group && (
            <div className={classes.stat}>
              <Typography
                variant="h3"
                color={numberOfBookingOptions ? 'error' : 'secondary'}
                align="center"
              >
                {numberOfBookingOptions}
                {`/${waiting_list_max_size}`}
              </Typography>
              <Typography variant="caption" align="center">
                {t('booking.waiting')}
              </Typography>
            </div>
          )}
        </div>

        {!!linkedHybridSession && (
          <>
            <div className={classes.hybridLabelContainer}>
              {linkedHybridSession.is_broadcast ? (
                <ToolTip title={t('broadcast')}>
                  <VideocamIcon />
                </ToolTip>
              ) : (
                <ToolTip title={t('onSite')}>
                  <ApartmentIcon />
                </ToolTip>
              )}
            </div>
            <div className={classes.statContainer}>
              <div className={classNames(classes.rightBorder, classes.stat)}>
                <div>
                  <Typography variant="h3" color="primary" align="center">
                    {nb_bookings_hyrid_session}
                    {`/${effectif_hybrid_session}`}
                  </Typography>
                </div>
                {showOfferGender ? (
                  <Typography variant="caption" align="center">
                    {t('booking.confirmed')} (&#9792;{female_hybrid_session}
                    {`/${male_hybrid_session}`}&#9794;+
                    {other_hybrid_session})
                  </Typography>
                ) : (
                  <Typography variant="caption" align="center">
                    {t('booking.confirmed')}
                  </Typography>
                )}
              </div>
              <div className={classNames(classes.rightBorder, classes.stat)}>
                <Typography variant="h3" color="secondary" align="center">
                  {occupancyRateHybridSession} %
                </Typography>
                <Typography align="center" variant="caption">
                  {t('booking.fillRate')}
                </Typography>
              </div>
              {!group_hybrid_session && (
                <div className={classes.stat}>
                  <Typography
                    variant="h3"
                    color={
                      numberOfBookingOptionsHybridSession
                        ? 'error'
                        : 'secondary'
                    }
                    align="center"
                  >
                    {numberOfBookingOptionsHybridSession}
                    {`/${waiting_list_max_size_hybrid_session}`}
                  </Typography>
                  <Typography variant="caption" align="center">
                    {t('booking.waiting')}
                  </Typography>
                </div>
              )}
            </div>
          </>
        )}
      </>
    );
  },
);

const useStyles = makeStyles((theme: Theme) => ({
  statContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderTop: '1px solid #EEEEEE',
  },
  divider: {
    borderBottom: '1px solid #EEEEEE',
  },

  rightBorder: {
    borderRight: '1px solid #EEEEEE',
  },
  stat: {
    flex: 3,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hybridLabelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

export default OfferCardStastistics;
