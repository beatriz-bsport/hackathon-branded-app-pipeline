import { createAction } from 'redux-actions';

export const retrieveReferralProgramForCompanyActions = {
  success: createAction('REFERRAL/BRIDGE/PROGRAM_FOR_COMPANY/SUCCESS'),
  isLoading: createAction('REFERRAL/BRIDGE/PROGRAM_FOR_COMPANY/LOADING'),
  error: createAction('REFERRAL/BRIDGE/PROGRAM_FOR_COMPANY/ERROR'),
};

export const retrieveReferralMemberStatusActions = {
  success: createAction('REFERRAL/BRIDGE/MEMBER_STATUS/SUCCESS'),
  isLoading: createAction('REFERRAL/BRIDGE/MEMBER_STATUS/LOADING'),
  error: createAction('REFERRAL/BRIDGE/MEMBER_STATUS/ERROR'),
};
