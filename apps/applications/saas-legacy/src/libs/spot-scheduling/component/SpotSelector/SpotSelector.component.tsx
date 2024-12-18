import React from 'react';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
import CanvasEditor from '../../CanvasSvg/CanvasEditor.component';
import { CANVAS_SELECTABLE_TOOLS } from '../../CanvasSvg/tools/CanvasStrategy';
import type { AssetForBlueprint, RoomBlueprint, SpotType } from '../../types';
import { CanvasElement } from '../../CanvasSvg/tools/BaseClasses/Base.tool';
import SpotSchedulingHelper from '../../utils';

interface Props {
  roomBlueprint: RoomBlueprint;
  assets: { [identifier: string]: AssetForBlueprint };
  takenSpot: number[];
  onSelectSpot: (spot: number, spotTypeId: number) => void;
  selectedSpot?: number;
  onSelectTakenSpot?: () => void;
  coach?: any;
  isBoutiqueDisplay?: boolean;
  fetchSpotForBlueprint: (data: { company: number }) => void;
  spotTypesOfBlueprint: SpotType[];
  isMobile: boolean;
  onMouseOverSpot?: (spot: CanvasElement<any>) => void;
  coachDisplay?: MarketPlaceCoachDisplay;
}

export default class SpotSelector extends React.PureComponent<Props> {
  getRoomBlueprint = () => {
    return SpotSchedulingHelper.canvasTransformer({
      roomBlueprint: this.props.roomBlueprint,
      takenSpot: this.props.takenSpot,
      selectedSpot: this.props.selectedSpot,
    });
  };

  onSelectElement = (element: CanvasElement<any>) => {
    if (element.type === CANVAS_SELECTABLE_TOOLS.spot) {
      const spot = element.data.index;

      if (!this.props.takenSpot.includes(spot)) {
        this.props.onSelectSpot(
          element.data.index,
          element.data?.spotTypeId || -1,
        );
      } else {
        this.props.onSelectTakenSpot?.();
      }
    }
  };

  render() {
    return (
      <CanvasEditor
        disableEdit
        selectingSpot
        assets={this.props.assets}
        blueprints={[]}
        coach={this.props.coach}
        coachDisplay={this.props.coachDisplay}
        fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
        isBoutiqueDisplay={this.props.isBoutiqueDisplay}
        isMobile={this.props.isMobile}
        onMouseOverSpot={this.props.onMouseOverSpot}
        onSelectElement={this.onSelectElement}
        selectedRoomBlueprint={this.getRoomBlueprint()}
        selectedTool={CANVAS_SELECTABLE_TOOLS.spot_selector}
        spotTypes={this.props.spotTypesOfBlueprint}
      />
    );
  }
}
