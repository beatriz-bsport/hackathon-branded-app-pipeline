import { createAction } from 'redux-actions';
import { search as searchAPI } from '#libs/fuzzy-search/api';
import type { Dispatch, OptionCallback } from '#state/types';
import type {
  FuzzySearchAPIParams,
  ObjectSearchPaginated,
  SearchObjectType,
} from '#libs/fuzzy-search/types';

export type IdentifiedValue<T> = {
  searchObjectType: SearchObjectType;
  value: T;
};

export const objectSearchActions = {
  isLoading: createAction<IdentifiedValue<boolean>>('OBJECTSEARCH/LOADING'),
  error: createAction<IdentifiedValue<Error | null>>('OBJECTSEARCH/ERROR'),
  success: createAction<IdentifiedValue<ObjectSearchPaginated>>(
    'OBJECTSEARCH/SUCCESS',
  ),
};

export function searchObjects(
  args: { searchedObjectType: SearchObjectType; params: FuzzySearchAPIParams },
  options?: OptionCallback<ObjectSearchPaginated>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      objectSearchActions.isLoading({
        value: true,
        searchObjectType: args.searchedObjectType,
      }),
    );
    dispatch(
      objectSearchActions.error({
        value: null,
        searchObjectType: args.searchedObjectType,
      }),
    );
    try {
      const response = await searchAPI(args.params);
      dispatch(
        objectSearchActions.success({
          value: response.data,
          searchObjectType: args.searchedObjectType,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(
        objectSearchActions.error({
          value: err,
          searchObjectType: args.searchedObjectType,
        }),
      );
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(
      objectSearchActions.isLoading({
        value: false,
        searchObjectType: args.searchedObjectType,
      }),
    );
  };
}

export const objectSearchClientActions = {
  reset: createAction<SearchObjectType>('OBJECTSEARCH/RESET'),
};

export const resetObjectSearch =
  (searchedObjectType: SearchObjectType) => (dispatch: Dispatch) => {
    dispatch(objectSearchClientActions.reset(searchedObjectType));
  };
