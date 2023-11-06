// @ts-nocheck
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import uniq from 'lodash/uniq';
import { AssetForBlueprint, SpotSchedulingState } from './types';
import {
  assetForBlueprintActions,
  createOrUpdateSpotForBlueprintActions,
  roomBlueprintActions,
  spotForBlueprintActions,
  deleteSpotForBlueprintActions,
  assetUnboundForBlueprintActions,
} from './actions';

const initialState: Immutable.Immutable<SpotSchedulingState> =
  Immutable<SpotSchedulingState>({
    roomBlueprint: {
      byId: {},
      ids: [],
      loading: false,
      error: null,
    },
    assetForBlueprint: {
      byId: {},
      ids: [],
      byBlueprintById: {},
      loading: false,
      error: null,
    },
    spotForBlueprint: {
      byId: {},
      ids: [],
      loading: false,
      error: null,
    },
    assetUnboundForBlueprint: {
      byBlueprintId: {},
      loading: false,
      error: null,
    },
  });

export default handleActions(
  {
    [roomBlueprintActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['roomBlueprint', 'loading'], payload);
    },
    [roomBlueprintActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['roomBlueprint', 'error'], payload);
    },
    [roomBlueprintActions.success.toString()]: (state, { payload }) => {
      const ids = [...state.roomBlueprint.ids.asMutable()];
      const index = ids.findIndex((id) => id === payload.id);
      index === -1 && ids.push(payload.id);

      return state
        .setIn(['roomBlueprint', 'byId', payload.id], payload)
        .setIn(['roomBlueprint', 'ids'], ids);
    },
    [roomBlueprintActions.list.toString()]: (state, { payload }) => {
      const byId = { ...state.roomBlueprint.byId };

      payload.forEach((room) => {
        byId[room.id] = room;
      });

      const ids = payload.map((room) => room.id);

      return state
        .setIn(['roomBlueprint', 'byId'], byId)
        .setIn(['roomBlueprint', 'ids'], ids);
    },
    [roomBlueprintActions.delete.toString()]: (state, { payload }) => {
      const byId = { ...state.roomBlueprint.byId };
      if (byId[payload]) {
        delete byId[payload];
      }

      const ids = [...state.roomBlueprint.ids.asMutable()];
      const index = ids.findIndex((id) => parseInt(id) === parseInt(payload));

      index !== -1 && ids.splice(index, 1);

      return state
        .setIn(['roomBlueprint', 'byId'], byId)
        .setIn(['roomBlueprint', 'ids'], ids);
    },
    [roomBlueprintActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['roomBlueprint', 'loading'], payload);
    },
    [assetForBlueprintActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['assetForBlueprint', 'loading'], payload);
    },
    [assetForBlueprintActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['assetForBlueprint', 'error'], payload);
    },
    [assetForBlueprintActions.success.toString()]: (state, { payload }) => {
      const ids = [...state.assetForBlueprint.ids.asMutable()];
      const index = ids.findIndex((id) => id === payload.id);
      index === -1 && ids.push(payload.id);
      const byBlueprintById: {
        [key: string]: { [key: string]: AssetForBlueprint };
      } = {};
      byBlueprintById[payload.blueprint] = { [payload.id]: payload };

      return state
        .setIn(['assetForBlueprint', 'byId', payload.id], payload)
        .setIn(['assetForBlueprint', 'ids'], ids)
        .merge({ assetForBlueprint: { byBlueprintById } }, { deep: true });
    },
    [assetForBlueprintActions.list.toString()]: (state, { payload }) => {
      const byId = { ...state.assetForBlueprint.byId };
      const byBlueprintById: {
        [key: string]: { [key: string]: AssetForBlueprint };
      } = {};

      payload.forEach((room) => {
        byId[room.id] = room;
        if (!byBlueprintById[room.blueprint])
          byBlueprintById[room.blueprint] = {};
        byBlueprintById[room.blueprint][room.id] = room;
      });

      const ids = payload.map((room) => room.id);

      return state
        .setIn(['assetForBlueprint', 'byId'], byId)
        .setIn(['assetForBlueprint', 'ids'], ids)
        .merge({ assetForBlueprint: { byBlueprintById } }, { deep: true });
    },
    [createOrUpdateSpotForBlueprintActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['spotForBlueprint', 'loading'], payload);
    },
    [createOrUpdateSpotForBlueprintActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['spotForBlueprint', 'error'], payload);
    },
    [createOrUpdateSpotForBlueprintActions.success.toString()]: (
      state,
      { payload },
    ) => {
      const ids = [...state.spotForBlueprint.ids.asMutable()];
      const index = ids.findIndex((id) => id === payload.id);
      index === -1 && ids.push(payload.id);

      return state
        .setIn(['spotForBlueprint', 'byId', payload.id], payload)
        .setIn(['spotForBlueprint', 'ids'], ids);
    },
    [spotForBlueprintActions.list.toString()]: (state, { payload }) => {
      const ids = payload.map((spotType) => spotType.id);
      return state.merge(
        {
          spotForBlueprint: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
            ids,
          },
        },
        { deep: true },
      );
    },
    [deleteSpotForBlueprintActions.delete.toString()]: (state, { payload }) => {
      const byId = { ...state.spotForBlueprint.byId };

      const ids = [...state.spotForBlueprint.ids.asMutable()];
      const index = ids.findIndex((id) => parseInt(id) === parseInt(payload));

      index !== -1 && ids.splice(index, 1);

      return state
        .setIn(['spotForBlueprint', 'byId'], byId)
        .setIn(['spotForBlueprint', 'ids'], ids);
    },
    [deleteSpotForBlueprintActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['spotForBlueprint', 'error'], payload);
    },
    [assetUnboundForBlueprintActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['assetUnboundForBlueprint', 'loading'], payload);
    },
    [assetUnboundForBlueprintActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['assetUnboundForBlueprint', 'error'], payload);
    },
    [assetUnboundForBlueprintActions.success.toString()]: (
      state,
      { payload },
    ) => {
      const { data, blueprintId } = payload;

      return state
        .setIn(
          ['assetUnboundForBlueprint', 'byBlueprintId', blueprintId, 'allIds'],
          uniq([
            ...(state.assetUnboundForBlueprint.byBlueprintId?.[blueprintId]
              ?.allIds ?? []),
            ...((data?.results ?? [])
              .filter((_asset) => _asset.is_unbound)
              .map((asset) => asset.id) ?? []),
          ]),
        )
        .setIn(
          ['assetUnboundForBlueprint', 'byBlueprintId', blueprintId, 'count'],
          data.count,
        )
        .setIn(
          [
            'assetUnboundForBlueprint',
            'byBlueprintId',
            blueprintId,
            'next_page',
          ],
          data.next_page,
        )
        .setIn(
          [
            'assetUnboundForBlueprint',
            'byBlueprintId',
            blueprintId,
            'previous_page',
          ],
          data.previous_page,
        )
        .merge(
          {
            assetUnboundForBlueprint: {
              byBlueprintId: {
                [blueprintId]: {
                  byId: data.results.reduce((acc: any, ps: any) => {
                    acc[ps.id] = ps;
                    return acc;
                  }, {}),
                },
              },
            },
          },
          { deep: true },
        );
    },
    [assetUnboundForBlueprintActions.create.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          [
            'assetUnboundForBlueprint',
            'byBlueprintId',
            payload.blueprint,
            'allIds',
          ],
          uniq([
            payload.id,
            ...(state.assetUnboundForBlueprint.byBlueprintId?.[
              payload.blueprint
            ]?.allIds ?? []),
          ]),
        )
        .setIn(
          [
            'assetUnboundForBlueprint',
            'byBlueprintId',
            payload.blueprint,
            'byId',
            payload.id,
          ],
          payload,
        );
    },
    assetUnboundForBlueprintActions,
  },
  initialState,
);
