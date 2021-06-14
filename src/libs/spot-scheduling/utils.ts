import { CANVAS_SELECTABLE_TOOLS } from './CanvasSvg/tools/CanvasStrategy';
import { CanvasSpotProps } from './CanvasSvg/tools/Spot/CanvasSpot.component';
import { RoomBlueprint } from './types';

export default class SpotSchedulingHelper {
  static canvasTransformer = (params: {
    roomBlueprint: RoomBlueprint;
    takenSpot?: number[];
    selectedSpot?: number;
  }) => {
    const _elements = params.roomBlueprint.canvas.elements || [];
    const elements = _elements.map((el) => {
      if (el.type === CANVAS_SELECTABLE_TOOLS.spot) {
        const data = { ...el.data } as CanvasSpotProps;
        if (params.takenSpot && params.takenSpot.includes(el.data.index)) {
          data.asset_identifier = 'spot_taken';
        }

        if (params.selectedSpot === data.index) {
          data.selected = true;
        }

        return {
          ...el,
          data,
        };
      }

      return el;
    });

    const roomBlueprint: RoomBlueprint = {
      ...params.roomBlueprint,
      canvas: { elements },
    };

    return roomBlueprint;
  };

  static getSpotCount = (roomBlueprint: RoomBlueprint) => {
    if (
      roomBlueprint &&
      roomBlueprint.canvas &&
      roomBlueprint.canvas.elements
    ) {
      return roomBlueprint.canvas.elements.filter((el) => el.type === 'spot')
        .length;
    }

    return 0;
  };
}
