import { companyStore } from "#src/store";
import type { Company, UpsellSumup } from "#src/types";

export const setCompanies = (companies: Company[]) => {
  companyStore.setState((state) => {
    const byId = companies.reduce((acc, company) => {
      acc[company.id] = company;
      return acc;
    }, state.byId);

    return {
      byId,
      searchIds: companies.map((company) => company.id),
    };
  });
};

export const setFeatures = (features: UpsellSumup[]) => {
  companyStore.setState(() => {
    return { features };
  });
};
