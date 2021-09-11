// @flow

import * as Sentry from '@sentry/react';
import lodash from 'lodash';
import Immutable from 'seamless-immutable';

import {
  postBaseAuth as postAuth,
  getAuth,
  deleteAuth,
  putAuth,
  API_URI,
} from '../http';

function toSnakeCase(s) {
  return s.replace(
    /([a-z-0-9])([A-Z])/g,
    (_, before, upper) => `${before}_${upper.toLowerCase()}`,
  );
}

export function asQueryParams(ob) {
  const keyed = lodash.mapKeys(ob, (v, k) => toSnakeCase(k));
  return lodash.map(keyed, (v, k) => `${k}=${v}`).join('&');
}

function handleError(error: Error): void {
  console.error(error);
  Sentry.captureException(error);
}

export type ActionCreator<S, T> = (T) => { type: S, payload: T };

function createActionCreator<T>(type: string): ActionCreator<string, T> {
  return (payload) => {
    return { type, payload };
  };
}

function parseParamPattern(param) {
  const name = param.substring(1);
  if (name[0] === '?') {
    return { type: 'query', name: name.substring(1), base: param };
  }
  return { type: 'normal', name, base: param };
}

function zip(a, b) {
  const c = [];
  a.forEach((_, i) => {
    c.push(a[i]);
    c.push(b[i]);
  });
  return c.join('');
}

/**
 * Template literal that parse a uri and return a function that generate the
 * corresponding uri with the given arguments.
 *
 * For instance
 *  uri`/mypath/:hello/from/:?params`
 *  will return a function of two args: (hello: string, params: Object)
 *
 *  Using a ? before the parameter name will tell the functions to generate
 * a query string from the given argument.
 */
export function uri(strings, ...args) {
  const q = zip(strings, args);
  const params = q.match(/:[^/0-9]\??[a-z0-9]+/gi).map(parseParamPattern);
  return (...pargs) => {
    return params.reduce((s, { type, name, base }, i) => {
      if (pargs[i] === undefined && type === 'normal') {
        throw new Error(`Param ${name} is undefined`);
      }
      const value = type === 'query' ? `?${asQueryParams(pargs[i])}` : pargs[i];
      return s.replace(base, value);
    }, q);
  };
}

function createUri(path, args) {
  if (typeof path === 'string') {
    return path;
  }
  return path(...args);
}

export type UpsertOptions<T> = {
  onSuccess?: (T) => void,
  onError?: (t: T, err: any) => void,
};

const DEFAULT_VERBS = {
  get: {
    effect(path, action) {
      return (id, params = {}, options = {}) => {
        return async (dispatch) => {
          dispatch(action.start());

          try {
            const url = `${API_URI}/${createUri(path, [id].concat([params]))}`;
            const response = await getAuth(url);
            dispatch(action.success(response.data));
            if (options && options.onSuccess) options.onSuccess(response.data);
          } catch (error) {
            dispatch(action.error(error));
            handleError(error);
            if (options && options.onError) {
              options.onError(error.response && error.response.data);
            }
          }
        };
      };
    },
    reducer(type) {
      return {
        [type.start]: (state) =>
          state.merge({ value: null, error: null, loading: true }),
        [type.error]: (state, payload) => {
          return state.merge({ error: payload, loading: false });
        },
        [type.success]: (state, payload) => {
          return state.merge({ value: payload, loading: false });
        },
      };
    },
  },
  list: {
    effectName: 'fetchAll',
    effect(path, action) {
      return () => {
        return async (dispatch) => {
          dispatch(action.start());
          try {
            const url = `${API_URI}/${path}/`;
            const response = await getAuth(url);
            dispatch(action.success(response.data));
          } catch (error) {
            dispatch(action.error(error));
            handleError(error);
          }
        };
      };
    },
    reducer(type) {
      return {
        [type.start]: (state) => state.merge({ error: null, loading: true }),
        [type.error]: (state, payload) => {
          return state.merge({ error: payload, loading: false });
        },
        [type.success]: (state, payload) => {
          return state
            .set('items', lodash.keyBy(payload, 'id'))
            .set('loading', false);
        },
      };
    },
  },
  create: {
    effect(path, action) {
      return (data, { onSuccess, onError }: ?UpsertOptions = {}) => {
        return async (dispatch) => {
          dispatch(action.start(data));
          try {
            const url = `${API_URI}/${path}/`;
            const response = await postAuth(url, data);
            dispatch(action.success(response.data));
            if (onSuccess) onSuccess(response.data, data);
          } catch (error) {
            dispatch(action.error(error));
            handleError(error);
            if (onError) onError(error.response.data, error, data);
          }
        };
      };
    },
    reducer(type) {
      return {
        [type.start]: (state) => state.set('creating', true),
        [type.error]: (state, payload) => {
          return state.set('error', payload).set('creating', false);
        },
        [type.success]: (state, payload) => {
          const { id } = payload;
          return state.set('creating', false).setIn(['items', id], payload);
        },
      };
    },
  },
  update: {
    effect(path, action) {
      return (data, { onSuccess, onError }: ?UpsertOptions = {}) => {
        return async (dispatch) => {
          dispatch(action.start(data));
          try {
            const url = `${API_URI}/${path}/${data.id}/`;
            const response = await putAuth(url, data);
            dispatch(action.success(response.data));
            if (onSuccess) onSuccess(response.data);
          } catch (error) {
            dispatch(action.error({ error, data }));
            handleError(error);
            if (onError) onError(error.response.data, error);
          }
        };
      };
    },
    reducer(type) {
      return {
        [type.start]: (state, { id }) => {
          return state.setIn(['items', id, 'updating'], true);
        },
        [type.error]: (state, { data: { id }, error }) => {
          return state
            .setIn(['items', id, 'updating'], false)
            .set('error', error);
        },
        [type.success]: (state, payload) => {
          const { id } = payload;
          return state.setIn(['items', id], payload);
        },
      };
    },
  },
  delete: {
    effect(path, action) {
      return (id, { onSuccess, onError }: ?UpsertOptions = {}) => {
        return async (dispatch) => {
          dispatch(action.start(id));
          try {
            const url = `${API_URI}/${path}/${id}/`;
            const response = await deleteAuth(url);
            dispatch(action.success({ data: response.data, id }));
            if (onSuccess) onSuccess(response.data);
          } catch (error) {
            dispatch(action.error({ error, id }));
            handleError(error);
            if (onError) onError(error.response.data, error);
          }
        };
      };
    },
    reducer(type) {
      return {
        [type.start]: (state, id) => {
          return state.setIn(['items', id, 'deleting'], true);
        },
        [type.error]: (state, { id, error }) => {
          return state
            .setIn(['items', id, 'deleting'], false)
            .set('error', error);
        },
        [type.success]: (state, { id }) => {
          const items = lodash.omit(state.items, id);
          return state.set('items', items);
        },
      };
    },
  },
};

function createAsyncTypes(resourceId: string, verb: string) {
  return {
    start: `@@api/${resourceId}/${verb}/start`,
    success: `@@api/${resourceId}/${verb}/success`,
    error: `@@api/${resourceId}/${verb}/error`,
  };
}

function createTypes(resourceId, verbs) {
  const typesObject = lodash.keyBy(verbs);
  return lodash.mapValues(typesObject, (verb) => {
    return createAsyncTypes(resourceId, verb);
  });
}

function createActionsCreators(types) {
  return lodash.mapValues(types, (asyncTypes) => {
    return lodash.mapValues(asyncTypes, createActionCreator);
  });
}

function createEffect(verb, path, action) {
  const defaultVerb = DEFAULT_VERBS[verb];
  if (defaultVerb) {
    return defaultVerb.effect(path, action);
  }
  return DEFAULT_VERBS.get.effect(path, action);
}

function createEffects(verbs, path, actions) {
  const namedEffects = lodash.keyBy(verbs, (v) => {
    return DEFAULT_VERBS[v].effectName || v;
  });
  const effects = lodash.mapValues(namedEffects, (verb) =>
    createEffect(verb, path, actions[verb]),
  );

  effects.upsert = (data, options: ?UpsertOptions) => {
    const effect = data.id ? effects.update : effects.create;
    return effect(data, options);
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

function createRestReducer(resourceId, types, verbs) {
  const defaultState = createState();
  const verbsReducers = verbs.map((verb) =>
    DEFAULT_VERBS[verb].reducer(types[verb]),
  );
  const combinedReducers = Object.assign({}, ...verbsReducers);
  return (state = defaultState, { type, payload } = { type: null }) => {
    const reducer = combinedReducers[type];
    return reducer ? reducer(state, payload) : state;
  };
}

function createSingleReducer(resourceId, types, verb) {
  const defaultState = Immutable({
    value: null,
    loading: false,
  });
  const verbDefault = DEFAULT_VERBS[verb] || DEFAULT_VERBS.get;
  const verbReducer = verbDefault.reducer(types);
  return (state = defaultState, { type, payload } = { type: null }) => {
    const actionReducer = verbReducer[type];
    return actionReducer ? actionReducer(state, payload) : state;
  };
}

function createSelectors(resourceId) {
  return {
    all(state) {
      return lodash.map(state['@api'][resourceId].items);
    },
    get(state, id) {
      const item = state['@api'][resourceId].items[id];
      return item || { loading: true };
    },
  };
}

export function createRestResource(resourceId, path) {
  const verbs = ['list', 'create', 'update', 'delete'];

  const types = createTypes(resourceId, verbs);
  const actions = createActionsCreators(types);
  const effects = createEffects(verbs, path, actions);
  const reducer = createRestReducer(resourceId, types, verbs);
  const selectors = createSelectors(resourceId);

  return { types, actions, effects, reducer, selectors };
}

export function createResource(resourceId, { url, verb }) {
  const verbs = [verb];
  const types = createTypes(resourceId, verbs);
  const actions = createActionsCreators(types);
  const effects = { [verb]: createEffect(verb, url, actions[verb]) };
  const reducer = createSingleReducer(resourceId, types[verb], verb);
  const selectors = {
    get(state) {
      const result = state['@api'][resourceId];
      return result;
    },
  };
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
