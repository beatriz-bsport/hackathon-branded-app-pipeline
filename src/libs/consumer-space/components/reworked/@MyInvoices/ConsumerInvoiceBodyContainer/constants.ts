/**
 * Those constants are for the only purpose of height computing due to the infinite scroll component not being responsive
 * Height prop is required so we want to fill the remaining screen height space here
 */
const MY_INVOICES_APP_BAR_COMPONENT_HEIGHT = 72; // once Fabrique app bar imported => 48
const MY_INVOICES_HEADER_COMPONENT_HEIGHT = 100;
const MY_INVOICES_SPACING_HEIGHT_DESKTOP = 24 + 32; // include padding/margin
const MY_INVOICES_SPACING_HEIGHT_MOBILE = 16 + 16 + 16 + 16; // include padding/margin
const MY_INVOICES_FOOTER_HEIGHT = 58; // include padding/margin

export const MY_INVOICES_LIST_CONTAINER_HEIGHT_DESKTOP = `calc(100dvh - ${MY_INVOICES_APP_BAR_COMPONENT_HEIGHT}px - ${MY_INVOICES_HEADER_COMPONENT_HEIGHT}px - ${MY_INVOICES_SPACING_HEIGHT_DESKTOP}px)`;

export const MY_INVOICES_LIST_CONTAINER_HEIGHT_MOBILE = `calc(100dvh - ${MY_INVOICES_APP_BAR_COMPONENT_HEIGHT}px - ${MY_INVOICES_HEADER_COMPONENT_HEIGHT}px - ${MY_INVOICES_SPACING_HEIGHT_MOBILE}px - ${MY_INVOICES_FOOTER_HEIGHT}px)`;
