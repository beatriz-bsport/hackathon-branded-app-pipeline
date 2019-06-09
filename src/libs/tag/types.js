// @flow

export type Tag = {
  id: number,
  name: string,
  group?: number,
};

export type TagGroup = {
  id: number,
  name: string,
  tags: Array<Tag>,
  kind: number,
};

export type TagGroupAPI = {
  id: number,
  name: string,
  tags: Array<number>,
  kind: number,
};

export type TagState = {
  tag: {
    items: Array<Tag>,
    loading: boolean,
    error: ?Error,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
  },
  group: {
    items: Array<TagGroupAPI>,
    loading: boolean,
    error: ?Error,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
  },
};
