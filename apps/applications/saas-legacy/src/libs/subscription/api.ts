import { AxiosResponse } from 'axios';
import type { SubscriptionFilter } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
import {
  buildUrlParams,
  deleteAuth,
  getAuth,
  postAuth,
  post,
  patchAuth,
  putAuth,
  API_V1_URI,
} from '../../http';
import type {
  PauseRequestData,
  ContractPauseRequestData,
  SubscriptionQueryParams,
  PlannedInvoice,
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
  SubscriptionDetailsQueryParams,
  ContractQueryParams,
  ContractTemplate,
  ContractTemplatePaginatedQueryParams,
  ContractTemplatePayload,
  SubscriptionPaymentMethodParams,
  Contract,
  ContractPayload,
} from './types';
import type { PaginationFilterParams } from '#src/libs/types';
import type { PaginatedResponse } from '#src/state/types';
import { cleanParams } from '#src/utils/createUrlHandlers';
import Config from '../../config';

const API_V1_URI_FS = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;

const API_URI = Config.REACT_APP_BASE_URI_BUYABLE_V0;

const fetchAll = async (params: SubscriptionQueryParams) => {
  return getAuth(
    `${API_URI}/subscription/billing-plan/${buildUrlParams(params)}`,
  );
};

export const fetchMemberSubscriptionsInAllFranchise = (
  memberId: number,
  params: SubscriptionQueryParams,
) => {
  return getAuth<PaginatedResponse<SubscriptionREST>>(
    `${API_URI}/subscription/billing-plan/member/${memberId}/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchSubscriptionsList = (params: SubscriptionQueryParams) => {
  return getAuth<PaginatedResponse<SubscriptionREST>>(
    `${API_URI}/subscription/billing-plan/${buildUrlParams(params)}`,
  );
};

export const fetchConsumerSubscriptionList = async (
  params: SubscriptionQueryParams,
) => {
  return getAuth<PaginatedResponse<SubscriptionREST>>(
    `${API_URI}/subscription/consumer-billing-plan/${buildUrlParams(params)}`,
  );
};

export const fetchConsumerSubscription = (
  id: number,
  params: { member: number; status: SubscriptionFilter },
) => {
  return getAuth<SubscriptionREST>(
    `${API_URI}/subscription/consumer-billing-plan/${id}/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchConsumerSubscriptionInvoicesDetails = (
  params: SubscriptionDetailsQueryParams,
) => {
  return getAuth<PaginatedResponse<SubscriptionsInvoicesDetailsREST>>(
    `${API_V1_URI_FS}/payment/consumer-billing-plan-invoices/${buildUrlParams(
      params,
    )}`,
  );
};

const fetchDetail = async (id: number) => {
  return getAuth(`${API_URI}/subscription/billing-plan/${id}/`);
};

const createFromPack = async (data: any) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/create_from_pack/`,
    data,
  );
};

const stop = async (id: number, params: any) => {
  return deleteAuth(`${API_URI}/subscription/billing-plan/${id}/stop/`, params);
};

export const stopSubscriptionAsMember = async (id: number) => {
  return putAuth<SubscriptionREST>(
    `${API_URI}/subscription/billing-plan/${id}/schedule_stop_from_member_side/`,
  );
};

export const fetchPlannedInvoiceList = async (
  page: number,
  page_size: number,
  params: any = {},
) => {
  return getAuth(
    `${API_URI}/subscription/planned-invoice/${buildUrlParams({
      page,
      page_size,
      ...params,
    })}`,
  );
};

const fetchContractList = async (params: ContractQueryParams = {}) => {
  return getAuth(`${API_URI}/subscription/contract/${buildUrlParams(params)}`);
};

export const fetchContractDetail = async (id: number) => {
  return getAuth(`${API_URI}/subscription/contract/${id}/`);
};

const createOrUpdateContract = async (data: any) => {
  if (data.id) {
    return patchAuth(`${API_URI}/subscription/contract/${data.id}/`, data);
  }
  return postAuth(`${API_URI}/subscription/contract/`, data);
};

const deleteContract = async (id: number) => {
  return deleteAuth(`${API_URI}/subscription/contract/${id}/`);
};

export const restoreContract = async (id: number) => {
  return putAuth(`${API_URI}/subscription/contract/${id}/restore/`);
};

export const postContractSubscription = async (id: number, data: any = {}) => {
  return postAuth(`${API_URI}/subscription/contract/${id}/register/`, {
    ...data,
    is_v2: true,
  });
};

export const registerContractBackground = async (
  id: number,
  data: any = {},
) => {
  return postAuth(
    `${API_URI}/subscription/contract/${id}/register_background/`,
    {
      ...data,
      is_v2: true,
    },
  );
};

export const registerContractSubscriptionUnauthenticated = async (
  id: number,
  data: any,
) => {
  return post(
    `${API_URI}/subscription/contract/${id}/register_background/`,
    data,
  );
};

export const updatePlannedInvoiceDate = async (
  id: number,
  data: {
    date: string;
    planned_invoice: number;
  },
) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${id}/update_date/`,
    data,
  );
};

export const updatePlannedInvoicePrice = async (
  id: number,
  data: {
    planned_invoice: number;
    price: string;
    update_all: boolean;
    update_recurrent_price: boolean;
  },
) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${id}/update_price/`,
    data,
  );
};

export const updateSubscriptionRenewal = async (id: number, data: any) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${id}/update_renewal/`,
    data,
  );
};

export const freezeSubscription = async (
  id: number,
  data: PauseRequestData,
) => {
  return postAuth<void, PauseRequestData>(
    `${API_URI}/subscription/billing-plan/${id}/pause/`,
    data,
  );
};

export const switchSubscriptionPaymentPack = async (
  id: number,
  data: { payment_pack: number },
) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${id}/switch_payment_pack/`,
    data,
  );
};

export const switchSubscriptionPrivatePass = async (
  id: number,
  data: { private_pass: number },
) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${id}/switch_private_pass/`,
    data,
  );
};
export const switchSubscriptionPaymentCombo = async (
  id: number,
  data: { payment_combo: number },
) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${id}/switch_payment_combo/`,
    data,
  );
};
export const switchSubscriptionPaymentMethod = async ({
  id,
  payment_method_identifier,
  payment_method_id,
  source,
}: SubscriptionPaymentMethodParams) => {
  return postAuth<SubscriptionREST>(
    `${API_URI}/subscription/billing-plan/${id}/switch_payment_provider/`,
    { payment_method_identifier, source, payment_method_id },
  );
};

export const flagPlannedInvoiceAsLast = async (
  id: number,
  note?: string,
): Promise<AxiosResponse<PlannedInvoice>> => {
  return putAuth(
    `${API_URI}/subscription/planned-invoice/${id}/flag_as_last/`,
    { note },
  );
};

export const unflagPlannedInvoiceAsLast = async (id: number) => {
  return putAuth(
    `${API_URI}/subscription/planned-invoice/${id}/unflag_as_last/`,
  );
};

export const cancelPause = async (billingPlanId: number, id: number) => {
  return deleteAuth(
    `${API_URI}/subscription/billing-plan/${billingPlanId}/cancel_pause/`,
    {
      id,
    },
  );
};

// ---------- CONTRACT PAUSE ----------

export const fetchContractPauseList = async (params: any = {}) => {
  return getAuth(
    `${API_URI}/subscription/contract_pause/${buildUrlParams(params)}`,
  );
};

export const fetchContractPause = async (id: number) => {
  return getAuth(`${API_URI}/subscription/contract_pause/${id}/`);
};

export const fetchContractPauseInfo = async (data: {
  contract_id: number;
  from_date: string;
  until_date: string;
  contract_pause_id?: number;
}) => {
  return postAuth(`${API_URI}/subscription/contract_pause/get_info/`, data);
};

export const createOrUpdateContractPause = async (
  data: ContractPauseRequestData,
) => {
  if (data.contract_pause_id) {
    return patchAuth(
      `${API_URI}/subscription/contract_pause/${data.contract_pause_id}/`,
      data,
    );
  }
  return postAuth(`${API_URI}/subscription/contract_pause/`, data);
};

export const updateOnlyContractPauseName = async (
  contract_pause_id: number,
  name: string,
) => {
  return postAuth(
    `${API_URI}/subscription/contract_pause/${contract_pause_id}/update_only_name/`,
    { name },
  );
};

export const deleteContractPause = async (contract_pause_id: number) => {
  return deleteAuth(
    `${API_URI}/subscription/contract_pause/${contract_pause_id}/`,
  );
};

export const downloadPDFContractTermsForContract = async (
  contractId: number,
): Promise<AxiosResponse<{ filepath: string }>> => {
  return getAuth(
    `${API_URI}/subscription/contract/${contractId}/download_contract_terms/`,
  );
};

export const downloadPDFContractTermsForBillingPlan = async (
  billingPlanId: number,
): Promise<AxiosResponse<{ filepath: string }>> => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${billingPlanId}/download_contract_terms/`,
  );
};

export default {
  fetchSubscriptionList: fetchAll,
  fetchDetail,
  createFromPack,
  stop,
  fetchContractList,
  createOrUpdateContract,
  deleteContract,
};

export const fetchContractTemplateList = (
  params?: ContractTemplatePaginatedQueryParams,
) => {
  const cleanedParams = cleanParams(params);
  return getAuth<PaginatedResponse<ContractTemplate>>(
    `${API_URI}/subscription/contract-template/${buildUrlParams(
      cleanedParams,
    )}`,
  );
};

export const deleteContractTemplate = (id: number) => {
  return deleteAuth(`${API_URI}/subscription/contract-template/${id}/`);
};

export const restoreContractTemplate = (id: number) => {
  return postAuth(`${API_URI}/subscription/contract-template/${id}/restore/`);
};

export const fetchContractTemplateDetail = (id: number) => {
  return getAuth<ContractTemplate>(
    `${API_URI}/subscription/contract-template/${id}/`,
  );
};

export const fetchContractTemplateRelatedBillingPlans = (
  id: number,
  params: PaginationFilterParams,
) => {
  const cleanedParams = cleanParams(params);
  return getAuth<PaginatedResponse<SubscriptionREST>>(
    `${API_URI}/subscription/contract-template/${id}/billing-plans/${buildUrlParams(
      cleanedParams,
    )}`,
  );
};

export const createOrUpdateContractTemplate = (
  data: ContractTemplatePayload,
) => {
  return data.id
    ? patchAuth<ContractTemplate>(
        `${API_URI}/subscription/contract-template/${data.id}/`,
        data,
      )
    : postAuth<ContractTemplate>(
        `${API_URI}/subscription/contract-template/`,
        data,
      );
};

// ---------------------------------------- CONTRACT REVAMP API ----------------------------------------

export const createContract = async (data: ContractPayload) => {
  return postAuth<Contract>(`${API_V1_URI}/subscription/contract/`, data);
};

export const updateContract = async (data: ContractPayload) => {
  if (!data?.id) {
    throw new Error('Missing contract ID, which is required for update.');
  }
  return putAuth<Contract>(
    `${API_V1_URI}/subscription/contract/${data?.id}/`,
    data,
  );
};
