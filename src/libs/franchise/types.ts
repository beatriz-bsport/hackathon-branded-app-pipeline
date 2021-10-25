export type FranchiseState = {
  error: null | boolean;
  loading: boolean;
  franchisor?: Franchise;
  users: {
    page: number;
    count: number;
    allIds: number[];
    byId: Record<number, FranchiseUser>;
  };
  companies: {
    byId: Record<number, FranchiseCompany>;
    allIds: number[];
  };
};

export type Franchise = {
  id: number;
  name: string;
  companies: number[];
  cover?: string;
  primaryRGB: [number, number, number];
  secondaryRGB: [number, number, number];
  marketing_email?: string;
};

export type FranchiseUser = {
  birthday?: string;
  companies: number[];
  company_member: Record<number, number>;
  email: string;
  id: number;
  name: string;
  phone: number;
  photo: string;
  vaccination_status?: boolean;
  address?: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    country: string;
    zipcode: string;
  };
};

export type FranchiseCompany = {
  id: number;
  cover: string;
  email: string;
  name: string;
  primaryRGB: [number, number, number];
  secondaryRGB: [number, number, number];
  websiteURL: string;
};
