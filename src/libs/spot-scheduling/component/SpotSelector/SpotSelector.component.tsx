import React from 'react';
import CanvasEditor from '../../CanvasSvg/CanvasEditor.component';
import { CANVAS_SELECTABLE_TOOLS } from '../../CanvasSvg/tools/CanvasStrategy';
import { AssetForBlueprint, RoomBlueprint } from '../../types';
import { CanvasElement } from '../../CanvasSvg/tools/BaseClasses/Base.tool';
import SpotSchedulingHelper from '../../utils';

interface Props {
  roomBlueprint: RoomBlueprint;
  assets: { [identifier: string]: AssetForBlueprint };
  takenSpot: number[];
  onSelectSpot: (spot: number) => void;
  selectedSpot?: number;
  onSelectTakenSpot: () => void;
  coach?: any;
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
        this.props.onSelectSpot(element.data.index);
      } else {
        this.props.onSelectTakenSpot();
      }
    }
  };

  render() {
    return (
      <CanvasEditor
        blueprints={[]}
        selectedRoomBlueprint={this.getRoomBlueprint()}
        assets={this.props.assets}
        selectedTool={CANVAS_SELECTABLE_TOOLS.spot_selector}
        disableEdit
        onSelectElement={this.onSelectElement}
        coach={this.props.coach}
      />
    );
  }
}
