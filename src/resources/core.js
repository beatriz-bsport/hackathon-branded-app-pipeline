// @flow

import lodash from 'lodash';
import Immutable from 'seamless-immutable';

import { postAuth, getAuth, putAuth, API_URI } from '../http';

function createAction(type) {
  return (payload) => {
    return { type, payload };
  };
}

function createAsyncTypes(resourceId, verb) {
  return {
    start: `@@api/${resourceId}/${verb}/start`,
    success: `@@api/${resourceId}/${verb}/success`,
    error: `@@api/${resourceId}/${verb}/error`,
  };
}

function createTypes(resourceId) {
  return {
    list: createAsyncTypes(resourceId, 'list'),
    update: createAsyncTypes(resourceId, 'update'),
    create: createAsyncTypes(resourceId, 'create'),
  };
}

function createActions(types) {
  return lodash.mapValues(types, (asyncTypes) => {
    return lodash.mapValues(asyncTypes, createAction);
  });
}

function createEffects(resourceId, path, actions) {
  const effects = {
    fetchAll() {
      return async (dispatch) => {
        dispatch(actions.list.start());
        try {
          const url = `${API_URI}/${path}/`;
          const response = await getAuth(url);
          dispatch(actions.list.success(response.data));
        } catch (error) {
          dispatch(actions.list.error(error));
          console.error(error);
        }
      };
    },
    create(data) {
      return async (dispatch) => {
        dispatch(actions.create.start(data));
        try {
          const url = `${API_URI}/${path}/`;
          const response = await postAuth(url, data);
          dispatch(actions.create.success(response.data));
        } catch (error) {
          dispatch(actions.create.error(error));
          console.error(error);
        }
      };
    },
    update(data) {
      return async (dispatch) => {
        dispatch(actions.update.start(data));
        try {
          const url = `${API_URI}/${path}/${data.id}`;
          const response = await putAuth(url, data);
          dispatch(actions.update.success(response.data));
        } catch (error) {
          dispatch(actions.update.error({ error, data }));
          console.error(error);
        }
      };
    },
  };

  effects.upsert = (data) => {
    return data.id ? effects.update(data) : effects.create(data);
  };
  return effects;
}

function createState() {
  return Immutable({
    items: {},
    loading: false,
    error: null,
  });
}

function createReducer(resourceId, types) {
  const defaultState = createState();
  return (state = defaultState, { type, payload } = { type: null }) => {
    switch (type) {
      case types.list.start:
        return state.merge({ error: null, loading: true });
      case types.list.error:
        return state.merge({ error: payload, loading: false });
      case types.list.success:
        return state
          .set('items', lodash.keyBy(payload, 'id'))
          .set('loading', false);

      case types.create.start: {
        return state.set('creating', true);
      }
      case types.create.error: {
        return state.set('error', payload).set('creating', false);
      }
      case types.create.success: {
        const { id } = payload;
        return state.set('creating', false).setIn(['items', id], payload);
      }
      case types.update.start: {
        const { id } = payload;
        return state.setIn(['items', id, 'updating'], true);
      }
      case types.update.error: {
        const { id, error } = payload;
        return state
          .setIn(['items', id, 'updating'], false)
          .set('error', error);
      }
      case types.update.success: {
        const { id } = payload;
        return state.setIn(['items', id], payload);
      }
      default:
        return defaultState;
    }
  };
}

function createSelectors(resourceId) {
  return {
    all(state) {
      return lodash.map(state['@api'][resourceId].items);
    },
  };
}

export function createResource(resourceId, path) {
  const types = createTypes(resourceId);
  const actions = createActions(types);
  const effects = createEffects(resourceId, path, actions);
  const reducer = createReducer(resourceId, types);
  const selectors = createSelectors(resourceId);

  return { types, actions, effects, reducer, selectors };
}

export function combineResourceReducers(reducers) {
  const defaultState = Immutable(
    lodash.mapValues(reducers, (reducer) => reducer()),
  );
  return (state = defaultState, { type, payload } = { type: null }) => {
    const [namespace, resourceId] = type.split('/');
    if (namespace !== '@@api') {
      return state;
    }

    const reducer = reducers[resourceId];
    if (!reducer) {
      return state;
    }

    return state.merge({
      [resourceId]: reducer(state[resourceId], { type, payload }),
    });
  };
}
