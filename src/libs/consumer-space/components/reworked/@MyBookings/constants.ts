/**
 * Those constants are for the only purpose of height computing due to the infinite scroll component not being responsive
 * Height prop is required so we want to fill the remaining screen height space here
 */
export const MY_BOOKINGS_APP_BAR_COMPONENT_HEIGHT = 72; // once Fabrique app bar imported => 48
export const MY_BOOKINGS_HEADER_COMPONENT_HEIGHT = 40;
export const MY_BOOKINGS_TABS_COMPONENT_HEIGHT = 42;
export const MY_BOOKINGS_MOBILE_TABS_COMPONENT_HEIGHT = 48;
export const MY_BOOKINGS_FILTERS_COMPONENT_HEIGHT = 44;
export const MY_BOOKINGS_SPACING_HEIGHT = 32 + 16 + 8 + 24; // include all padding/margin
export const MY_BOOKINGS_FOOTER_COMPONENT_HEIGHT = 28;

export const MY_BOOKINGS_LIST_CONTAINER_HEIGHT = `calc(100dvh - ${MY_BOOKINGS_APP_BAR_COMPONENT_HEIGHT}px - ${MY_BOOKINGS_HEADER_COMPONENT_HEIGHT}px
    - ${MY_BOOKINGS_TABS_COMPONENT_HEIGHT}px - ${MY_BOOKINGS_FILTERS_COMPONENT_HEIGHT}px - ${MY_BOOKINGS_SPACING_HEIGHT}px)`;
export const MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT = `calc(100dvh - ${MY_BOOKINGS_APP_BAR_COMPONENT_HEIGHT}px - ${MY_BOOKINGS_HEADER_COMPONENT_HEIGHT}px
    - ${MY_BOOKINGS_MOBILE_TABS_COMPONENT_HEIGHT}px - ${MY_BOOKINGS_FILTERS_COMPONENT_HEIGHT}px - ${MY_BOOKINGS_SPACING_HEIGHT}px - ${MY_BOOKINGS_FOOTER_COMPONENT_HEIGHT}px) `;

export enum BookingFilterTabEnum {
  FUTURE = 'future',
  PAST = 'past',
  WAITLIST = 'waitlist',
}

export enum BookingTabEnum {
  ACTIVITY = 'activity',
  APPOINTMENT = 'appointment',
  WORKSHOP = 'workshop',
}
