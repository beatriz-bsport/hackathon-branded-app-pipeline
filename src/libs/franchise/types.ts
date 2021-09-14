export type FranchiseState = {
  error: null | boolean;
  loading: boolean;
  id: null | number;
  ownedCompanies: null | number[];
  name: null | string;
  theme: FranchiseTheme;
  users: {
    page: number;
    count: number;
    allIds: number[];
    byId: Record<number, FranchiseUser>;
  };
  companies: {
    allIds: number[];
    byId: Record<number, FranchiseCompany>;
  };
};

export type FranchiseTheme = {
  cover?: string;
  primaryRGB: string;
  secondaryRGB: string;
};
