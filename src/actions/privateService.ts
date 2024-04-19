import type {
  PrivatePass,
  PrivateSlot,
  ServiceCompatibilityPass,
} from 'bsport-saas/src/libs/private-service/types';
import { createAction } from 'redux-actions';

export const privateSlotBulkActions = {
  error: createAction<Error | null>('PRIVATE_SLOT/BULK/ERROR'),
  isLoading: createAction<boolean>('PRIVATE_SLOT/BULK/IS_LOADING'),
  success: createAction<PrivateSlot[]>('PRIVATE_SLOT/BULK/SUCCESS'),
};

export const privatePassBulkActions = {
  error: createAction<Error | null>('PRIVATE_PASS/BULK/ERROR'),
  isLoading: createAction<boolean>('PRIVATE_PASS/BULK/IS_LOADING'),
  success: createAction<PrivatePass[]>('PRIVATE_PASS/BULK/SUCCESS'),
};

export const privateServiceCompatiblePassListActions = {
  error: createAction<Error | null>(
    'PRIVATE_SERVICE_COMPATIBLE_PASS/LIST/ERROR',
  ),
  isLoading: createAction<boolean>(
    'PRIVATE_SERVICE_COMPATIBLE_PASS/LIST/IS_LOADING',
  ),
  success: createAction<ServiceCompatibilityPass[]>(
    'PRIVATE_SERVICE_COMPATIBLE_PASS/LIST/SUCCESS',
  ),
};
