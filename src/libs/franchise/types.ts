export type FranchiseState = {
  error: null | boolean;
  loading: boolean;
  franchissor?: Franchise;
};

export type Franchise = {
  id: number;
  name: string;
  companies: number[];
  cover?: string;
  primaryRGB?: [number, number, number];
  secondaryRGB: [number, number, number];
};
