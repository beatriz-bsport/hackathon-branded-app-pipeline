import { API_URI, getAuth } from '../http';

export async function fetchTransactions() {
  return getAuth(`${API_URI}/saas/transactions`);
}

export default {
  fetchTransactions,
};
