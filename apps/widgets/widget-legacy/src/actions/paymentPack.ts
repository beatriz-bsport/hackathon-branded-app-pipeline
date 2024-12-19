import { createAction } from 'redux-actions';

export const fetchPaymentPackBulkActions = {
  isLoading: createAction('PAYMENT_PACK/BULK/IS_LOADING'),
  error: createAction('PAYMENT_PACK/BULK/ERROR'),
  success: createAction('WIDGET/PAYMENT_PACK/BULK/SUCCESS'),
};
