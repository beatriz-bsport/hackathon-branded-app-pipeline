import { createAction } from 'redux-actions';

export const privateSlotBulkActions = {
  error: createAction('PRIVATE_SLOT/BULK/ERROR'),
  isLoading: createAction('PRIVATE_SLOT/BULK/IS_LOADING'),
  success: createAction('PRIVATE_SLOT/BULK/SUCCESS'),
};
