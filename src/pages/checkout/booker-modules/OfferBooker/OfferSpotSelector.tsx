import React, { useState } from 'react';
import SpotSelectorDialog from '../../../../libs/spot-scheduling/component/SpotSelector/SpotSelectorDialog.component';
import { Offer, OfferStatus } from '../../../../libs/offer/types';
import {
  AssetForBlueprint,
  RoomBlueprint,
} from '../../../../libs/spot-scheduling/types';

interface Props {
  offer: Offer<any, any, any>;
  updateSpotsForOffer: (offerId: number, spot: number) => void;
  roomBlueprintsById: { [key: string]: RoomBlueprint };
  assetByIdBlueprintByIdentifier: {
    [key: string]: { [key: string]: AssetForBlueprint };
  };
  onCancel: (offer: Offer) => () => void;
  offerStatusById: { [key: string]: OfferStatus };
  refreshOfferStatus: (offerId: number) => void;
}

const OfferSpotSelector = (props: Props) => {
  const { offer } = props;
  const [selectedSpot, setSelectedSpot] = useState(null);

  const onSelectSpot = (offerId: number, spot: number) => {
    props.refreshOfferStatus(offerId);
    if (typeof spot !== 'number') {
      console.warn('Spot id should be a number');
    }
    setSelectedSpot(spot);
  };

  const onSubmit = () => {
    props.updateSpotsForOffer(offer.id, selectedSpot);
    setSelectedSpot(null);
  };

  const roomBlueprint = props.roomBlueprintsById[offer.room_blueprint];
  const assets = props.assetByIdBlueprintByIdentifier[roomBlueprint?.id];
  const offerStatus = props.offerStatusById[offer.id];
  const takenSpot = offerStatus?.taken_spots || [];

  return (
    <SpotSelectorDialog
      open
      offer={offer}
      roomBlueprint={roomBlueprint}
      assets={assets}
      onClose={props.onCancel(offer)}
      onSubmit={onSubmit}
      takenSpot={takenSpot}
      selectedSpot={selectedSpot}
      onSelectSpot={(spot) => onSelectSpot(offer.id, spot)}
      forceFullScreen
    />
  );
};

export default OfferSpotSelector;
