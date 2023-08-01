import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import ApartmentIcon from '@material-ui/icons/Apartment';
import VideocamIcon from '@material-ui/icons/Videocam';
import { Offer } from '#libs/offer/types';
import { Booking } from '#libs/booking/types';
import ToolTip from '#components/Tooltip.component';
import OfferCardStatistics from './OfferCardStatistics.component';

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
      female,
      male,
      other,
    } = offer;

    const {
      nb_bookings: nb_bookings_hybrid_session,
      nb_option: nb_option_hybrid_session,
      waiting_list_max_size: waiting_list_max_size_hybrid_session,
      effectif: effectif_hybrid_session,
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

    const numberOfBookingOptionsHybridSession = nb_option_hybrid_session || 0;

    return (
      <div className={classes.container}>
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
        <OfferCardStatistics
          effectif={effectif}
          female={female}
          male={male}
          nbOptions={numberOfBookingOptionsHybridSession}
          numberOfBookings={numberOfBookings}
          other={other}
          showOfferGender={showOfferGender}
          waitingListMaxSize={waiting_list_max_size}
        />

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
            <OfferCardStatistics
              effectif={effectif_hybrid_session}
              female={female_hybrid_session}
              male={male_hybrid_session}
              nbOptions={nb_option}
              numberOfBookings={nb_bookings_hybrid_session}
              other={other_hybrid_session}
              showOfferGender={showOfferGender}
              waitingListMaxSize={waiting_list_max_size_hybrid_session}
            />
          </>
        )}
      </div>
    );
  },
);

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
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
