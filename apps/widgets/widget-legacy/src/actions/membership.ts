import { createAction } from 'redux-actions';

export const retrieveMembershipByCompanyAction = {
  success: createAction('REFERRAL/BRIDGE/MEMBERSHIP_BY_COMPANY/SUCCESS'),
  isLoading: createAction('REFERRAL/BRIDGE/MEMBERSHIP_BY_COMPANY/LOADING'),
  error: createAction('REFERRAL/BRIDGE/MEMBERSHIP_BY_COMPANY/ERROR'),
};
