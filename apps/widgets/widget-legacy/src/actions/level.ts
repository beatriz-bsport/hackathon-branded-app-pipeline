import { createAction } from 'redux-actions';

export const fetchLevelListActions = {
  error: createAction('LEVEL/FETCH_LIST/ERROR'),
  loading: createAction('LEVEL/FETCH_LIST/LOADING'),
  success: createAction('LEVEL/FETCH_LIST/SUCCESS'),
};
