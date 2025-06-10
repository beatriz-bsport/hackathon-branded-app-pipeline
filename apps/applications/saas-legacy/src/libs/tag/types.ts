import type { ErrorAndLoading } from '../types';

export type Tag<TG = number> = {
  id: number;
  name: string;
  group?: TG;
  color: string;
  icon: string;
  tag_template?: number;
};

export type TagGroup = {
  id: number;
  name: string;
  tags: Tag[];
  kind: number;
};

export type TagTemplate<TG = number> = {
  id: number;
  name: string;
  group?: TG;
  color: string;
  icon: string;
  group_template?: number;
};

export type TagGroupTemplate = {
  id: number;
  name: string;
  tags: number[];
  tag_templates: number[];
  kind: number;
};

export type TagGroupAPI = {
  id: number;
  name: string;
  tags: number[];
  kind: number;
  tag_group_template?: number;
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
  tagTemplate: ErrorAndLoading & {
    byId: { [key: string]: TagTemplate };
    items: TagTemplate[];
    createOrUpdate: ErrorAndLoading;
  };
  groupTemplate: ErrorAndLoading & {
    byId: { [key: string]: TagGroupTemplate };
    items: TagGroupTemplate[];
    createOrUpdate: ErrorAndLoading;
  };
  tagTemplateUsage: {
    loading: boolean;
    error: Error;
    byId: { [key: string]: TagGroupTemplate };
  };
  marketPlaceMemberTag: {
    loading: boolean;
    error?: Error;
    tagIdsList: Array<number>;
  };
};

export type TagOption = {
  label: string;
  value: number;
  tag: Tag<TagGroup> | Tag<TagGroupAPI>;
};

export type MergeTag = {
  name: string;
  value: string;
};

export type MergeTags = Record<string, MergeTag>;

export type TagCategory = {
  name: string;
  mergeTags: MergeTags;
};

export type ResolvedTags = Record<string, TagCategory>;
