import {
  selectFeatures,
  useCompanyStore,
} from "@bsport/store-core-data-company";

const useCompanyFeatures = () => {
  return useCompanyStore(selectFeatures);
};

export const dataAccessLayer = {
  useCompanyFeatures,
};
