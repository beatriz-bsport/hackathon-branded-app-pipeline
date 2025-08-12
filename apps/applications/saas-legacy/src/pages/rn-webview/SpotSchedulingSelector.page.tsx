import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';

import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';

import {
  retrieveOffer as fetchOffer,
  fetchOfferStatus as fetchOfferStatusAction,
} from '#src/libs/offer/actions';
import {
  getOfferById,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '#src/libs/offer/selectors';

import { fetchCompanyTheme } from '#src/libs/theme/actions';
import { fetchMarketplaceSettings } from '#src/libs/marketplace/actions';

import { fetchCoachBulk } from '#src/libs/associated-coach/actions';
import { fetchEstablishmentBulk } from '#src/libs/establishment/actions';

import {
  getSpotTypesOfCompany,
  getAssetByBlueprintByIdentifier,
} from '#src/libs/spot-scheduling/selector';
import {
  fetchSpotForBlueprint,
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
} from '#src/libs/spot-scheduling/actions';
import { DEFAULT_SPOT_TYPE_ID } from '#src/libs/spot-scheduling/utils';
import MarketplaceSpotSelector from '#src/libs/marketplace/components/@SpotScheduling/MarketplaceSpotSelector';

import { fetchCurrentBasket as fetchCurrentBasketAction } from '#src/libs/checkout/actions';
import { getCurrentBasket } from '#src/libs/checkout/selectors';

import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { OffersGroup } from '#src/libs/group-offer/types';
import type { Offer } from '#src/libs/offer/types';
import type { SpotType } from '#src/libs/spot-scheduling/types';
import type { RootState } from '../../reducers';
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
  offerStatusWasFirstFetched: boolean;
};

type Props = OwnProps & ParamsToProps & ConnectedProps<typeof connector>;
const DEFAULT_SPOT_TYPE = { id: -1 };

export class SpotSchedulingSelector extends Component<Props, State> {
  state: State = {
    selectedSpotId: null,
    selectedSpot: undefined,
    offerStatusWasFirstFetched: false,
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
    window?.ReactNativeWebView?.postMessage(JSON.stringify(message));
  };

  getSpotExpirationDatetime = () => {
    return this.getCheckoutItemRelatedToOfferSpot()?.expiration_datetime;
  };

  // @ts-expect-error
  getIsGuestBooking = () => this.props.queryParams?.guest_booking === 'true';

  fetchOfferStatus = () => {
    if (this.props.offerId) {
      this.props.fetchOfferStatus(
        this.props.offerId,
        {
          booking_for_invitee_only: this.getIsGuestBooking(),
        },
        {
          onSuccess: () => this.setState({ offerStatusWasFirstFetched: true }),
        },
      );
    }
  };

  goTocheckout = () => {
    const message = {
      type: 'spot-scheduling-selector::go-to-checkout',
    };
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
    let suffix = '';

    if (this.props.spotTypes && spot?.spotTypeId !== DEFAULT_SPOT_TYPE_ID) {
      prefix =
        this.props.spotTypes?.find?.(
          (spotType) => spotType.id === spot.spotTypeId,
        )?.prefix ?? '';
      suffix =
        this.props.spotTypes?.find?.(
          (spotType) => spotType.id === spot.spotTypeId,
        )?.suffix ?? '';
    }

    const selectedSpot = prefix + (spot.indexType ?? index).toString() + suffix;

    this.setState({
      selectedSpot,
      selectedSpotId: index,
    });
  };

  render() {
    if (
      !this.props.offer ||
      this.props.offerIsLoading ||
      (!this.state.offerStatusWasFirstFetched &&
        this.props.offerStatusIsLoading)
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
