import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import { SpotSchedulingState } from './types';
import { assetForBlueprintActions, roomBlueprintActions } from './actions';

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

      return state
        .setIn(['assetForBlueprint', 'byId', payload.id], payload)
        .setIn(['assetForBlueprint', 'ids'], ids);
    },
    [assetForBlueprintActions.list.toString()]: (state, { payload }) => {
      const byId = { ...state.assetForBlueprint.byId };

      payload.forEach((room) => {
        byId[room.id] = room;
      });

      const ids = payload.map((room) => room.id);

      return state
        .setIn(['assetForBlueprint', 'byId'], byId)
        .setIn(['assetForBlueprint', 'ids'], ids);
    },
  },
  initialState,
);
