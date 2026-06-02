const SETTINGS_WIDGET = "/settings/widget";
const SETTINGS_WIDGET_CUSTOMIZE_CSS = `${SETTINGS_WIDGET}/customize-css`;
const SETTINGS_WIDGET_CREATE = `${SETTINGS_WIDGET}/create`;

export const ROUTES = {
  CREATE: "/",
};

export const ABSOLUTE_ROUTES = {
  CREATE: SETTINGS_WIDGET_CREATE,
};

export const LEGACY_URLS = {
  CREATE: SETTINGS_WIDGET_CREATE,
  CUSTOMIZE: `${SETTINGS_WIDGET}/customize`,
  CUSTOM_CSS: `${SETTINGS_WIDGET_CUSTOMIZE_CSS}/calendar/cardOffer`,
};
