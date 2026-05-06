import type { StaffFormData } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_MIN_LENGTH: 1,
  PASSWORD_MIN_LENGTH: 1,
  COMMISSION_MIN: 0,
  COMMISSION_MAX: 100,
  COMMISSION_STEP: 0.01,
};

export const STAFF_FORM_DEFAULTS: StaffFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  commissionPercentage: 0,
  role: "",
};
