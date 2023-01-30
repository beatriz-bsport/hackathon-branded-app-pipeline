import { AxiosResponse } from 'axios';
import { API_V1_URI, getAuth, patchAuth } from '../../http';
import { CashBook } from './types';

const fetchCashBook: (
  companyId: number,
) => Promise<AxiosResponse<CashBook>> = async (companyId) => {
  return getAuth(`${API_V1_URI}/cashbook/cashbook/${companyId}/`);
};

const updateCashBook: (data: {
  amount: number;
  dateUpdated: string;
  todayEndAmount: number;
  todayStartAmount: number;
}) => Promise<AxiosResponse<CashBook>> = async (data) => {
  return patchAuth(`${API_V1_URI}/cashbook/cashbook/edit/`, data);
};

export default {
  fetchCashBook,
  updateCashBook,
};
