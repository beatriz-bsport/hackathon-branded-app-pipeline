import { createAction } from 'redux-actions';

import type { UserProfile } from 'bsport-saas/src/libs/member/types';

export const retrieveMemberAction = {
  success: createAction('REFERRAL/BRIDGE/MEMBER/SUCCESS'),
  isLoading: createAction<boolean>('REFERRAL/BRIDGE/MEMBER/LOADING'),
  error: createAction<Error | null>('REFERRAL/BRIDGE/MEMBER/ERROR'),
};

export const retrieveUserProfileActions = {
  success: createAction<UserProfile>('USER_PROFILE/ME/SUCCESS'),
  isLoading: createAction<boolean>('USER_PROFILE/ME/LOADING'),
  error: createAction<Error | null>('USER_PROFILE/ME/ERROR'),
};
