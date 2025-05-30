export const ROUTES = {
  CUSTOM_TEMPLATES: "custom",
  MASTER_TEMPLATES: "master",
  BSPORT_TEMPLATES: "bsport",
  EMAIL_TEMPLATE_DETAIL: "/email-template",
  CREATE_EMAIL_TEMPLATE: "/email-template/create",
};

export const LEGACY_URLS = {
  EDIT_EMAIL_TEMPLATE: (id: number) => `/email-template/${id}/edit`,
  CREATE_EMAIL_TEMPLATE: () => `/email-template/create`,
};
