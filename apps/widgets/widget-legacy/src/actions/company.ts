import { createAction } from 'redux-actions';

import type { WaitingListConfiguration } from 'bsport-saas/src/libs/waiting-list/types';

export const configurationDetailActions = {
  error: createAction<Error | null>('WAITING_LIST_CONFIGURATION/DETAIL/ERROR'),
  isLoading: createAction<boolean>(
    'WAITING_LIST_CONFIGURATION/DETAIL/IS_LOADING',
  ),
  success: createAction<WaitingListConfiguration>(
    'WAITING_LIST_CONFIGURATION/DETAIL/SUCCESS',
  ),
};
