import { CANVAS_SELECTABLE_TOOLS } from './CanvasSvg/tools/CanvasStrategy';
import { CanvasSpotProps } from './CanvasSvg/tools/Spot/CanvasSpot.component';
import { RoomBlueprint, SpotType } from './types';

export const DEFAULT_SPOT_TYPE_ID = -1;

export default class SpotSchedulingHelper {
  static canvasTransformer = (params: {
    roomBlueprint: RoomBlueprint;
    takenSpot?: number[];
    selectedSpot?: number;
  }) => {
    const _elements = params.roomBlueprint.canvas.elements || [];
    const coachHeight = params.roomBlueprint.canvas.coachHeight || 1;
    const elements = _elements.map((el) => {
      if (el.type === CANVAS_SELECTABLE_TOOLS.spot) {
        const data = { ...el.data } as CanvasSpotProps;
        if (params.takenSpot && params.takenSpot.includes(el.data.index)) {
          data.taken = true;
          if (data.asset_identifier) {
            data.asset_identifier = 'spot_taken';
          }
        }

        if (params.selectedSpot === data.index) {
          data.selected = true;
          if (data.asset_identifier) {
            data.asset_identifier = 'spot_taken';
          }
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
      canvas: { elements, coachHeight },
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

export const getSpotIndexType = (
  roomBlueprint: RoomBlueprint,
  spotId: number,
) => {
  const spotTypeId =
    roomBlueprint?.canvas?.elements?.filter(
      (element) => element.data.index === spotId && element.type === 'spot',
    )[0]?.data?.spotTypeId || DEFAULT_SPOT_TYPE_ID;

  const indexType = roomBlueprint?.canvas.elements
    .filter(
      (element) => element.data.index <= spotId && element.type === 'spot',
    )
    .map((element) => element.data?.spotTypeId || DEFAULT_SPOT_TYPE_ID)
    .filter((id: number) => id === spotTypeId).length;
  return indexType;
};

export const getSpotType = (
  roomBlueprint: RoomBlueprint,
  spotId: number,
  spotTypes: SpotType[],
) => {
  const spotTypeId =
    roomBlueprint?.canvas?.elements?.filter(
      (element) => element.data.index === spotId && element.type === 'spot',
    )[0]?.data?.spotTypeId || DEFAULT_SPOT_TYPE_ID;

  const spotType = spotTypes.filter((spot) => spot?.id === spotTypeId)[0];
  return spotType;
};

export const getSpotTypeMinimal = (
  roomBlueprint: RoomBlueprint,
  spotId: number,
  spotTypes: SpotType[],
) => {
  const spotType = getSpotType(roomBlueprint, spotId, spotTypes);

  const indexType = getSpotIndexType(roomBlueprint, spotId);

  const spotInformation =
    spotType.customization === 'predefined'
      ? {
          name: spotType?.name || null,
          prefix: spotType?.prefix,
          indexType,
          shape: spotType?.shape,
          stroke: spotType?.stroke_color,
          fill: spotType?.fill_color,
        }
      : {
          name: spotType.name,
          shape: 'personalized',
          prefix: spotType?.prefix,
          indexType,
        };

  return spotInformation;
};
