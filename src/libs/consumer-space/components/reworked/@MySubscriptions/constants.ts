export enum SubscriptionTabEnum {
  ACTIVE = 'active',
  FUTURE = 'future',
  EXPIRED = 'expired',
}

/**
 * Those constants are for the only purpose of height computing due to the infinite scroll component not being responsive
 * Height prop is required so we want to fill the remaining screen height space here
 */
export const MY_SUBSCRIPTIONS_APP_BAR_COMPONENT_HEIGHT = 64; // once Fabrique app bar imported => 48
export const MY_SUBSCRIPTIONS_HEADER_COMPONENT_HEIGHT = 40;
export const MY_SUBSCRIPTIONS_TABS_COMPONENT_HEIGHT = 44;
export const MY_SUBSCRIPTIONS_SPACING_HEIGHT_DESKTOP = 16 + 16 + 16 + 32; // include all padding/margin
export const MY_SUBSCRIPTIONS_SPACING_HEIGHT_MOBILE = 16 + 16 + 16 + 16; // include all padding/margin
export const MY_SUBSCRIPTIONS_FOOTER_COMPONENT_HEIGHT = 125;

export const MY_SUBSCRIPTIONS_LIST_CONTAINER_HEIGHT_DESKTOP = `calc(100dvh - ${MY_SUBSCRIPTIONS_APP_BAR_COMPONENT_HEIGHT}px - ${MY_SUBSCRIPTIONS_HEADER_COMPONENT_HEIGHT}px
  - ${MY_SUBSCRIPTIONS_TABS_COMPONENT_HEIGHT}px - ${MY_SUBSCRIPTIONS_SPACING_HEIGHT_DESKTOP}px)`;

export const MY_SUBSCRIPTIONS_LIST_CONTAINER_HEIGHT_MOBILE = `calc(100dvh - ${MY_SUBSCRIPTIONS_APP_BAR_COMPONENT_HEIGHT}px - ${MY_SUBSCRIPTIONS_HEADER_COMPONENT_HEIGHT}px
    - ${MY_SUBSCRIPTIONS_TABS_COMPONENT_HEIGHT}px - ${MY_SUBSCRIPTIONS_SPACING_HEIGHT_MOBILE}px - ${MY_SUBSCRIPTIONS_FOOTER_COMPONENT_HEIGHT}px)`;

export const LIST_ITEM_HEIGHT = 60;
