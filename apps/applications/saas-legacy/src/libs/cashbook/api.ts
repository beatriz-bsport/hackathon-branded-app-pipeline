import { AxiosResponse } from 'axios';
import { getAuth, patchAuth } from '../../http';
import { CashBook, CashBookUpdate } from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;

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
