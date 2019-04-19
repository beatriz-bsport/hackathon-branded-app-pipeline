import { createAction, handleActions } from 'redux-actions';

export function createListHandler(objectName, endpoint) {
  const listActions = {
    isLoading: createAction(`${objectName.toUpperCase()}/LIST/IS_LOADING`),
    fetchedPage: createAction(`${objectName.toUpperCase()}/ALL/FETCHED_PAGE`),
    reset: createAction(`${objectName.toUpperCase()}/ALL/RESET`),
    error: createAction(`${objectName.toUpperCase()}/ALL/ERROR`),
  };

  function fetcher() {
    return async (dispatch: Dispatch) => {
      dispatch(listActions.isLoading(true));
      dispatch(listActions.reset());
      let next = 1;

      try {
        while (next) {
          // eslint-disable-next-line
          const response = await endpoint({ page: next });
          const { results } = response.data;
          next = response.data.next_page;
          dispatch(listActions.fetchedPage(results));
        }
      } catch (err) {
        console.error(err);
        dispatch(listActions.error(err));
      }
      dispatch(listActions.isLoading(false));
    };
  }

  const listReducers = (initialState, action) =>
    handleActions(
      {
        [listActions.reset]: (state) => {
          return state.set('all', []).set('error', null);
        },
        [listActions.isLoading]: (state, { payload }) => {
          return state.set('loading', payload);
        },
        [listActions.error]: (state, { payload }) => {
          return state.set('error', payload);
        },
        [listActions.fetchedPage]: (state, { payload }) => {
          return state.set('all', [...state.all, ...payload]);
        },
      },
      initialState,
    )(initialState, action);

  return { fetcher, listActions, listReducers };
}
