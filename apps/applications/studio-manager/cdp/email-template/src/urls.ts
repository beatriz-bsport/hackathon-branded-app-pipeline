export const ROUTES = {
  CUSTOM_TEMPLATES: "custom",
  MASTER_TEMPLATES: "master",
  BSPORT_TEMPLATES: "bsport",
  EMAIL_TEMPLATE_CREATE: "create",
  EMAIL_TEMPLATE_EDIT: ":id",
  LEGACY_EMAIL_TEMPLATE_DETAIL: "/email-template",
  LEGACY_CREATE_EMAIL_TEMPLATE: "/email-template/create",
};

export const LEGACY_URLS = {
  EDIT_EMAIL_TEMPLATE: (id: number) => `/email-template/${id}/edit`,
  CREATE_EMAIL_TEMPLATE: () => `/email-template/create`,
};
