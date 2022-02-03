import { CompanyWithTheme } from '../company/types';

export type FranchiseState = {
  error: null | boolean;
  loading: {
    payload: string;
    loading: boolean;
  };
  franchisor?: Franchise | FranchiseDetails;
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
  companyGroup: {
    allIds: Array<number>;
    byId: { [id: number]: CompanyGroup };
    loading: boolean;
    error: Error | null;
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

export type CompanyGroup = {
  id: number;
  name: string;
  companies: number[];
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

export type FranchiseDetails = Franchise & {
  companies: Array<CompanyWithTheme>;
  primary_color: string;
  secondary_color: string;
};

export type FranchiseTheme = Franchise | FranchiseDetails | FranchiseCompany;
