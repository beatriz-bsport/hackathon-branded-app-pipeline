import { createAction } from 'redux-actions';

export const retrieveConsumerPackBulkActions = {
  isLoading: createAction('CONSUMER_PACK/RETRIEVE_BULK/IS_LOADING'),
  error: createAction('CONSUMER_PACK/RETRIEVE_BULK/ERROR'),
  success: createAction('CONSUMER_PACK/RETRIEVE_BULK/SUCCESS'),
};
