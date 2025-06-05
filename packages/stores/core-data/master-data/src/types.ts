export type scs = {
  id: number;
  name: string;
  slug: string;
};

export type sct = {
  name: string;
  id: number;
  scs: scs;
  language: string;
};
