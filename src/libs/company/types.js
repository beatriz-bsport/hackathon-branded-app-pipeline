// @flow

export type Company = {
  id: number,
  name: string,
  email: string,
  websiteURL: string,
  cover: string,
};

export type CompanyState = {
  byId: {
    [id: number]: Company,
  },
  search: {
    loading: boolean,
    error: ?Error,
    allIds: Array<number>,
  },
};
