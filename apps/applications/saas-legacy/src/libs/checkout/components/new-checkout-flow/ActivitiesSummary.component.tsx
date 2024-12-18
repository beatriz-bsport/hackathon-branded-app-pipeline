import React from 'react';
import Immutable from 'seamless-immutable';

import { makeStyles } from '@material-ui/core/styles';
import { Divider, Theme, Typography } from '@material-ui/core';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Establishment } from '#src/libs/establishment/types';
import { Offer, OfferSummaryVariant } from '#src/libs/offer/types';
import type { CheckoutItem } from '#src/libs/checkout/types';
import { CompanyTheme } from '#src/libs/theme/types';
import OfferSummary from '#src/libs/offer/OfferSummary';
import SavedSpotCounddown from '#src/libs/checkout/components/new-checkout-flow/SavedSpotCountdown';
import { getGuestBookingName } from '#src/libs/marketplace/utils/booking';
import { useTranslation } from 'react-i18next';

type ActivitiesSummaryProps = {
  activitySummaryCheckoutItems: CheckoutItem[];
  basketOffers: Offer<number, Establishment, MetaActivity>[];
  companyTheme: CompanyTheme;
  connectedToOtherComponents: boolean;
  basketLoading: boolean;
  handleCheckoutItemExpiration?: (checkoutItemId: string) => void;
};

export const ActivitiesSummary: React.FC<ActivitiesSummaryProps> = ({
  activitySummaryCheckoutItems,
  basketOffers,
  companyTheme,
  connectedToOtherComponents,
  basketLoading,
  handleCheckoutItemExpiration,
}) => {
  const { t } = useTranslation('checkout');
  const classes = useStyles({ connectedToOtherComponents });

  const checkoutItemsWithDetails = React.useMemo(
    () =>
      activitySummaryCheckoutItems.map((checkoutItem) => {
        return Immutable({
          ...checkoutItem,
          details: checkoutItem.extra_data?.offers_data?.map((offerData) => ({
            offer: basketOffers?.find(
              (offerDetail) => offerDetail.id === offerData.offer_id,
            ),
            spotName: offerData.extra_data.spot_name,
          })),
        });
      }),
    [activitySummaryCheckoutItems, basketOffers],
  );

  if (activitySummaryCheckoutItems.length === 0) return null;

  return (
    <div className={classes.activityContainer}>
      <Typography className={classes.activityTitle} variant="h6">
        {t(`checkout:payment.selectedSession`)}
      </Typography>
      {checkoutItemsWithDetails?.map((checkoutItem) => (
        <React.Fragment key={`checkout-item-details-${checkoutItem.id}`}>
          {checkoutItem.details.map((offerDetail, index) => (
            <>
              <OfferSummary
                key={`offer-summary-${offerDetail.offer?.id}`}
                establishment={offerDetail.offer?.establishment}
                guestName={getGuestBookingName([checkoutItem])}
                isGuestBooking={
                  checkoutItem.extra_data?.offers_data?.[0].extra_data
                    ?.booking_for_invitee_only
                }
                metaActivity={offerDetail.offer?.meta_activity}
                offer={offerDetail.offer}
                spotId={offerDetail.spotName}
                theme={companyTheme}
                variant={OfferSummaryVariant.BASKET}
              />
              {index < checkoutItem.extra_data.offers_data.length - 1 && (
                <Divider className={classes.divider} variant="middle" />
              )}
            </>
          ))}
          {checkoutItem.expiration_datetime && !basketLoading && (
            <SavedSpotCounddown
              classes={{ [classes.expirationWarning]: true }}
              expirationDatetime={checkoutItem.expiration_datetime}
              onFinish={() => handleCheckoutItemExpiration(checkoutItem.id)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const useStyles = makeStyles<Theme, { connectedToOtherComponents: boolean }>(
  (theme: Theme) => ({
    activityTitle: {
      color: '#2D3748',
      fontSize: '20px',
    },
    activityContainer: {
      boxSizing: 'border-box',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: theme.palette.grey[100],
      borderRadius: (props) =>
        props.connectedToOtherComponents ? '12px 12px 0 0' : '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      padding: theme.spacing(2),
    },
    subContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: theme.spacing(2),
    },
    divider: {
      borderColor: theme.palette.grey[100],
      borderWidth: '1px',
      margin: theme.spacing(1),
    },
    expirationWarning: {
      padding: theme.spacing(2),
    },
  }),
);

export default React.memo(ActivitiesSummary);
