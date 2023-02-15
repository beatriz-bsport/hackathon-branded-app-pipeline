import { CanvasElement } from './CanvasSvg/tools/BaseClasses/Base.tool';
import { ErrorAndLoading } from '../types';

export type RoomBlueprint = {
  id: number;
  disabled: boolean;
  name: string;
  company: number;
  establishment: number;
  canvas: {
    elements: CanvasElement<any>[];
  };
};

export type AssetForBlueprint = {
  identifier: string;
  asset: string;
  blueprint: number;
};

export type SpotSchedulingState = {
  roomBlueprint: ErrorAndLoading & {
    byId: { [key: string]: RoomBlueprint };
    ids: number[];
  };
  assetForBlueprint: ErrorAndLoading & {
    byId: { [key: string]: AssetForBlueprint };
    ids: number[];
    byBlueprintById: { [key: string]: { [key: string]: AssetForBlueprint } };
  };
  spotForBlueprint: ErrorAndLoading & {
    byId: { [key: string]: SpotType };
    ids: number[];
  };
};

export type PredefinedCustomization = {
  shape: string;
  stroke: string;
  fill: string;
};
export type PersonalizedCustomization = {
  assetFree: string;
  assetTaken: string;
  AssetSelected: string;
}; // not sure of the string types

export type SpotCustomization =
  | PredefinedCustomization
  | PersonalizedCustomization;

export type SpotType = {
  id: number;
  name: string;
  prefix: string;
  customization: string;
  fill_color: string;
  stroke_color: string;
  free_image: string;
  selected_image: string;
  taken_image: string;
  shape: 'circular' | 'rectangle' | 'square' | 'triangle';
  company?: number;
  blueprint?: number;
};

export type Spot_FULL = {
  spotType: SpotType;
  index: number;
  indexType: number;
};

export type SpotInformation = {
  name: string;
  prefix: string;
  shape: string;
  fill: string;
  stroke: string;
  indexType: number;
};
