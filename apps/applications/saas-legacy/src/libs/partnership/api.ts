import {
  buildUrlParams,
  deleteAuth,
  getAuth,
  patchAuth,
  postAuth,
} from '#src/http';

import Config from '#src/config';
import {
  PartnershipAccount,
  PartnershipAccountFilters,
  PartnershipAccountPayload,
} from '#src/libs/partnership/types';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

export const getPartnershipAccounts = (params: PartnershipAccountFilters) => {
  return getAuth<PartnershipAccount[]>(
    `${API_V1_URI}/partnership/partnership_account/${buildUrlParams(params)}`,
  );
};

export const createPartnershipAccount = (data: PartnershipAccountPayload) => {
  return postAuth<PartnershipAccount>(
    `${API_V1_URI}/partnership/partnership_account/create_venue/`,
    data,
  );
};

export const deletePartnershipAccount = (accountId: string) => {
  return deleteAuth<PartnershipAccount>(
    `${API_V1_URI}/partnership/partnership_account/${accountId}/`,
  );
};

export const updatePartnershipAccount = (
  accountId: string,
  data: PartnershipAccountPayload,
) => {
  return patchAuth<PartnershipAccount>(
    `${API_V1_URI}/partnership/partnership_account/${accountId}/`,
    data,
  );
};

export const activatePartnershipAccount = (accountId: string) => {
  return postAuth<PartnershipAccount>(
    `${API_V1_URI}/partnership/partnership_account/${accountId}/activate/`,
  );
};
