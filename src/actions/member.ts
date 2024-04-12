import { createAction } from 'redux-actions';

export const retrieveMemberAction = {
  success: createAction('REFERRAL/BRIDGE/MEMBER/SUCCESS'),
  isLoading: createAction('REFERRAL/BRIDGE/MEMBER/LOADING'),
  error: createAction('REFERRAL/BRIDGE/MEMBER/ERROR'),
};
