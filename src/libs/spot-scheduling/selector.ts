import { RootState } from '../../reducers';
import { AssetForBlueprint } from './types';

export const getRoomBlueprints = (state: RootState) => {
  return state.spotScheduling.roomBlueprint.ids
    .map((id) => {
      return state.spotScheduling.roomBlueprint.byId[id];
    })
    .filter((rb) => !!rb);
};

export const getRoomBlueprintsForEstablishment = (
  state: RootState,
  id: number,
) => {
  return state.spotScheduling.roomBlueprint.ids
    .map((blueprintId) => {
      return state.spotScheduling.roomBlueprint.byId[blueprintId];
    })
    .filter((rb) => !!rb && rb.establishment === id);
};

export const getAssetByIdentifier = (
  state: RootState,
  blueprintId: string | number,
) => {
  const assets: { [key: string]: AssetForBlueprint } = {};

  Object.keys(state.spotScheduling.assetForBlueprint.byId).forEach((key) => {
    const asset = state.spotScheduling.assetForBlueprint.byId[key];

    if (asset.blueprint.toString() === blueprintId.toString()) {
      assets[asset.identifier] = asset;
    }
  });

  return assets;
};

export const getAssetByBlueprintByIdentifier = (state: RootState) => {
  const assets: { [key: string]: { [key: string]: AssetForBlueprint } } = {};

  Object.keys(state.spotScheduling.assetForBlueprint.byId).forEach((key) => {
    const asset = state.spotScheduling.assetForBlueprint.byId[key];

    if (!assets[asset.blueprint]) {
      assets[asset.blueprint] = {};
    }

    assets[asset.blueprint][asset.identifier] = asset;
  });

  return assets;
};

export const getAssetForEstablishment = (
  state: RootState,
  establishment: number,
) => {
  const assetsByBlueprintByIdentifier: {
    [key: string]: { [key: string]: AssetForBlueprint };
  } = {};

  Object.keys(state.spotScheduling.assetForBlueprint.byId).forEach((key) => {
    const asset: AssetForBlueprint =
      state.spotScheduling.assetForBlueprint.byId[key];

    if (asset) {
      const blueprint =
        state.spotScheduling.roomBlueprint.byId[asset.blueprint];

      if (blueprint && blueprint.establishment === establishment) {
        if (!assetsByBlueprintByIdentifier[blueprint.id]) {
          assetsByBlueprintByIdentifier[blueprint.id] = {};
        }

        assetsByBlueprintByIdentifier[blueprint.id][asset.identifier] = asset;
      }
    }
  });

  return assetsByBlueprintByIdentifier;
};
