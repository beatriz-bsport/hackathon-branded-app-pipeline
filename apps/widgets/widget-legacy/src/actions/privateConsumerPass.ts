import { createAction } from 'redux-actions';

export const privateConsumerPassBulkActions = {
  error: createAction('PRIVATE_CONSUMER_PASS/BULK/ERROR'),
  isLoading: createAction('PRIVATE_CONSUMER_PASS/BULK/IS_LOADING'),
  success: createAction('PRIVATE_CONSUMER_PASS/BULK/SUCCESS'),
};
