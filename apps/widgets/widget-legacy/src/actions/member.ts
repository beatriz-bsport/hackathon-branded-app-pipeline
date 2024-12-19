import { createAction } from 'redux-actions';

import type { Member, UserProfile } from '@bsport/saas-legacy/src/libs/member/types';

export const retrieveMemberAction = {
  success: createAction<Member>('HAS_FETCHED_MEMBER'),
  isLoading: createAction<boolean>('IS_FETCHING_MEMBER'),
  error: createAction<Error | null>('ERROR_FETCHING_MEMBER'),
};

export const retrieveUserProfileActions = {
  success: createAction<UserProfile>('USER_PROFILE/ME/SUCCESS'),
  isLoading: createAction<boolean>('USER_PROFILE/ME/LOADING'),
  error: createAction<Error | null>('USER_PROFILE/ME/ERROR'),
};
