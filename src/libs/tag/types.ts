import { ErrorAndLoading } from '../types';

export type Tag<TG = number> = {
  id: number;
  name: string;
  group?: TG;
  color: string;
  icon: string;
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
  tagUsage: {
    loading: boolean;
    error: Error;
    byId: { [key: string]: TagGroupAPI };
  };
  marketPlaceMemberTag: {
    loading: boolean;
    error?: Error;
    tagIdsList: Array<number>;
  };
};
