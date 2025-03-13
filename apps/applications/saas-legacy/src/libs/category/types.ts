export type SCS = {
  id: number;
  name: string;
  slug: string;
};

export type SCT = {
  name: string;
  id: number;
  SCS: SCS;
  language: string;
};

export type CategoryState = {
  isLoading: boolean;
  SCTs: SCT[];
  SCSs: number[];
};
