import type { RoleFormData } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
};

export const ROLE_FORM_DEFAULTS: RoleFormData = {
  name: "",
  description: "",
  starterRoleId: "",
};
