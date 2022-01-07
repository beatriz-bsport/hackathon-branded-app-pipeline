import {
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  API_V1_URI,
  buildUrlParams,
} from '../../http';

export async function fetchExpenseList(params: any) {
  return getAuth(`${API_V1_URI}/payment/expense/${buildUrlParams(params)}`);
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
