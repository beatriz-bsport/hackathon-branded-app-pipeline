import { API_URI, getAuth } from '../http';

export async function fetchAll() {
  return getAuth(`${API_URI}/saas/invoices`);
}

export default {
  fetchAll,
};
