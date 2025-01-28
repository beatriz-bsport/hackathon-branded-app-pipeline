import { cleanParams } from '../../utils/createUrlHandlers';
import {
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;

export async function fetchExpenseList(params: any) {
  const cleanedParams = cleanParams(params);
  return getAuth(
    `${API_V1_URI}/payment/expense/${buildUrlParams(cleanedParams)}`,
  );
}

export async function createExpense(data: any) {
  return postAuth(`${API_V1_URI}/payment/expense/`, data);
}

export async function updateExpense(data: any) {
  return patchAuth(`${API_V1_URI}/payment/expense/${data.id}/`, data);
}

export async function deleteExpense(id: number, data?: any) {
  return deleteAuth(`${API_V1_URI}/payment/expense/${id}/`, data);
}

export async function getCategories() {
  return getAuth(`${API_V1_URI}/payment/expense/category/`);
}

export async function getSuppliers() {
  return getAuth(`${API_V1_URI}/payment/expense/supplier/`);
}
