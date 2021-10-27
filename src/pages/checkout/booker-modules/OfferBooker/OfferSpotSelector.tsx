import React from 'react';
import SpotSelectorDialog from '../../../../libs/spot-scheduling/component/SpotSelector/SpotSelectorDialog.component';
import { OfferData } from '../../../../libs/booker-module/types';
import { Offer, OfferStatus } from '../../../../libs/offer/types';
import {
  AssetForBlueprint,
  RoomBlueprint,
} from '../../../../libs/spot-scheduling/types';

interface Props {
  offer: Offer<any, any, any>;
  selectedOffer: OfferData[];
  roomBlueprintsById: { [key: string]: RoomBlueprint };
  assetByIdBlueprintByIdentifier: {
    [key: string]: { [key: string]: AssetForBlueprint };
  };
  onCancel: () => void;
  offerStatusById: { [key: string]: OfferStatus };
  onSubmit: (spotForOffer: { offer: number; spot: number }[]) => void;
  refreshOfferStatus: (offerId: number) => void;
}

interface State {
  spotForOffers: { offer: Offer; spot?: number }[];
  currentOffer: number;
}

class OfferSpotSelector extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const spotForOffers: State['spotForOffers'] = [];
    const offers = [props.offer, ...props.selectedOffer.map((d) => d.offer)];

    offers.forEach((o) => {
      if (o.room_blueprint) {
        spotForOffers.push({ offer: o });
      }
    });

    this.state = {
      spotForOffers,
      currentOffer: 0,
    };
  }

  onSelectSpot = (offerId: number, spot: number) => {
    this.props.refreshOfferStatus(offerId);
    if (typeof spot !== 'number') {
      console.warn('Spot id should be a number');
    }

    this.setState((prevState) => {
      const spotForOffers = [...prevState.spotForOffers];
      const index = spotForOffers.findIndex(
        (data) => data.offer.id === offerId,
      );

      if (index !== -1) {
        spotForOffers[index].spot = spot;
      }

      return {
        spotForOffers,
      };
    });
  };

  onSubmit = () => {
    if (this.state.currentOffer < this.state.spotForOffers.length - 1) {
      this.setState((prevState) => ({
        currentOffer: prevState.currentOffer + 1,
      }));
      return;
    }
    this.props.onSubmit(
      this.state.spotForOffers.map((spotForOffer) => ({
        ...spotForOffer,
        offer: spotForOffer.offer.id,
      })),
    );
  };

  render() {
    const spotForOffer = this.state.spotForOffers[this.state.currentOffer];

    if (spotForOffer) {
      const offer = spotForOffer.offer;
      const roomBlueprint = this.props.roomBlueprintsById[offer.room_blueprint];
      const assets = this.props.assetByIdBlueprintByIdentifier[
        roomBlueprint?.id
      ];

      const offerStatus = this.props.offerStatusById[offer.id];
      const takenSpot = offerStatus?.taken_spots || [];
      const selectedSpot = spotForOffer.spot;

      return (
        <SpotSelectorDialog
          open
          offer={offer}
          roomBlueprint={roomBlueprint}
          assets={assets}
          onClose={this.props.onCancel}
          onSubmit={this.onSubmit}
          takenSpot={takenSpot}
          selectedSpot={selectedSpot}
          onSelectSpot={(spot) => this.onSelectSpot(offer.id, spot)}
          forceFullScreen
        />
      );
    }

    return null;
  }
}

export default OfferSpotSelector;
