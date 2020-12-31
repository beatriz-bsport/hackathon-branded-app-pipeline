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
  feature: {
    data: { upsell_identifier: number, readable_identifier: number}[]
    loading: boolean,
    error?: Error,
  },
  search: {
    loading: boolean,
    error?: Error,
    allIds: Array<number>,
  },
};
