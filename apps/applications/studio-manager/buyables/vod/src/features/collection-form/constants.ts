import type { CollectionFormData } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 500,
};

export const COLLECTION_FORM_DATA_DEFAULT: CollectionFormData = {
  name: "",
  description: "",
  cover: null,
};
