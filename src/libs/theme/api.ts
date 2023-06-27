// @ts-ignore
import { API_V1_URI, getAuth, patchAuth } from '../../http';

const fetchCompanyTheme = async (companyId: number) => {
  return getAuth(`${API_V1_URI}/company/theme/${companyId || 'me'}/`);
};

const updateCompanyTheme = async (companyId: number, data: any) => {
  return patchAuth(`${API_V1_URI}/company/theme/${companyId}/`, data);
};

export default {
  fetchCompanyTheme,
  updateCompanyTheme,
};
