import React from 'react';
import Immutable from 'seamless-immutable';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Divider } from '@material-ui/core';
import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { Offer } from '#libs/offer/types';
import { CheckoutItem } from '#libs/checkout/types';
import { CompanyTheme } from '#libs/theme/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import OfferSummary from '#libs/offer/OfferSummary';

type ActivitiesSummaryProps = {
  activitySummaryCheckoutItems: Array<CheckoutItem>;
  basketOffers: Array<Offer<number, Establishment, MetaActivity>>;
  companyTheme: CompanyTheme;
};

export const ActivitiesSummary: React.FC<ActivitiesSummaryProps> = ({
  activitySummaryCheckoutItems,
  basketOffers,
  companyTheme,
}) => {
  const classes = useStyles();

  const checkoutItemsWithDetails = React.useMemo(
    () =>
      activitySummaryCheckoutItems.map((checkoutItem) => {
        return Immutable({
          ...checkoutItem,
          offers: checkoutItem.extra_data?.offers_data?.map((offerData) =>
            basketOffers?.find(
              (offerDetail) => offerDetail.id === offerData.offer_id,
            ),
          ),
        });
      }),
    [activitySummaryCheckoutItems, basketOffers],
  );

  return (
    <div className={classes.activityContainer}>
      {checkoutItemsWithDetails?.map((checkoutItem, index) => (
        <div key={`checkout-item-details-${checkoutItem.id}`}>
          {checkoutItem.offers.map((offer) => (
            <OfferSummary
              key={`offer-summary-${offer?.id}`}
              establishment={offer?.establishment}
              metaActivity={offer?.meta_activity}
              offer={offer}
              theme={companyTheme}
              variant="basket"
            />
          ))}

          <div className={classes.subContainer}>
            <Typography
              className={classes.checkoutItemName}
              variant="subtitle2"
            >
              {checkoutItem.name}
            </Typography>
            <Typography
              className={classes.checkoutItemPriceClass}
              variant="subtitle2"
            >
              {getCurrencyDisplayWithPrice(checkoutItem.unit_price)}
            </Typography>
          </div>
          {index !== checkoutItemsWithDetails.length - 1 && (
            <Divider className={classes.divider} variant="middle" />
          )}
        </div>
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  activityContainer: {
    boxSizing: 'border-box',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: theme.palette.grey[100],
    borderRadius: '12px 12px 0 0',
    display: 'flex',
    flexDirection: 'column',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(
      1,
    )}px ${theme.spacing(2)}px`,
  },
  checkoutItemName: { fontWeight: 500 },
  checkoutItemPriceClass: {
    fontWeight: 500,
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.spacing(1),
    padding: '2px 8px 2px 8px',
  },
  divider: {
    borderColor: theme.palette.grey[100],
    borderWidth: '1px',
    margin: theme.spacing(1),
  },
}));

export default React.memo(ActivitiesSummary);
