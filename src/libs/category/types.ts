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

export type EasyAccess = {
  id: number;
  name: string;
  line: string[];
};

export type CategoryState = {
  SCTs: SCT[];
  SCSs: number[];
};
