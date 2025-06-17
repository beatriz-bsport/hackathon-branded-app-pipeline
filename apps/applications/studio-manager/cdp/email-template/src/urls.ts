export const ROUTES = {
  CUSTOM_TEMPLATES: "custom",
  MASTER_TEMPLATES: "master",
  BSPORT_TEMPLATES: "bsport",
  EMAIL_TEMPLATE_CREATE: "create",
  EMAIL_TEMPLATE_EDIT: (id: number) => `${id}/`,
  LEGACY_EMAIL_TEMPLATE_DETAIL: "/email-template",
  LEGACY_CREATE_EMAIL_TEMPLATE: "/email-template/create",
};
