export const CONSUMER_SPACE_MOBILE_BREAKPOINT = 930;
export const CONSUMER_SPACE_MODAL_TO_DRAWER_BREAKPOINT = 950;
export const CONSUMER_SPACE_API_PAGE_SIZE = 10;

export const NEW_MEMBER_PROFILE_ROUTE_LIST = [
  'booking',
  'subscription',
  'invoice',
  'pack',
];

/**
 * The context from where the consumer space is accessed from.
 * This enum is used to compute various things including navigation elements.
 */
export enum ConsumerSpaceContextEnum {
  WEB = 'WEB',
  WIDGET = 'WIDGET',
  FAB = 'FAB',
  LOGIN_BUTTON = 'LOGIN_BUTTON',
}
