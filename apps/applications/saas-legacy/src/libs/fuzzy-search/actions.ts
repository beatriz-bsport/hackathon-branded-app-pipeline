import { createAction } from 'redux-actions';
import { search as searchAPI } from '#src/libs/fuzzy-search/api';
import type { Dispatch, OptionCallback } from '#src/state/types';
import type {
  FuzzySearchAPIParams,
  IdentifiedValue,
  ObjectSearchPaginated,
  SearchIdentifier,
  SearchObjectType,
} from '#src/libs/fuzzy-search/types';

export const objectSearchActions = {
  isLoading: createAction<IdentifiedValue<boolean>>('OBJECTSEARCH/LOADING'),
  error: createAction<IdentifiedValue<Error | null>>('OBJECTSEARCH/ERROR'),
  success: createAction<IdentifiedValue<ObjectSearchPaginated>>(
    'OBJECTSEARCH/SUCCESS',
  ),
};

export function searchObjects(
  args: {
    searchedObjectType: SearchObjectType;
    params: FuzzySearchAPIParams;
    selectorId: string;
  },
  options?: OptionCallback<ObjectSearchPaginated>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      objectSearchActions.isLoading({
        value: true,
        ...args,
      }),
    );
    dispatch(
      objectSearchActions.error({
        value: null,
        ...args,
      }),
    );
    try {
      const response = await searchAPI(args.params);
      dispatch(
        objectSearchActions.success({
          value: response.data,
          ...args,
        }),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        objectSearchActions.error({
          value: err,
          ...args,
        }),
      );
      options?.onError?.(err);
    }
    dispatch(
      objectSearchActions.isLoading({
        value: false,
        ...args,
      }),
    );
  };
}

export const objectSearchClientActions = {
  reset: createAction<SearchIdentifier>('OBJECTSEARCH/RESET'),
};

export const resetObjectSearch =
  (props: SearchIdentifier) => (dispatch: Dispatch) => {
    dispatch(objectSearchClientActions.reset(props));
  };
