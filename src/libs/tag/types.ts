import { ErrorAndLoading } from '../types';

export type Tag = {
  id: number;
  name: string;
  group?: number;
};

export type TagGroup = {
  id: number;
  name: string;
  tags: Tag[];
  kind: number;
};

export type TagGroupAPI = {
  id: number;
  name: string;
  tags: number[];
  kind: number;
};

export type TagState = {
  tag: ErrorAndLoading & {
    byId: { [key: string]: Tag };
    items: Tag[];
    createOrUpdate: ErrorAndLoading;
  };
  group: ErrorAndLoading & {
    byId: { [key: string]: TagGroupAPI };
    items: TagGroupAPI[];
    createOrUpdate: ErrorAndLoading;
  };
};
