// @flow
import { getAuth, postAuth, patchAuth, API_V1_URI } from '../../http';

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
