import Config from '../../config';

export const CONSUMER_SPACE_MOBILE_BREAKPOINT = 660;

export const NEW_MEMBER_PROFILE_ROUTE_LIST = [
  'booking',
  'subscription',
  'invoice',
  'pack',
];

export const displayReworkedMemberProfile = !['production'].includes(
  Config.REACT_APP_SENTRY_ENVIRONMENT,
);
