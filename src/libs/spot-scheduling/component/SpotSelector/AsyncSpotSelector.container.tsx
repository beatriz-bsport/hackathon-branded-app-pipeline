import React from 'react';

import SpotSelectorDialog from './SpotSelectorDialog.component';
import { Offer, OfferStatus } from '../../../offer/types';
import { OptionCallback } from '../../../../state/types';
import { AssetForBlueprint, RoomBlueprint } from '../../types';

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
  selectedSpot: null | number;
  offer: Offer;
}

export class AsyncSelectSpotForBlueprint extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    open: false,
    selectedSpot: null,
    offer: null,
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
      onSuccess: (offer: Offer) => {
        this.setState({ offer });
        this.props.fetchRoomBlueprintDetail(offer.room_blueprint);
        this.props.fetchAssetForBlueprint({ blueprint: offer.room_blueprint });
      },
    });

    this.props.fetchOfferStatus(id);
  };

  _setup = (callback: (res: number | undefined) => void, offerId?: number) => {
    this.callback = callback;
    offerId && this.fetchData(offerId);
    this.setState({ open: true });
  };

  onSelectSpot = (spot_id: number) => {
    this.setState({ selectedSpot: spot_id });
  };

  onSubmit = () => {
    if (this.state.selectedSpot !== null) {
      const spot = this.state.selectedSpot;
      this.setState({ open: false, selectedSpot: null, offer: null }, () => {
        this.callback && this.callback(spot);
      });
    }
  };

  onClose = () => {
    this.setState({ open: false, selectedSpot: null, offer: null }, () => {
      this.callback && this.callback(undefined);
    });
  };

  render() {
    const offer = this.props.offer || this.state.offer;

    const takenSpot = this.props.offerStatusById[offer?.id]?.taken_spots || [];

    if (!this.state.open) {
      return null;
    }

    return (
      <SpotSelectorDialog
        offer={offer}
        roomBlueprint={this.props.roomBlueprintById[offer?.room_blueprint]}
        assets={this.props.assetsForBlueprintById[offer?.room_blueprint]}
        onClose={this.onClose}
        onSubmit={this.onSubmit}
        onSelectSpot={this.onSelectSpot}
        open={this.state.open}
        takenSpot={takenSpot}
        selectedSpot={this.state.selectedSpot}
      />
    );
  }
}

export default AsyncSelectSpotForBlueprint;
