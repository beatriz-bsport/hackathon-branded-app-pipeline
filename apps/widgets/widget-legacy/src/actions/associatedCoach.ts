import { createAction } from 'redux-actions';

export const coachBulkRetrieveActions = {
  isLoading: createAction('COACH/BULK_RETRIEVE/IS_LOADING'),
  error: createAction('COACH/BULK_RETRIEVE/ERROR'),
  success: createAction('COACH/BULK_RETRIEVE/SUCCESS'),
};
