import type { ContractFormData } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
};

export const DEFAULT_DATA: ContractFormData = {
  name: "",
  description: "",
  payment_pack: null,
  payment_pack_details: null,
};
