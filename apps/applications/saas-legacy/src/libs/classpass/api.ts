import { getAuth, postAuth, patchAuth } from '../../http';

import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

const PARTNERSHIP_ENDPOINT = `${API_V1_URI}/partnership`;

export const fetchPartnershipList = () => {
  return getAuth(`${PARTNERSHIP_ENDPOINT}/partnership_company/`);
};

export const requestPartnership = (identifier: string) => {
  return postAuth(`${PARTNERSHIP_ENDPOINT}/partnership_company/request/`, {
    identifier,
  });
};

export const updateParntership = (id: number, data: any) => {
  return patchAuth(`${PARTNERSHIP_ENDPOINT}/partnership_company/${id}/`, data);
};

export const fetchPartnershipEstablishmentMergeList = () => {
  return getAuth(`${PARTNERSHIP_ENDPOINT}/partnership_establishment_merge/`);
};
