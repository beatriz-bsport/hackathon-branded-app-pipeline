import React from 'react';
import Immutable from 'seamless-immutable';

import {
  createTheme,
  makeStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider';
import { Theme } from '@material-ui/core';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Establishment } from '#src/libs/establishment/types';
import { Offer, OfferSummaryVariant } from '#src/libs/offer/types';
import type {
  CheckoutItem,
  OnRemoveCheckoutItemData,
} from '#src/libs/checkout/types';
import { CompanyTheme } from '#src/libs/theme/types';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import OfferSummary from '#src/libs/offer/OfferSummary';
import SavedSpotCounddown from '#src/libs/checkout/components/new-checkout-flow/SavedSpotCountdown';
import { getGuestBookingName } from '#src/libs/marketplace/utils/booking';

import DeleteFromBasketDialogContent from '#src/libs/checkout/components/new-checkout-flow/ManageBasket/DeleteFromBasketDialogContent.component';
import ModalToDrawerSwitcher from '#src/components/Modal/ModalToDrawerSwitcher.component';

type ActivitiesSummaryProps = {
  activitySummaryCheckoutItems: CheckoutItem[];
  basketOffers: Offer<number, Establishment, MetaActivity>[];
  companyTheme: CompanyTheme;
  connectedToOtherComponents: boolean;
  basketLoading: boolean;
  handleCheckoutItemExpiration?: (checkoutItemId: string) => void;
  handleRemoveCheckoutItem?: (
    checkoutItemToRemoveData: OnRemoveCheckoutItemData,
  ) => void;
};

const drawerCustomTheme = createTheme({
  overrides: {
    MuiDrawer: {
      paperAnchorBottom: { borderRadius: '12px 12px 0px 0px' },
    },
  },
});

export const ActivitiesSummary: React.FC<ActivitiesSummaryProps> = ({
  activitySummaryCheckoutItems,
  basketOffers,
  companyTheme,
  connectedToOtherComponents,
  basketLoading,
  handleCheckoutItemExpiration,
  handleRemoveCheckoutItem,
}) => {
  const [passToRemove, setPassToRemove] = React.useState<CheckoutItem | null>(
    null,
  );
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

  const handlePassDeletion = React.useCallback(
    (offerId: number) => {
      const itemToRemove = activitySummaryCheckoutItems.find((checkoutItem) =>
        checkoutItem.extra_data.offers_data.find(
          (checkoutItemExtraDataIterator) =>
            checkoutItemExtraDataIterator.offer_id === offerId,
        ),
      );

      if (!itemToRemove) {
        throw new Error(
          'Could not found pass to remove linked to the offer ' + offerId,
        );
      }

      setPassToRemove(itemToRemove);
    },
    [setPassToRemove, activitySummaryCheckoutItems],
  );

  const handleCloseModal = React.useCallback(() => {
    setPassToRemove(null);
  }, [setPassToRemove]);

  const onRemovePassFromBasket = React.useCallback(() => {
    if (!passToRemove) {
      throw new Error(
        'Cannot find item to remove in basket. OfferId = ' + passToRemove.id,
      );
    }
    const checkoutItemToRemoveData: OnRemoveCheckoutItemData = {
      checkout_item: passToRemove.id,
      quantity: passToRemove.quantity,
    };
    handleRemoveCheckoutItem(checkoutItemToRemoveData);
    handleCloseModal();
  }, [passToRemove, handleRemoveCheckoutItem, handleCloseModal]);

  const isOpen = React.useMemo(() => {
    return passToRemove?.name !== null;
  }, [passToRemove]);

  if (activitySummaryCheckoutItems.length === 0) return null;

  return (
    <div className={classes.activityContainer}>
      {passToRemove !== null && (
        <MuiThemeProvider theme={drawerCustomTheme}>
          <ModalToDrawerSwitcher
            drawerAnchor="bottom"
            isOpen={isOpen}
            onClose={handleCloseModal}
          >
            <DeleteFromBasketDialogContent
              onClose={handleCloseModal}
              onConfirm={onRemovePassFromBasket}
              passName={passToRemove.name}
            />
          </ModalToDrawerSwitcher>
        </MuiThemeProvider>
      )}
      {checkoutItemsWithDetails?.map((checkoutItem, index) => (
        <React.Fragment key={`checkout-item-details-${checkoutItem.id}`}>
          {checkoutItem.details.map((offerDetail) => (
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
              onDelete={handlePassDeletion}
              spotId={offerDetail.spotName}
              theme={companyTheme}
              variant={OfferSummaryVariant.BASKET}
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

          {checkoutItem.expiration_datetime && !basketLoading && (
            <SavedSpotCounddown
              classes={{ [classes.expirationWarning]: true }}
              expirationDatetime={checkoutItem.expiration_datetime}
              onFinish={() => handleCheckoutItemExpiration(checkoutItem.id)}
            />
          )}

          {index !== checkoutItemsWithDetails.length - 1 && (
            <Divider className={classes.divider} variant="middle" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const useStyles = makeStyles<Theme, { connectedToOtherComponents: boolean }>(
  (theme: Theme) => ({
    activityContainer: {
      boxSizing: 'border-box',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: theme.palette.grey[100],
      borderRadius: (props) =>
        props.connectedToOtherComponents ? '12px 12px 0 0' : '12px',
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
    },
    subContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: theme.spacing(2),
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
    expirationWarning: {
      padding: theme.spacing(2),
    },
  }),
);

export default React.memo(ActivitiesSummary);
