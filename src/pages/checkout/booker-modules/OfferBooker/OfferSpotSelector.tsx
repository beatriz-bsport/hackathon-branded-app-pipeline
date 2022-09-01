import React, { useState } from 'react';
import SpotSelectorDialog from '../../../../libs/spot-scheduling/component/SpotSelector/SpotSelectorDialog.component';
import { Offer, OfferStatus } from '../../../../libs/offer/types';
import {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
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
  spotTypes: SpotType[];
}

const OfferSpotSelector = (props: Props) => {
  const { offer } = props;
  const [selectedSpotTypeId, setSelectedSpotTypeId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const onSelectSpot = (offerId: number, index: number, spotTypeId: number) => {
    props.refreshOfferStatus(offerId);
    setSelectedSpotTypeId(spotTypeId);
    setSelectedIndex(index);
  };

  const selectedSpotType = props.spotTypes.filter(
    (spotType) => spotType.id === selectedSpotTypeId,
  )[0];

  const onSubmit = () => {
    props.updateSpotsForOffer(offer.id, selectedIndex);
    setSelectedIndex(null);
  };

  const roomBlueprint = props.roomBlueprintsById[offer.room_blueprint];
  const assets = props.assetByIdBlueprintByIdentifier[roomBlueprint?.id];
  const offerStatus = props.offerStatusById[offer.id];

  const takenSpot = offerStatus?.taken_spots || [];

  const spotTypesIdOfBlueprint = roomBlueprint?.canvas.elements.map(
    (element) => element.data.spotTypeId,
  );

  const selectedIndexType = roomBlueprint?.canvas.elements
    .filter((element) => element.data.index <= selectedIndex)
    .map((element) => element.data.spotTypeId)
    .filter((id) => id === selectedSpotTypeId).length;

  return (
    <SpotSelectorDialog
      open
      offer={offer}
      roomBlueprint={roomBlueprint}
      assets={assets}
      onClose={props.onCancel(offer)}
      onSubmit={onSubmit}
      takenSpot={takenSpot}
      selectedSpot={selectedSpotType}
      selectedIndex={selectedIndex}
      selectedIndexType={selectedIndexType}
      onSelectSpot={(index, spotTypeId) =>
        onSelectSpot(offer.id, index, spotTypeId)
      }
      spotTypesOfBlueprint={props.spotTypes.filter((spotType) =>
        spotTypesIdOfBlueprint?.includes(spotType.id),
      )}
      fetchSpotForBlueprint={props.fetchSpotForBlueprint}
      forceFullScreen
    />
  );
};

export default OfferSpotSelector;
