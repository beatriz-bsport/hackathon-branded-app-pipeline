import React, { useState } from 'react';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
import {
  DEFAULT_SPOT_TYPE_ID,
  getSpotIndexType,
} from '#src/libs/spot-scheduling/utils';
import type { Coach } from '#src/libs/associated-coach/types';
import SpotSelectorDialog from '../../../../libs/spot-scheduling/component/SpotSelector/SpotSelectorDialog.component';
import { Offer, OfferStatus } from '../../../../libs/offer/types';
import {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
} from '../../../../libs/spot-scheduling/types';

interface Props {
  offer: Offer<Coach, any, any>;
  updateSpotsForOffer: (offerId: number, spot: number) => void;
  roomBlueprintsById: { [key: string]: RoomBlueprint };
  assetByIdBlueprintByIdentifier: {
    [key: string]: { [key: string]: AssetForBlueprint };
  };
  onCancel: (offer: Offer) => () => void;
  offerStatusById: { [key: string]: OfferStatus };
  refreshOfferStatus: (offerId: number) => void;
  spotTypes: SpotType[];
  coachDisplay?: MarketPlaceCoachDisplay;
}

const OfferSpotSelector = (props: Props) => {
  const { offer, coachDisplay } = props;
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

  const spotTypesIdOfBlueprint = roomBlueprint?.canvas?.elements
    ?.filter((element) => element.type === 'spot')
    ?.map((element) => element.data.spotTypeId || DEFAULT_SPOT_TYPE_ID);

  const selectedIndexType = getSpotIndexType(roomBlueprint, selectedIndex);

  return (
    <SpotSelectorDialog
      forceFullScreen
      open
      assets={assets}
      coachDisplay={coachDisplay}
      // @ts-expect-error
      fetchSpotForBlueprint={props.fetchSpotForBlueprint}
      // @ts-expect-error
      offer={offer}
      // @ts-expect-error
      onClose={props.onCancel(offer)}
      onSelectSpot={(index, spotTypeId) =>
        onSelectSpot(offer.id, index, spotTypeId)
      }
      onSubmit={onSubmit}
      roomBlueprint={roomBlueprint}
      selectedIndex={selectedIndex}
      selectedIndexType={selectedIndexType}
      selectedSpot={selectedSpotType}
      spotTypesOfBlueprint={props.spotTypes.filter((spotType) =>
        spotTypesIdOfBlueprint?.includes(spotType.id),
      )}
      takenSpot={takenSpot}
    />
  );
};

export default OfferSpotSelector;
