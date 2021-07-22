import { createAction } from 'redux-actions';
import { Dispatch, OptionCallback } from '../state/types';
import { GenericListReducerI, GenericReducerI } from '../libs/types';

interface GenericActionI {
  isLoading: any;
  error: any;
  success: any;
}

type AsyncActionArgument<F extends Function> = F extends (
  ...args: infer A
) => any
  ? A[0] extends undefined
    ? [OptionCallback?]
    : A[1] extends undefined
    ? [A[0], OptionCallback?]
    : A[2] extends undefined
    ? [A[0], A[1], OptionCallback?]
    : A[3] extends undefined
    ? [A[0], A[1], A[2], OptionCallback?]
    : A[4] extends undefined
    ? [A[0], A[1], A[2], A[3], OptionCallback?]
    : never
  : never;

export const GenericAction: (key: string) => GenericActionI = (key: string) => {
  return {
    isLoading: createAction(`${key}/LOADING`),
    error: createAction(`${key}/ERROR`),
    success: createAction(`${key}/SUCCESS`),
  };
};

export const GenericSelector = <M = any>(key: string) => {
  return {
    data: (state: any) => state.generic[key].data as M,
    loading: (state: any) => state.generic[key].loading as boolean | null,
    error: (state: any) => state.generic[key].error as Error | null,

    full: (state: any) => ({
      data: state.generic[key].data as M,
      loading: state.generic[key].loading as boolean | null,
      error: state.generic[key].error as Error | null,
    }),
  };
};

export const GenericRepo = <M = any>(key: string) => {
  const actions = GenericAction(key);
  const selectors = GenericSelector<M>(key);

  const initialState: { [key: string]: GenericReducerI } = {
    [key]: {
      data: null,
      loading: false,
      error: null,
    },
  };

  return {
    key,
    actions,
    selectors,
    initialState,
  };
};

export const GenericReducer = (repo: ReturnType<typeof GenericRepo>) => {
  return {
    [repo.actions.isLoading.toString()]: (state: any, { payload }: any) => {
      return state.setIn(['generic', repo.key, 'loading'], payload);
    },
    [repo.actions.error.toString()]: (state: any, { payload }: any) => {
      return state.setIn(['generic', repo.key, 'error'], payload);
    },
    [repo.actions.success.toString()]: (state: any, { payload }: any) => {
      return state.setIn(['generic', repo.key, 'data'], payload);
    },
  };
};

export const GenericAsyncAction = <F extends (...args: any[]) => any>(
  genericRepo: ReturnType<typeof GenericRepo>,
  api: F,
) => {
  return (...params: AsyncActionArgument<typeof api>) => {
    return async (dispatch: Dispatch) => {
      dispatch(genericRepo.actions.isLoading(true));
      const options = params[params.length - 1];
      try {
        const response = await api(...params);
        dispatch(genericRepo.actions.success(response.data));
        if (options && options.onSuccess) {
          options.onSuccess(response.data.results);
        }
      } catch (err) {
        console.error(err);
        dispatch(genericRepo.actions.error(err));
        if (options && options.onError) {
          options.onError(err);
        }
      }
      dispatch(genericRepo.actions.isLoading(false));
    };
  };
};

export const GenericListSelector = <M = any>(key: string) => {
  return {
    items: (state: any) =>
      state.generic[key].allIds.map((item: number) => state.byId[item]) as M[],
    allIds: (state: any) => state.generic[key].allIds as number[],
    page: (state: any) => state.generic[key].page as number | null,
    next_page: (state: any) => state.generic[key].next_page as number | null,
    count: (state: any) => state.generic[key].count as number,
    loading: (state: any) => state.generic[key].loading as boolean | null,
    error: (state: any) => state.generic[key].error as Error | null,

    full: (state: any) => ({
      items: state.generic[key].allIds.map(
        (item: number) => state.byId[item],
      ) as M[],
      allIds: state.generic[key].allIds as number[],
      page: state.generic[key].page as number | null,
      next_page: state.generic[key].next_page as number | null,
      count: state.generic[key].count as number,
      loading: state.generic[key].loading as boolean | null,
      error: state.generic[key].error as Error | null,
    }),
  };
};

export const GenericListRepo = <M = any>(key: string) => {
  const actions = GenericAction(key);
  const selectors = GenericListSelector<M>(key);

  const initialState: { [key: string]: GenericListReducerI } = {
    [key]: {
      allIds: [],
      page: null,
      next_page: null,
      count: 0,
      loading: false,
      error: null,
    },
  };

  return {
    key,
    actions,
    selectors,
    initialState,
  };
};

export const GenericListReducer = (
  repo: ReturnType<typeof GenericListRepo>,
) => {
  return {
    [repo.actions.isLoading.toString()]: (state: any, { payload }: any) => {
      return state.setIn(['generic', repo.key, 'loading'], payload);
    },
    [repo.actions.error.toString()]: (state: any, { payload }: any) => {
      return state.setIn(['generic', repo.key, 'error'], payload);
    },
    [repo.actions.success.toString()]: (state: any, { payload }: any) => {
      const newIds = payload.results.map((item: any) => item.id);
      return state
        .setIn(['generic', repo.key, 'page'], payload.page)
        .setIn(['generic', repo.key, 'next_page'], payload.next_page)
        .setIn(['generic', repo.key, 'count'], payload.count)
        .setIn(['generic', repo.key, 'allIds'], newIds)
        .merge(
          {
            byId: payload.results.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
  };
};

export const GenericListAsyncAction = (
  genericRepo: ReturnType<typeof GenericListRepo>,
  api: any,
) => {
  return (params: any, options?: OptionCallback) => {
    return async (dispatch: Dispatch) => {
      dispatch(genericRepo.actions.isLoading(true));
      try {
        const response = await api(params);
        dispatch(
          genericRepo.actions.success({
            ...response.data,
            page: params.page || 1,
          }),
        );
        if (options && options.onSuccess) {
          options.onSuccess(response.data.results);
        }
      } catch (err) {
        console.error(err);
        dispatch(genericRepo.actions.error(err));
        if (options && options.onError) {
          options.onError(err);
        }
      }
      dispatch(genericRepo.actions.isLoading(false));
    };
  };
};
