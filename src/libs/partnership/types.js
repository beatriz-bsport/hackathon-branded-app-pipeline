// @flow

export type PartnershipCompany = {
  identifier: string,
  company: number,
  date_created: number,
  partnership: number,
};

export type PartnershipState = {
  byId: { [number]: PartnershipCompany },
  allids: Array<number>,
  loading: boolean,
  error: ?Error,
  createorupdate: {
    loading: boolean,
    error: ?Error,
  },
};
