import React from 'react';

import SpotSelectorDialog from './SpotSelectorDialog.component';
import { Offer, OfferStatus } from '../../../offer/types';
import { OptionCallback } from '../../../../state/types';
import { AssetForBlueprint, RoomBlueprint, SpotType } from '../../types';
import {
  DEFAULT_SPOT_TYPE_ID,
  getSpotIndexType,
} from '#libs/spot-scheduling/utils';

export const asyncSelectSpotForBlueprint = (offerId?: number) => {
  return new Promise((resolve, reject) => {
    if (_setup) {
      try {
        const callback = (res: number) => resolve(res);
        _setup(callback, offerId);
      } catch (err) {
        reject(err);
      }
    }
    return undefined;
  });
};

let _setup: (
  callback: (res: number | undefined) => void,
  offerId?: number,
) => void;

interface OwnProps {
  offer?: Offer;
  fetchAssetForBlueprint: (data: { blueprint: number }) => void;
  fetchRoomBlueprintDetail: (id: number) => void;
  fetchOfferById: (id: number, options: OptionCallback) => void;
  fetchOfferStatus: (id: number) => void;
  offerStatusById: { [id: number]: OfferStatus };

  roomBlueprintById: { [id: number]: RoomBlueprint };
  assetsForBlueprintById: { [id: number]: AssetForBlueprint };
}

type Props = OwnProps;

interface State {
  open: boolean;
  selectedIndex: null | number;
  selectedSpotTypeId: null | number;
  offer: Offer;
}

export class AsyncSelectSpotForBlueprint extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    open: false,
    offer: null,
    selectedSpotTypeId: null,
    selectedIndex: null,
  };

  callback: (spot: number | undefined) => void;

  constructor(props: Props) {
    super(props);

    this._setup = this._setup.bind(this);
    _setup = this._setup;
  }

  componentDidMount = () => {
    if (this.props.offer) {
      this.fetchData(this.props.offer);
    }
  };

  fetchData = (_offer: number | Offer) => {
    const id = typeof _offer === 'number' ? _offer : _offer.id;

    this.props.fetchOfferById(id, {
      // @ts-expect-error
      onSuccess: (offer: Offer) => {
        this.setState({ offer });
        if (offer.room_blueprint) {
          this.props.fetchRoomBlueprintDetail(offer.room_blueprint);
          this.props.fetchAssetForBlueprint({
            blueprint: offer.room_blueprint,
          });
        }
      },
    });

    this.props.fetchOfferStatus(id);
  };

  _setup = (callback: (res: number | undefined) => void, offerId?: number) => {
    this.callback = callback;
    offerId && this.fetchData(offerId);
    this.setState({ open: true });
  };

  onSelectSpot = (index: number, spotTypeId: number) => {
    this.setState({ selectedSpotTypeId: spotTypeId, selectedIndex: index });
  };

  onSubmit = () => {
    if (this.state.selectedIndex !== null) {
      const spot_id = this.state.selectedIndex;
      this.setState(
        {
          open: false,
          selectedSpotTypeId: null,
          selectedIndex: null,
          offer: null,
        },
        () => {
          this.callback && this.callback(spot_id);
        },
      );
    }
  };

  onClose = () => {
    // @ts-expect-error
    this.props.onCancelRegisterMember();
    this.setState(
      {
        open: false,
        selectedSpotTypeId: null,
        selectedIndex: null,
        offer: null,
      },
      () => {
        this.callback && this.callback(undefined);
      },
    );
  };

  render() {
    const offer = this.props.offer || this.state.offer;

    const takenSpot = this.props.offerStatusById[offer?.id]?.taken_spots || [];

    const roomBlueprint = this.props.roomBlueprintById[offer?.room_blueprint];

    const spotTypesIdOfBlueprint = roomBlueprint?.canvas?.elements
      ?.filter((element) => element.type === 'spot')
      .map((element) => element.data.spotTypeId || DEFAULT_SPOT_TYPE_ID);

    if (!this.state.open) {
      return null;
    }

    // @ts-expect-error
    const selectedSpotType = this.props.spotTypes.filter(
      (spotType: SpotType) => spotType.id === this.state.selectedSpotTypeId,
    )[0];

    const selectedIndexType = getSpotIndexType(
      roomBlueprint,
      this.state.selectedIndex,
    );

    return (
      <SpotSelectorDialog
        // @ts-expect-error
        assets={this.props.assetsForBlueprintById[offer?.room_blueprint]}
        // @ts-expect-error
        fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
        offer={offer}
        onClose={this.onClose}
        onSelectSpot={this.onSelectSpot}
        onSubmit={this.onSubmit}
        open={this.state.open}
        roomBlueprint={this.props.roomBlueprintById[offer?.room_blueprint]}
        selectedIndex={this.state.selectedIndex}
        selectedIndexType={selectedIndexType}
        selectedSpot={selectedSpotType}
        // @ts-expect-error
        spotTypesOfBlueprint={this.props.spotTypes.filter((spotType) =>
          spotTypesIdOfBlueprint?.includes(spotType.id),
        )}
        takenSpot={takenSpot}
      />
    );
  }
}

export default AsyncSelectSpotForBlueprint;
