import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#hocs/company-custom-css.hoc';

import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#libs/exportable-components/actions';

import {
  retrieveOffer as fetchOffer,
  fetchOfferStatus as fetchOfferStatusAction,
} from '#libs/offer/actions';
import {
  getOfferById,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '#libs/offer/selectors';

import { fetchCompanyTheme } from '#libs/theme/actions';
import { fetchMarketplaceSettings } from '#libs/marketplace/actions';

import { fetchCoachBulk } from '#libs/associated-coach/actions';
import { fetchEstablishmentBulk } from '#libs/establishment/actions';

import {
  getSpotTypesOfCompany,
  getAssetByBlueprintByIdentifier,
} from '#libs/spot-scheduling/selector';
import {
  fetchSpotForBlueprint,
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
} from '#libs/spot-scheduling/actions';
import { DEFAULT_SPOT_TYPE_ID } from '#libs/spot-scheduling/utils';
import MarketplaceSpotSelector from '#marketplacecomponents/@SpotScheduling/MarketplaceSpotSelector';

import { fetchCurrentBasket as fetchCurrentBasketAction } from '#libs/checkout/actions';
import { getCurrentBasket } from '#libs/checkout/selectors';

import type { RootState } from '../../reducers';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { Establishment } from '#libs/establishment/types';
import type { Coach } from '#libs/associated-coach/types';
import type { OffersGroup } from '#libs/group-offer/types';
import type { Offer } from '#libs/offer/types';
import type { SpotType } from '#libs/spot-scheduling/types';
import './styles.css';

type ParamsToProps = {
  companyId: number;
  offerId: number;
};
type OwnProps = {
  title: string;
};
type State = {
  selectedSpotId: number | null;
  selectedSpot: string | undefined;
};

type Props = OwnProps & ParamsToProps & ConnectedProps<typeof connector>;
const DEFAULT_SPOT_TYPE = { id: -1 };

export class SpotSchedulingSelector extends Component<Props, State> {
  state: State = {
    selectedSpotId: null,
    selectedSpot: undefined,
  };

  componentDidMount() {
    if (this.props.companyId) {
      this.props.fetchCompanyTheme(this.props.companyId);
      this.props.retrieveCompanyCssConfiguration(this.props.companyId);
      this.props.fetchMarketplaceSettings(this.props.companyId.toString());
      this.props.fetchCurrentBasket(this.props.companyId);
    }

    if (this.props.offerId) {
      this.props.fetchOffer(this.props.offerId, {
        onSuccess: (offer) => {
          this.props.fetchCoachBulk([offer.coach, offer.coach_override]);
          this.props.fetchEstablishmentBulk([offer.establishment]);
          if (offer.room_blueprint !== null) {
            this.props.fetchRoomBlueprintDetail(offer.room_blueprint);
            this.props.fetchAssetForBlueprint({
              blueprint: offer.room_blueprint,
            });
            this.props.fetchSpotForBlueprint({
              company: this.props.companyId,
            });
          }
        },
      });
      this.fetchOfferStatus();
    }
  }

  closeSpotSelector = () => {
    const message = {
      type: 'spot-scheduling-selector::spot-selected',
      data: {
        selectedSpot: this.state.selectedSpot,
        selectedSpotId: this.state.selectedSpotId,
      },
    };
    // @ts-expect-error
    window?.ReactNativeWebView?.postMessage(JSON.stringify(message));
  };

  getSpotExpirationDatetime = () => {
    return this.getCheckoutItemRelatedToOfferSpot()?.expiration_datetime;
  };

  // @ts-expect-error
  getIsGuestBooking = () => this.props.queryParams?.guest_booking === 'true';

  fetchOfferStatus = () => {
    if (this.props.offerId) {
      this.props.fetchOfferStatus(this.props.offerId, {
        booking_for_invitee_only: this.getIsGuestBooking(),
      });
    }
  };

  goTocheckout = () => {
    const message = {
      type: 'spot-scheduling-selector::go-to-checkout',
    };
    // @ts-expect-error
    window?.ReactNativeWebView?.postMessage(JSON.stringify(message));
  };

  getCheckoutItemRelatedToOfferSpot = () => {
    if (this.props.basketIsLoading) return null;

    const offerCheckoutItem = this.props.basket?.checkout_items?.find(
      (checkoutItem) =>
        !!checkoutItem?.extra_data?.offers_data?.[0]?.extra_data?.spot_id &&
        // ParseInt is used below because of the offer_id being adding as the string the
        // the checkout-item extra-data from the mobile app.
        // @ts-expect-error
        parseInt(checkoutItem?.extra_data?.offers_data?.[0]?.offer_id) ===
          this.props.offerId,
    );
    return offerCheckoutItem;
  };

  getSpotCurrentlyInBasket = () => {
    const spotId =
      this.getCheckoutItemRelatedToOfferSpot()?.extra_data?.offers_data?.[0]
        ?.extra_data?.spot_id;

    return spotId?.toString();
  };

  updateSpotForOffer = (_: number, index: number) => {
    /* This method gets the selected spot in the canvas of plan to build the spot name with the right prefix */
    const spot =
      this.props.roomBlueprintsById?.[
        this.props.offer?.room_blueprint
      ].canvas?.elements?.find((element) => element.data.index === index)
        ?.data ?? '';

    let prefix = '';

    if (this.props.spotTypes && spot?.spotTypeId !== DEFAULT_SPOT_TYPE_ID) {
      prefix =
        this.props.spotTypes?.find?.(
          (spotType) => spotType.id === spot.spotTypeId,
        )?.prefix ?? '';
    }

    const selectedSpot = prefix + spot.indexType.toString();

    this.setState({
      selectedSpot,
      selectedSpotId: index,
    });
  };

  render() {
    if (
      !this.props.offer ||
      this.props.offerIsLoading ||
      this.props.offerStatusIsLoading
    ) {
      return null;
    }

    return (
      <div className="bs-new-offer-booking__spot-selector__blueprint--web-view">
        {this.props.roomBlueprintsById[this.props.offer.room_blueprint] && (
          <MarketplaceSpotSelector
            forceCloseOnSelectForMobile
            assetByIdBlueprintByIdentifier={
              this.props.assetByIdBlueprintByIdentifier
            }
            closeSpotSelector={this.closeSpotSelector}
            expirationDatetime={this.getSpotExpirationDatetime()}
            fetchOfferStatus={this.fetchOfferStatus}
            fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
            goToCheckout={this.goTocheckout}
            offer={this.props.offer}
            offerStatusById={this.props.offerStatusById}
            roomBlueprintsById={this.props.roomBlueprintsById}
            selectedSpot={this.state.selectedSpotId}
            spotCurrentlyInBasket={this.getSpotCurrentlyInBasket()}
            spotTypes={[DEFAULT_SPOT_TYPE as SpotType].concat(
              this.props.spotTypes,
            )}
            theme={this.props.companyTheme}
            updateSpotForOffer={this.updateSpotForOffer}
          />
        )}
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, { offerId }: ParamsToProps) => {
    const offer: Offer<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      OffersGroup
    > = withMetaActivity(withCoach(withEstablishment(getOfferById)))(
      state,
      offerId,
    );
    return {
      offer,
      offerStatusById: state.offer.offerStatus.byId,
      offerIsLoading: state.offer.retrieve.loading,
      offerStatusIsLoading: state.offer.offerStatus.loading,
      companyTheme: state.theme.theme,
      roomBlueprintsById: state.spotScheduling.roomBlueprint.byId,
      assetByIdBlueprintByIdentifier: getAssetByBlueprintByIdentifier(state),
      spotTypes: getSpotTypesOfCompany(state),
      basketIsLoading: state.checkout.basket.current.loading,
      basket: getCurrentBasket(state),
    };
  },
  {
    fetchCompanyTheme,
    retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
    fetchOffer,
    fetchMarketplaceSettings,
    fetchCoachBulk,
    fetchEstablishmentBulk,
    fetchSpotForBlueprint,
    fetchRoomBlueprintDetail,
    fetchAssetForBlueprint,
    fetchOfferStatus: fetchOfferStatusAction,
    fetchCurrentBasket: fetchCurrentBasketAction,
  },
);

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    offerId: 'offerId:number',
  }),
  connector,
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(SpotSchedulingSelector);
