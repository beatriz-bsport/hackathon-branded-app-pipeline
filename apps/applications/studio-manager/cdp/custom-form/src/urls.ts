export const ROUTES = {
  ACTIVE: "..",
  ARCHIVED: "archived",
};

export const LEGACY_URLS = {
  FORM_DETAILS: (formId: number) => `/custom-form/details/${formId}/general`,
} as const;
