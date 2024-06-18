import { CANVAS_SELECTABLE_TOOLS } from './CanvasSvg/tools/CanvasStrategy';
import { CanvasSpotProps } from './CanvasSvg/tools/Spot/CanvasSpot.component';
import { RoomBlueprint, SpotType } from './types';

export const DEFAULT_SPOT_TYPE_ID = -1;
export const DEFAULT_SPOT_TYPE = { id: DEFAULT_SPOT_TYPE_ID };

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
          // @ts-expect-error
          if (data.asset_identifier) {
            // @ts-expect-error
            data.asset_identifier = 'spot_taken';
          }
        }

        if (params.selectedSpot === data.index) {
          data.selected = true;
          // @ts-expect-error
          if (data.asset_identifier) {
            // @ts-expect-error
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

  static getSpotCount = (roomBlueprint: RoomBlueprint) =>
    roomBlueprint?.canvas?.elements?.filter(
      (element) => element?.type === 'spot' || element?.data?.type === 'spot',
    )?.length ?? 0;

  static getInitialRoomBlueprintSpots = (
    roomBlueprint: number | null,
    roomBlueprints: RoomBlueprint[],
  ) => {
    const blueprint = roomBlueprints.find((rb) => rb.id === roomBlueprint);

    if (blueprint) {
      const spotCount = SpotSchedulingHelper.getSpotCount(blueprint);
      return spotCount;
    }

    return null;
  };
}

export const getSpotIndexType = (
  roomBlueprint: RoomBlueprint,
  spotId: number,
) => {
  const spotTypeId =
    roomBlueprint?.canvas?.elements?.filter(
      (element) => element.data?.index === spotId && element.type === 'spot',
    )[0]?.data?.spotTypeId || DEFAULT_SPOT_TYPE_ID;

  const indexType = roomBlueprint?.canvas?.elements
    .filter(
      (element) => element.data?.index <= spotId && element.type === 'spot',
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
      (element) => element.data?.index === spotId && element.type === 'spot',
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
    spotType?.customization === 'predefined'
      ? {
          name: spotType?.name || null,
          prefix: spotType?.prefix,
          suffix: spotType?.suffix,
          indexType,
          shape: spotType?.shape,
          stroke: spotType?.stroke_color,
          fill: spotType?.fill_color,
        }
      : {
          name: spotType?.name || null,
          shape: 'personalized',
          prefix: spotType?.prefix,
          suffix: spotType?.suffix,
          indexType,
        };

  return spotInformation;
};

export const SPIVI_CORRESPONDENCE_TABLE_PAGE_SIZE = 10;

export const buildSpiviCorrespondence = (
  spotTypes: Array<SpotType>,
  roomBlueprint: RoomBlueprint,
) => {
  /*
   * We need to display the correspondance between bsport and spivi spot ids.
   * To do this we display a table of correspondence for each spotType.
   *
   * We create here two dicts tablePages and tableCountPages which have the ids of the spotTypes as keys
   * and respectively the current page (initialized at 1) of each table and the max number of pages of it.
   *
   * Finally, the spotCorespondence dict stores for each spotType the correspondence between the id shown by the back office and the id we send to spivi
   *
   * if spotType 1 has prefix 's' and spotType 2 has prefix 'v', the spotCorrespondence could be:
   * {-1: [['1', 1],['2', 4]], 1: [['s1': 2], ['s2': 3]], 2: [['v1', 5]]}
   */
  const prefixes = {};
  const spotCorrespondence = {};
  const tablePages = {};
  const tableCountPages = {};
  if (spotTypes && roomBlueprint) {
    // @ts-expect-error
    const spotTypesWithDefault = spotTypes.concat({
      id: -1,
      prefix: '',
    });

    spotTypesWithDefault.forEach((spotType) => {
      // @ts-expect-error
      spotCorrespondence[spotType.id] = [];
      // @ts-expect-error
      prefixes[spotType.id] = spotType.prefix;
    });

    roomBlueprint.canvas.elements
      .filter((el) => el.type === 'spot')
      .forEach((el) => {
        // @ts-expect-error
        if (spotCorrespondence[el.data.spotTypeId]) {
          // @ts-expect-error
          spotCorrespondence[el.data.spotTypeId].push([
            // @ts-expect-error
            prefixes[el.data.spotTypeId] + el.data.indexType,
            el.data.index,
          ]);
        }
      });

    spotTypesWithDefault.forEach((spotType) => {
      // @ts-expect-error
      tablePages[spotType.id] = 1;
      // @ts-expect-error
      tableCountPages[spotType.id] = Math.ceil(
        // @ts-expect-error
        spotCorrespondence[spotType.id].length /
          SPIVI_CORRESPONDENCE_TABLE_PAGE_SIZE,
      );
    });
  }

  return { spotCorrespondence, tablePages, tableCountPages };
};
