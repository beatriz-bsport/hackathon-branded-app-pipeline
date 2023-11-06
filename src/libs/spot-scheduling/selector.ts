// @ts-nocheck
import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import { AssetForBlueprint } from './types';
import themeSelectors from '../theme/selectors';

export const getRoomBlueprint = (state: RootState, id: number) => {
  return state.spotScheduling.roomBlueprint.byId[id];
};

const selectRoomBlueprint = (state: RootState) =>
  state.spotScheduling.roomBlueprint;

export const getRoomBlueprints = createSelector(
  [selectRoomBlueprint],
  (roomBlueprint) =>
    roomBlueprint.ids
      .map((id) => {
        return roomBlueprint.byId[id];
      })
      .filter((rb) => !!rb),
);

export const getAvailableRoomBlueprints = createSelector(
  getRoomBlueprints,
  (roomBlueprintList) => roomBlueprintList.filter((rb) => !rb.disabled),
);

export const getRoomBlueprintsForEstablishment = (
  state: RootState,
  id: number,
) => {
  return state.spotScheduling.roomBlueprint.ids
    .map((blueprintId) => {
      return state.spotScheduling.roomBlueprint.byId[blueprintId];
    })
    .filter((rb) => !!rb && rb.establishment === id && !rb.disabled);
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

export const getAssetByBlueprintByIdentifierFromState = (state: RootState) =>
  state.spotScheduling.assetForBlueprint.byBlueprintById;

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

export const getState = (state: RootState) => {
  return state.spotScheduling.spotForBlueprint;
};

export const getSpotTypesOfCompanyByBlueprintId = (
  state: RootState,
  blueprint: number,
) => {
  return state.spotScheduling.spotForBlueprint.ids
    .map((spotTypeId) => state.spotScheduling.spotForBlueprint.byId[spotTypeId])
    .filter(
      (spotType) =>
        !!spotType &&
        spotType.company.toString() ===
          state.spotScheduling.roomBlueprint.byId[
            blueprint
          ].company.toString() &&
        !spotType.disabled,
    );
};

export const getSpotTypesOfCompany = createSelector(
  [themeSelectors.getTheme, getState],
  (theme, spotForBlueprint) =>
    spotForBlueprint.ids
      .map((spotTypeId) => spotForBlueprint.byId[spotTypeId])
      .filter(
        (spotType) =>
          !!spotType &&
          spotType.company.toString() === theme.company.toString() &&
          !spotType.disabled,
      ),
);

export const getAssetUnboundForBluePrintState = (state: RootState) =>
  state.spotScheduling.assetUnboundForBlueprint;

export const getAssetUnboudedForBluePrintById = createSelector(
  [getAssetUnboundForBluePrintState, (_: RootState, id: number) => id],
  (assetUnboundForBluePrintState, id) => {
    return (
      assetUnboundForBluePrintState.byBlueprintId[id] ??
      ({
        allIds: [],
        byId: {},
        count: 0,
        next_page: null,
        previous_page: null,
      } as {
        allIds: number[];
        byId: { [key: string]: AssetForBlueprint };
        next_page: number | null;
        previous_page: number | null;
        count: number | null;
      })
    );
  },
);
