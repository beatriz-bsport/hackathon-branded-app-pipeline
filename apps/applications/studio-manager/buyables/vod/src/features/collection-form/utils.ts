import type { Collection } from "@bsport/api-buyables/collection";

import { COLLECTION_FORM_DATA_DEFAULT } from "./constants";
import type { CollectionFormData } from "./types";

export function transformCollectionIntoFormState(
  collection: Collection,
): CollectionFormData {
  return {
    name: collection.name,
    description:
      collection.description ?? COLLECTION_FORM_DATA_DEFAULT.description,
    cover: collection.cover_main ?? COLLECTION_FORM_DATA_DEFAULT.cover,
  };
}

export function transformFormStateIntoAPIData(
  formState: CollectionFormData,
  companyId: number,
): FormData {
  const formData = new FormData();

  formData.append("company", String(companyId));
  formData.append("name", formState.name);

  if (formState.description) {
    formData.append("description", formState.description);
  }

  if (formState.cover && typeof formState.cover !== "string") {
    formData.append("cover_main", formState.cover);
  }

  return formData;
}
