import { CanvasElement } from './CanvasSvg/tools/BaseClasses/Base.tool';
import { ErrorAndLoading } from '../types';

export type RoomBlueprint = {
  id: number;
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
  };
};
