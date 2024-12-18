import { API_V1_URI, getAuth, patchAuth, postAuth } from '../../http';
import type { QuickbooksApp } from './types';

export const fetchQuickbooksApp = async (companyId: number) => {
  return getAuth(
    `${API_V1_URI}/quickbooks_app/company_quickbooks_app/${companyId}/`,
  );
};

export const updateQuickbooksApp = (companyId: number, data: QuickbooksApp) => {
  return patchAuth(
    `${API_V1_URI}/quickbooks_app/company_quickbooks_app/${companyId}/`,
    data,
  );
};

export const requestQuickBooksAccessToken = ({
  companyId,
  code,
  realm_Id,
  redirect_uri,
}: {
  companyId: number;
  code: string;
  realm_Id: string;
  redirect_uri: string;
}) => {
  return postAuth(
    `${API_V1_URI}/quickbooks_app/company_quickbooks_app/${companyId}/request_access_token/`,
    {
      code,
      redirect_uri,
      realm_Id,
    },
  );
};

export const revokeQuickbooksApp = (companyId: number) => {
  return postAuth(
    `${API_V1_URI}/quickbooks_app/company_quickbooks_app/${companyId}/revoke_access_token/`,
  );
};

export const fetchQuickbooksTaxAgencies = (
  company_id: number,
  data: { refresh: boolean } = { refresh: false },
) => {
  return postAuth(
    `${API_V1_URI}/quickbooks_app/company_quickbooks_app/${company_id}/get_tax_agencies/`,
    data,
  );
};

export const fetchQuickbooksTaxCodes = (
  company_id: number,
  data: { refresh: boolean } = { refresh: false },
) => {
  return postAuth(
    `${API_V1_URI}/quickbooks_app/company_quickbooks_app/${company_id}/get_tax_codes/`,
    data,
  );
};

export const setQuickBooksTaxCodes = (
  company_id: number,
  data: { tax_code: { name: string; value: string } },
) => {
  return postAuth(
    `${API_V1_URI}/quickbooks_app/company_quickbooks_app/${company_id}/set_tax_code/`,
    data,
  );
};
