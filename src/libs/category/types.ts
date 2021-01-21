export type SCS = {
  id: number;
  name: string;
  slug: string;
};

export type SCT = {
  name: string;
  id: number;
  SCS: SCS;
};

export type EasyAccess = {
  id: number;
  name: string;
  line: string[];
};

export type CategoryState = {
  SCTs: SCT[];
  SCSs: number[];
  easyAccesses: EasyAccess[];
};
