import { AxiosResponse } from 'axios';
import { API_V1_URI, getAuth, patchAuth } from '../../http';
import { CashBook, CashBookUpdate } from './types';

const fetchCashBook: (
  companyId: number,
) => Promise<AxiosResponse<CashBook>> = async (companyId) => {
  return getAuth(`${API_V1_URI}/cashbook/cashbook/${companyId}/`);
};

const updateCashBook: (
  data: CashBookUpdate,
) => Promise<AxiosResponse<CashBook>> = async (data) => {
  return patchAuth(`${API_V1_URI}/cashbook/cashbook/edit/`, data);
};

export default {
  fetchCashBook,
  updateCashBook,
};
