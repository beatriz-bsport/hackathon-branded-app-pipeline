/**
 * Those constants are for the only purpose of height computing due to the infinite scroll component not being responsive
 * Height prop is required so we want to fill the remaining screen height space here
 */
export const MY_PASSES_APP_BAR_COMPONENT_HEIGHT = 72; // once Fabrique app bar imported => 48
export const MY_PASSES_HEADER_COMPONENT_HEIGHT = 40;
export const MY_PASSES_TABS_COMPONENT_HEIGHT = 42;
export const MY_PASSES_FILTERS_COMPONENT_HEIGHT = 44;

export const MY_PASSES_MOBILE_TABS_COMPONENT_HEIGHT = 48;
export const MY_PASSES_SPACING_HEIGHT = 32 + 16 + 8 + 24; // include all padding/margin
export const MY_PASSES_FOOTER_COMPONENT_HEIGHT = 125;

export const MY_PASSES_LIST_CONTAINER_HEIGHT = `calc(100dvh - ${MY_PASSES_APP_BAR_COMPONENT_HEIGHT}px - ${MY_PASSES_HEADER_COMPONENT_HEIGHT}px
    - ${MY_PASSES_TABS_COMPONENT_HEIGHT}px - ${MY_PASSES_FILTERS_COMPONENT_HEIGHT}px - ${MY_PASSES_SPACING_HEIGHT}px)`;
export const MY_PASSES_MOBILE_LIST_CONTAINER_HEIGHT = `calc(100dvh - ${MY_PASSES_APP_BAR_COMPONENT_HEIGHT}px - ${MY_PASSES_HEADER_COMPONENT_HEIGHT}px
    - ${MY_PASSES_MOBILE_TABS_COMPONENT_HEIGHT}px - ${MY_PASSES_FILTERS_COMPONENT_HEIGHT}px - ${MY_PASSES_SPACING_HEIGHT}px - ${MY_PASSES_FOOTER_COMPONENT_HEIGHT}px) `;

export enum PassTabEnum {
  CONSUMER_PAYMENT_PACK = 'consumerPaymentPack',
  PRIVATE_CONSUMER_PASS = 'privateConsumerPass',
  UNIVERSAL_PASS = 'universalPass',
}

export enum PassFilterTabEnum {
  ACTIVE = 'active',
  FUTURE = 'future',
  EXPIRED = 'expired',
}
