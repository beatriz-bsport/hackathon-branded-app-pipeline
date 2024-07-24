import { createAction } from 'redux-actions';

import type { PaginatedResponse } from 'bsport-saas/src/state/types';
import type {
  InvoiceV1Serializer,
  InvoiceConfigurationSerializer,
  InvoiceDetailsSerializer,
} from 'bsport-saas/src/libs/invoice/types';

type ListInvoiceResponse =
  | PaginatedResponse<InvoiceV1Serializer>
  | InvoiceV1Serializer[];
type RetrieveInvoiceResponse =
  | PaginatedResponse<InvoiceV1Serializer>
  | InvoiceV1Serializer[]
  | InvoiceV1Serializer
  | InvoiceConfigurationSerializer
  | InvoiceDetailsSerializer;

export const listInvoiceActions = {
  isLoading: createAction<boolean>('INVOICE/LIST/IS_LOADING'),
  error: createAction<Error | null>('INVOICE/LIST/ERROR'),
  success: createAction<ListInvoiceResponse>('INVOICE/LIST/SUCCESS'),
  reset: createAction<void>('INVOICE/LIST/RESET'),
};

export const retrieveInvoiceActions = {
  isLoading: createAction<boolean>('INVOICE/RETRIEVE/LOADING'),
  error: createAction<Error | null>('INVOICE/RETRIEVE/ERROR'),
  success: createAction<RetrieveInvoiceResponse>('INVOICE/RETRIEVE/SUCCESS'),
};

export const applyBalanceToInvoiceActions = {
  isLoading: createAction<boolean>('INVOICE/APPLY_BALANCE/LOADING'),
  error: createAction<Error | null>('INVOICE/APPLY_BALANCE/ERROR'),
  success: createAction<string>('INVOICE/APPLY_BALANCE/SUCCESS'),
};
