import { createAction } from 'redux-actions';

export const establishmentBulkRetrieveActions = {
  isLoading: createAction('ESTABLISHMENT/BULK_RETRIEVE/IS_LOADING'),
  error: createAction('ESTABLISHMENT/BULK_RETRIEVE/ERROR'),
  success: createAction('ESTABLISHMENT/BULK_RETRIEVE/SUCCESS'),
};
